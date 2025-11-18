import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsNumber,
  IsArray,
  IsMongoId,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ description: 'User ID reference' })
  @IsMongoId()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: 'School ID' })
  @IsMongoId()
  @IsNotEmpty()
  school_id: string;

  @ApiProperty({ description: 'Employee ID', example: 'EMP001' })
  @IsString()
  @IsNotEmpty()
  employee_id: string;

  @ApiProperty({ description: 'Joining Date' })
  @IsDate()
  @Type(() => Date)
  joining_date: Date;

  @ApiPropertyOptional({ description: 'Designation' })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiPropertyOptional({ description: 'Department' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: 'Subjects taught', type: [String] })
  @IsOptional()
  @IsArray()
  subjects?: string[];

  @ApiPropertyOptional({ description: 'Classes taught', type: [Number] })
  @IsOptional()
  @IsArray()
  classes?: number[];

  @ApiPropertyOptional({ description: 'Educational Qualification' })
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiPropertyOptional({ description: 'Years of Experience' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  experience_years?: number;

  @ApiPropertyOptional({ description: 'Monthly Salary' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;

  @ApiPropertyOptional({ description: 'Bank Account Number' })
  @IsOptional()
  @IsString()
  bank_account?: string;

  @ApiPropertyOptional({ description: 'Bank Name' })
  @IsOptional()
  @IsString()
  bank_name?: string;

  @ApiPropertyOptional({ description: 'IFSC Code' })
  @IsOptional()
  @IsString()
  ifsc_code?: string;

  @ApiPropertyOptional({ description: 'PAN Number' })
  @IsOptional()
  @IsString()
  pan_number?: string;

  @ApiPropertyOptional({ description: 'Aadhar Number' })
  @IsOptional()
  @IsString()
  aadhar_number?: string;
}
