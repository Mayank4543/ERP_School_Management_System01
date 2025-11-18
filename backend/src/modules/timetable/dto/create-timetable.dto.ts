import { IsNotEmpty, IsString, IsNumber, IsArray, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class PeriodDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  period_number: number;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: false })
  @IsString()
  @IsOptional()
  subject_id?: string;

  @ApiProperty({ example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  subject_name: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', required: false })
  @IsString()
  @IsOptional()
  teacher_id?: string;

  @ApiProperty({ example: 'Mr. Sharma' })
  @IsString()
  @IsNotEmpty()
  teacher_name: string;

  @ApiProperty({ example: '09:00' })
  @IsString()
  @IsNotEmpty()
  start_time: string;

  @ApiProperty({ example: '10:00' })
  @IsString()
  @IsNotEmpty()
  end_time: string;

  @ApiProperty({ example: '101', required: false })
  @IsString()
  @IsOptional()
  room_no?: string;

  @ApiProperty({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  is_break?: boolean;
}

export class CreateTimetableDto {
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

  @ApiProperty({ example: '507f1f77bcf86cd799439013' })
  @IsString()
  @IsNotEmpty()
  section_id: string;

  @ApiProperty({ example: 'Monday', enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] })
  @IsEnum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
  @IsNotEmpty()
  day: string;

  @ApiProperty({ type: [PeriodDto] })
  @IsArray()
  @IsNotEmpty()
  periods: PeriodDto[];
}
