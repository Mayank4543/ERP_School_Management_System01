import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsDate, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateFeeStructureDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  school_id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @IsString()
  @IsNotEmpty()
  academic_year_id: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  standard: number;

  @ApiProperty({ example: 'Tuition Fee' })
  @IsString()
  @IsNotEmpty()
  fee_type: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'monthly', enum: ['monthly', 'quarterly', 'half_yearly', 'yearly', 'one_time'] })
  @IsEnum(['monthly', 'quarterly', 'half_yearly', 'yearly', 'one_time'])
  @IsNotEmpty()
  frequency: string;

  @ApiProperty({ example: '2025-12-01', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  due_date?: Date;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  is_mandatory?: boolean;

  @ApiProperty({ example: 'Monthly tuition fee for class 10', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
