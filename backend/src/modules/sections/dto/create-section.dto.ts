import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsMongoId, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSectionDto {
  @ApiProperty({ description: 'School ID', example: '674d1234567890abcdef1234' })
  @IsMongoId()
  @IsNotEmpty()
  school_id: string;

  @ApiProperty({ description: 'Academic Year ID', example: '674d1234567890abcdef1234' })
  @IsMongoId()
  @IsNotEmpty()
  academic_year_id: string;

  @ApiProperty({ description: 'Section name', example: 'A' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Standard/Class (1-12)', example: 10, minimum: 1, maximum: 12 })
  @IsNumber()
  @Min(1)
  @Max(12)
  standard: number;

  @ApiPropertyOptional({ description: 'Maximum student capacity', example: 40 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ description: 'Class teacher ID', example: '674d1234567890abcdef1234' })
  @IsOptional()
  @IsMongoId()
  class_teacher_id?: string;

  @ApiPropertyOptional({ description: 'Room number', example: '101' })
  @IsOptional()
  @IsString()
  room_number?: string;

  @ApiPropertyOptional({ description: 'Building name', example: 'Main Block' })
  @IsOptional()
  @IsString()
  building?: string;

  @ApiPropertyOptional({ description: 'Floor number', example: 'First Floor' })
  @IsOptional()
  @IsString()
  floor?: string;

  @ApiPropertyOptional({ description: 'Shift timing', enum: ['morning', 'afternoon', 'evening'] })
  @IsOptional()
  @IsString()
  shift?: string;

  @ApiPropertyOptional({ description: 'Additional remarks' })
  @IsOptional()
  @IsString()
  remarks?: string;
}