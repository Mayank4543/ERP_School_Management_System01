import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  school_id: string;

  @ApiProperty({ example: 'BK-2025-001' })
  @IsString()
  @IsNotEmpty()
  book_no: string;

  @ApiProperty({ example: 'Introduction to Algorithms' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Thomas H. Cormen' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: '978-0-262-03384-8', required: false })
  @IsString()
  @IsOptional()
  isbn?: string;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'MIT Press', required: false })
  @IsString()
  @IsOptional()
  publisher?: string;

  @ApiProperty({ example: '3rd Edition', required: false })
  @IsString()
  @IsOptional()
  edition?: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsNotEmpty()
  total_copies: number;

  @ApiProperty({ example: 'A-15', required: false })
  @IsString()
  @IsOptional()
  rack_no?: string;

  @ApiProperty({ example: 599, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;
}

export class IssueBookDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439013' })
  @IsString()
  @IsNotEmpty()
  book_id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439014' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: 'student', enum: ['student', 'teacher'] })
  @IsEnum(['student', 'teacher'])
  @IsNotEmpty()
  user_type: string;

  @ApiProperty({ example: 14, description: 'Number of days for which book is issued' })
  @IsNumber()
  @IsOptional()
  issue_days?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}

export class ReturnBookDto {
  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  fine_amount?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}

export class UpdateBookDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  total_copies?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  rack_no?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  price?: number;
}
