import { IsNotEmpty, IsString, IsNumber, IsDate, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAssignmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  school_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  academic_year_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject_name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  standard: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  section_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  teacher_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  due_date: Date;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  max_marks: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  attachment_url?: string;
}

export class SubmitAssignmentDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  file_url?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  text_content?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}

export class GradeAssignmentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  marks_obtained: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}
