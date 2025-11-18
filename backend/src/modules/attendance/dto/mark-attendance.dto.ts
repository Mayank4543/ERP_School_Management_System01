import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDate,
  IsMongoId,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SingleAttendanceDto {
  @ApiProperty({ description: 'User ID', example: '674d1234567890abcdef1234' })
  @IsMongoId()
  user_id: string;

  @ApiProperty({ description: 'Attendance status', enum: ['present', 'absent', 'late', 'half-day', 'leave'] })
  @IsEnum(['present', 'absent', 'late', 'half-day', 'leave'])
  status: string;

  @ApiPropertyOptional({ description: 'Reason for absence/late' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ description: 'Additional remarks' })
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class MarkAttendanceDto {
  @ApiProperty({ description: 'School ID', example: '674d1234567890abcdef1234' })
  @IsMongoId()
  @IsNotEmpty()
  school_id: string;

  @ApiProperty({ description: 'Date of attendance', example: '2024-11-11' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ description: 'User type', enum: ['student', 'teacher', 'staff'] })
  @IsEnum(['student', 'teacher', 'staff'])
  user_type: string;

  @ApiPropertyOptional({ description: 'Academic Year ID' })
  @IsOptional()
  @IsMongoId()
  academic_year_id?: string;

  @ApiPropertyOptional({ description: 'Standard/Class' })
  @IsOptional()
  standard?: number;

  @ApiPropertyOptional({ description: 'Section ID' })
  @IsOptional()
  @IsMongoId()
  section_id?: string;

  @ApiProperty({ description: 'Array of attendance records', type: [SingleAttendanceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleAttendanceDto)
  attendance: SingleAttendanceDto[];
}
