import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsEnum, IsMongoId, IsDate, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTeacherAssignmentDto {
  @ApiProperty({ description: 'School ID', example: '674d1234567890abcdef1234' })
  @IsMongoId()
  @IsNotEmpty()
  school_id: string;

  @ApiProperty({ description: 'Academic Year ID', example: '674d1234567890abcdef1234' })
  @IsMongoId()
  @IsNotEmpty()
  academic_year_id: string;

  @ApiProperty({ description: 'Teacher ID', example: '674d1234567890abcdef1234' })
  @IsMongoId()
  @IsNotEmpty()
  teacher_id: string;

  @ApiProperty({ description: 'Subject ID', example: '674d1234567890abcdef1234' })
  @IsMongoId()
  @IsNotEmpty()
  subject_id: string;

  @ApiProperty({ description: 'Standard/Class (1-12)', example: 10, minimum: 1, maximum: 12 })
  @IsNumber()
  @Min(1)
  @Max(12)
  standard: number;

  @ApiProperty({ description: 'Section ID', example: '674d1234567890abcdef1234' })
  @IsMongoId()
  @IsNotEmpty()
  section_id: string;

  @ApiPropertyOptional({ description: 'Number of periods per week', example: 6 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  periods_per_week?: number;

  @ApiPropertyOptional({ 
    description: 'Assignment type',
    enum: ['primary', 'secondary'],
    example: 'primary'
  })
  @IsOptional()
  @IsEnum(['primary', 'secondary'])
  assignment_type?: string;

  @ApiPropertyOptional({ description: 'Is class teacher for this section', example: false })
  @IsOptional()
  @IsBoolean()
  is_class_teacher?: boolean;

  @ApiPropertyOptional({ description: 'Assignment start date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start_date?: Date;

  @ApiPropertyOptional({ description: 'Assignment end date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end_date?: Date;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}