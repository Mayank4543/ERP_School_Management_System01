import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsNumber, Min } from 'class-validator';

export class ApplyLeaveDto {
  @ApiProperty({ description: 'User ID (student or teacher)' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: 'User type', enum: ['student', 'teacher'] })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['student', 'teacher'])
  user_type: string;

  @ApiProperty({ description: 'Leave type', enum: ['sick', 'casual', 'emergency', 'maternity', 'other'] })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['sick', 'casual', 'emergency', 'maternity', 'other'])
  leave_type: string;

  @ApiProperty({ description: 'Leave start date' })
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @ApiProperty({ description: 'Leave end date' })
  @IsDateString()
  @IsNotEmpty()
  end_date: string;

  @ApiProperty({ description: 'Reason for leave' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ description: 'Attachment URL (optional)', required: false })
  @IsString()
  @IsOptional()
  attachment_url?: string;

  @ApiProperty({ description: 'School ID' })
  @IsString()
  @IsNotEmpty()
  school_id: string;
}

export class ApproveLeaveDto {
  @ApiProperty({ description: 'Remarks (optional)', required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}

export class RejectLeaveDto {
  @ApiProperty({ description: 'Rejection reason' })
  @IsString()
  @IsNotEmpty()
  rejection_reason: string;

  @ApiProperty({ description: 'Remarks (optional)', required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}

export class UpdateLeaveDto extends PartialType(ApplyLeaveDto) {}
