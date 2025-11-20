import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';

export enum ReportType {
  ATTENDANCE = 'attendance',
  FEES = 'fees',
  ACADEMIC = 'academic',
  EXAM = 'exam',
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export enum ExportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
}

export class AttendanceReportDto {
  @ApiProperty({ description: 'Class/Standard' })
  @IsString()
  standard: string;

  @ApiProperty({ description: 'Section ID', required: false })
  @IsString()
  @IsOptional()
  section_id?: string;

  @ApiProperty({ description: 'Start date' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ description: 'End date' })
  @IsDateString()
  end_date: string;

  @ApiProperty({ description: 'Student ID for individual report', required: false })
  @IsString()
  @IsOptional()
  student_id?: string;
}

export class FeeReportDto {
  @ApiProperty({ description: 'School ID' })
  @IsString()
  school_id: string;

  @ApiProperty({ description: 'Academic year', required: false })
  @IsString()
  @IsOptional()
  academic_year?: string;

  @ApiProperty({ description: 'Month (1-12)', required: false })
  @IsOptional()
  month?: number;

  @ApiProperty({ description: 'Class/Standard', required: false })
  @IsString()
  @IsOptional()
  standard?: string;

  @ApiProperty({ description: 'Fee status (paid/pending/overdue)', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}

export class AcademicReportDto {
  @ApiProperty({ description: 'Student ID' })
  @IsString()
  student_id: string;

  @ApiProperty({ description: 'Academic year ID' })
  @IsString()
  academic_year_id: string;

  @ApiProperty({ description: 'Include detailed exam scores', required: false })
  @IsOptional()
  include_details?: boolean;
}

export class ExportReportDto {
  @ApiProperty({ description: 'Report type', enum: ReportType })
  @IsEnum(ReportType)
  report_type: ReportType;

  @ApiProperty({ description: 'Export format', enum: ExportFormat })
  @IsEnum(ExportFormat)
  format: ExportFormat;

  @ApiProperty({ description: 'Report data as JSON string' })
  @IsString()
  data: string;

  @ApiProperty({ description: 'Report title', required: false })
  @IsString()
  @IsOptional()
  title?: string;
}
