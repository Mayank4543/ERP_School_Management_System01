import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class TeacherDashboardQueryDto {
  @ApiProperty({ description: 'Date for schedule (optional)', required: false })
  @IsDateString()
  @IsOptional()
  date?: string;
}

export class AdminDashboardQueryDto {
  @ApiProperty({ description: 'Start date for reports (optional)', required: false })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({ description: 'End date for reports (optional)', required: false })
  @IsDateString()
  @IsOptional()
  end_date?: string;
}

export class ParentStudentsQueryDto {
  @ApiProperty({ description: 'Include detailed info', required: false })
  @IsOptional()
  include_details?: boolean;
}
