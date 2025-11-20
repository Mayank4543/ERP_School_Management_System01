import { 
  Controller, 
  Post, 
  UploadedFile, 
  UseInterceptors, 
  BadRequestException,
  UseGuards,
  Query 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudflareR2Service } from '../../common/services/cloudflare-r2.service';

@Controller('upload')
// @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
export class UploadController {
  constructor(private readonly cloudflareR2Service: CloudflareR2Service) {}

  @Post('test')
  async testUpload() {
    return {
      success: true,
      message: 'Upload endpoint is working',
      timestamp: new Date().toISOString(),
      r2Config: {
        endpoint: this.cloudflareR2Service['endpoint'],
        bucketName: this.cloudflareR2Service['bucketName'],
        hasCredentials: !!(this.cloudflareR2Service['r2Client'])
      }
    };
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type?: string // profile, student, teacher, admin
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate the image file using R2 service
    const validation = this.cloudflareR2Service.validateImageFile(file);
    if (!validation.isValid) {
      throw new BadRequestException(validation.error);
    }

    try {
      console.log('Starting upload process:', {
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadType: type
      });

      let imageUrl: string;

      // Upload based on type using R2 service
      switch (type) {
        case 'profile':
          imageUrl = await this.cloudflareR2Service.uploadProfileImage(
            file.buffer, 
            file.originalname, 
            file.mimetype
          );
          break;
        case 'student':
          imageUrl = await this.cloudflareR2Service.uploadStudentImage(
            file.buffer, 
            file.originalname, 
            file.mimetype
          );
          break;
        case 'teacher':
          imageUrl = await this.cloudflareR2Service.uploadTeacherImage(
            file.buffer, 
            file.originalname, 
            file.mimetype
          );
          break;
        case 'admin':
          imageUrl = await this.cloudflareR2Service.uploadAdminImage(
            file.buffer, 
            file.originalname, 
            file.mimetype
          );
          break;
        default:
          imageUrl = await this.cloudflareR2Service.uploadFile(
            file.buffer, 
            file.originalname, 
            'uploads', 
            file.mimetype
          );
      }

      console.log('Upload successful, image URL:', imageUrl);

      return {
        success: true,
        data: {
          imageUrl: imageUrl
        },
        message: 'Image uploaded successfully to Cloudflare R2',
        fileInfo: {
          name: file.originalname,
          size: file.size,
          type: file.mimetype,
          uploadType: type
        }
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file size (10MB for documents)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 10MB.');
    }

    try {
      const documentUrl = await this.cloudflareR2Service.uploadDocument(
        file.buffer, 
        file.originalname, 
        file.mimetype,
        folder || 'documents'
      );

      return {
        success: true,
        data: {
          documentUrl: documentUrl
        },
        message: 'Document uploaded successfully to Cloudflare R2',
        fileInfo: {
          name: file.originalname,
          size: file.size,
          type: file.mimetype,
          folder: folder || 'documents'
        }
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }
}