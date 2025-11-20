import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudflareR2Service {
  private r2Client: S3Client;
  private bucketName: string;
  private endpoint: string;

  constructor(private configService: ConfigService) {
    // Cloudflare R2 Configuration
    this.endpoint = this.configService.get<string>('R2_ENDPOINT');
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME');
    
    this.r2Client = new S3Client({
      region: 'auto',
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('R2_SECRET_ACCESS_KEY'),
      },
    });
  }

  /**
   * Upload file to Cloudflare R2
   * @param file - File buffer
   * @param fileName - Name for the file
   * @param folder - Folder path (e.g., 'profiles', 'students', 'teachers')
   * @param contentType - MIME type of the file
   */
  async uploadFile(
    file: Buffer,
    fileName: string,
    folder: string = 'uploads',
    contentType: string = 'application/octet-stream'
  ): Promise<string> {
    try {
      const key = `${folder}/${Date.now()}-${fileName}`;
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: contentType,
        Metadata: {
          'upload-timestamp': Date.now().toString(),
          'original-name': fileName,
          'folder': folder,
        },
      });

      await this.r2Client.send(command);

     
      const publicUrl = this.configService.get<string>('R2_PUBLIC_URL');
      if (publicUrl) {
        return `${publicUrl}/${key}`;
      }
      
     
      return `${this.endpoint}/${key}`;
    } catch (error) {
      console.error('Cloudflare R2 Upload Error:', error);
      
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Delete file from Cloudflare R2
   * @param fileUrl - Full URL of the file to delete
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract key from URL
      const url = new URL(fileUrl);
      const key = url.pathname.replace(`/${this.bucketName}/`, '');
      
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.r2Client.send(command);
    } catch (error) {
      console.error('Cloudflare R2 Delete Error:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Upload profile image
   */
  async uploadProfileImage(file: Buffer, fileName: string, contentType: string): Promise<string> {
    return this.uploadFile(file, fileName, 'profiles', contentType);
  }

  /**
   * Upload student image
   */
  async uploadStudentImage(file: Buffer, fileName: string, contentType: string): Promise<string> {
    return this.uploadFile(file, fileName, 'students', contentType);
  }

  /**
   * Upload teacher image
   */
  async uploadTeacherImage(file: Buffer, fileName: string, contentType: string): Promise<string> {
    return this.uploadFile(file, fileName, 'teachers', contentType);
  }

  /**
   * Upload admin image
   */
  async uploadAdminImage(file: Buffer, fileName: string, contentType: string): Promise<string> {
    return this.uploadFile(file, fileName, 'admins', contentType);
  }

  /**
   * Upload document
   */
  async uploadDocument(file: Buffer, fileName: string, contentType: string, folder: string = 'documents'): Promise<string> {
    return this.uploadFile(file, fileName, folder, contentType);
  }

  /**
   * Validate image file
   */
  validateImageFile(file: Express.Multer.File): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      return { 
        isValid: false, 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' 
      };
    }

    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: 'File size too large. Maximum size is 5MB.' 
      };
    }

    return { isValid: true };
  }
}