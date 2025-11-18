import { IsNotEmpty, IsString, IsNumber, IsDate, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateHomeworkDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  school_id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @IsString()
  @IsNotEmpty()
  academic_year_id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439013' })
  @IsString()
  @IsNotEmpty()
  subject_id: string;

  @ApiProperty({ example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  subject_name: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  standard: number;

  @ApiProperty({ example: '507f1f77bcf86cd799439014' })
  @IsString()
  @IsNotEmpty()
  section_id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439015' })
  @IsString()
  @IsNotEmpty()
  teacher_id: string;

  @ApiProperty({ example: 'Complete exercises 1-20' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Solve all problems from chapter 5, page 45' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2025-11-20T00:00:00Z' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  due_date: Date;
}

export class MarkCompleteDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  completed: boolean;

  @ApiProperty({ example: 'Completed all exercises', required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}

export class UpdateHomeworkDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  due_date?: Date;

  @ApiProperty({ required: false, enum: ['active', 'closed'] })
  @IsString()
  @IsOptional()
  status?: string;
}
