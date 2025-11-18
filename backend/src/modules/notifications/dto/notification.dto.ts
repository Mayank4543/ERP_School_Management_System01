import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ description: 'User ID to receive notification' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ 
    description: 'Notification type',
    enum: ['exam', 'assignment', 'homework', 'fee', 'attendance', 'leave', 'message', 'announcement', 'library', 'timetable', 'general']
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['exam', 'assignment', 'homework', 'fee', 'attendance', 'leave', 'message', 'announcement', 'library', 'timetable', 'general'])
  notification_type: string;

  @ApiProperty({ description: 'Notification title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Notification message' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Link to related resource (optional)', required: false })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiProperty({ description: 'Priority', enum: ['low', 'medium', 'high'], default: 'medium' })
  @IsString()
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: string;

  @ApiProperty({ description: 'Expiry date (optional)', required: false })
  @IsString()
  @IsOptional()
  expires_at?: string;

  @ApiProperty({ description: 'Additional metadata (optional)', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'School ID' })
  @IsString()
  @IsNotEmpty()
  school_id: string;
}

export class MarkAsReadDto {
  @ApiProperty({ description: 'Mark as read', default: true })
  @IsBoolean()
  @IsOptional()
  read?: boolean;
}

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
