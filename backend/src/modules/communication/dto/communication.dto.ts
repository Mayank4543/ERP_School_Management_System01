import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, IsArray, IsBoolean } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ description: 'Sender ID' })
  @IsString()
  @IsNotEmpty()
  sender_id: string;

  @ApiProperty({ description: 'Sender type', enum: ['admin', 'teacher', 'student', 'parent'] })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['admin', 'teacher', 'student', 'parent'])
  sender_type: string;

  @ApiProperty({ description: 'Recipient ID (for direct messages)', required: false })
  @IsString()
  @IsOptional()
  recipient_id?: string;

  @ApiProperty({ description: 'Recipient type', enum: ['admin', 'teacher', 'student', 'parent', 'class'], required: false })
  @IsString()
  @IsOptional()
  @IsEnum(['admin', 'teacher', 'student', 'parent', 'class'])
  recipient_type?: string;

  @ApiProperty({ description: 'Message type', enum: ['direct', 'broadcast', 'announcement'] })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['direct', 'broadcast', 'announcement'])
  message_type: string;

  @ApiProperty({ description: 'Message subject' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Priority', enum: ['low', 'medium', 'high'], default: 'medium' })
  @IsString()
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: string;

  @ApiProperty({ description: 'Attachment URLs', required: false })
  @IsArray()
  @IsOptional()
  attachments?: string[];

  @ApiProperty({ description: 'School ID' })
  @IsString()
  @IsNotEmpty()
  school_id: string;
}

export class BroadcastMessageDto {
  @ApiProperty({ description: 'Sender ID' })
  @IsString()
  @IsNotEmpty()
  sender_id: string;

  @ApiProperty({ description: 'Sender type', enum: ['admin', 'teacher'] })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['admin', 'teacher'])
  sender_type: string;

  @ApiProperty({ description: 'Target standard (class)' })
  @IsNumber()
  @IsNotEmpty()
  target_standard: number;

  @ApiProperty({ description: 'Target section ID' })
  @IsString()
  @IsNotEmpty()
  target_section_id: string;

  @ApiProperty({ description: 'Message subject' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Priority', enum: ['low', 'medium', 'high'], default: 'medium' })
  @IsString()
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: string;

  @ApiProperty({ description: 'Attachment URLs', required: false })
  @IsArray()
  @IsOptional()
  attachments?: string[];

  @ApiProperty({ description: 'School ID' })
  @IsString()
  @IsNotEmpty()
  school_id: string;
}

export class CreateAnnouncementDto {
  @ApiProperty({ description: 'Announcement title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Announcement description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Notice date' })
  @IsString()
  @IsNotEmpty()
  notice_date: string;

  @ApiProperty({ description: 'Target audience', type: [String] })
  @IsArray()
  @IsNotEmpty()
  target_audience: string[];

  @ApiProperty({ description: 'Target standards (optional)', required: false })
  @IsArray()
  @IsOptional()
  target_standards?: number[];

  @ApiProperty({ description: 'Attachment URLs', required: false })
  @IsArray()
  @IsOptional()
  attachments?: string[];

  @ApiProperty({ description: 'Status', enum: ['active', 'expired', 'draft'], default: 'active' })
  @IsString()
  @IsOptional()
  @IsEnum(['active', 'expired', 'draft'])
  status?: string;

  @ApiProperty({ description: 'School ID' })
  @IsString()
  @IsNotEmpty()
  school_id: string;

  @ApiProperty({ description: 'Created by user ID' })
  @IsString()
  @IsNotEmpty()
  created_by: string;
}

export class MarkAsReadDto {
  @ApiProperty({ description: 'Mark as read', default: true })
  @IsBoolean()
  @IsOptional()
  read?: boolean;
}

export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {}
