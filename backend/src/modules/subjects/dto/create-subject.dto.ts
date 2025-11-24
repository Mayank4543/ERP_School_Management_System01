import { IsString, IsNotEmpty, IsArray, IsNumber, IsOptional, IsBoolean, IsEnum, IsMongoId, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSubjectDto {
  @ApiProperty({ description: 'School ID', example: '674d1234567890abcdef1234' })
  @IsMongoId()
  @IsNotEmpty()
  school_id: string;

  @ApiProperty({ description: 'Academic Year ID', example: '674d1234567890abcdef1234' })
  @IsMongoId()
  @IsNotEmpty()
  academic_year_id: string;

  @ApiProperty({ description: 'Subject name', example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Subject code', example: 'MATH10' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ 
    description: 'Subject type',
    enum: ['core', 'elective', 'language', 'science', 'arts', 'vocational', 'sports'],
    example: 'core'
  })
  @IsOptional()
  @IsEnum(['core', 'elective', 'language', 'science', 'arts', 'vocational', 'sports'])
  type?: string;

  @ApiPropertyOptional({ description: 'Subject description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Standards/Classes this subject is taught in',
    type: [Number],
    example: [9, 10]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(12, { each: true })
  standards: number[];

  @ApiPropertyOptional({ description: 'Total periods per week', example: 6 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  total_periods_per_week?: number;

  @ApiPropertyOptional({ description: 'Maximum marks', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  max_marks?: number;

  @ApiPropertyOptional({ description: 'Pass marks', example: 40 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pass_marks?: number;

  @ApiPropertyOptional({ description: 'Has practical component', example: true })
  @IsOptional()
  @IsBoolean()
  is_practical?: boolean;

  @ApiPropertyOptional({ description: 'Has theory component', example: true })
  @IsOptional()
  @IsBoolean()
  is_theory?: boolean;

  @ApiPropertyOptional({ description: 'Syllabus URL' })
  @IsOptional()
  @IsString()
  syllabus_url?: string;

  @ApiPropertyOptional({ description: 'Textbook name' })
  @IsOptional()
  @IsString()
  textbook_name?: string;
}