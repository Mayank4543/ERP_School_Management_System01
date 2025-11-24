import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsDate,
  IsEnum,
  IsArray,
  Min,
  Max,
  Matches,
  IsMongoId,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ description: 'User ID reference', example: '674d1234567890abcdef1234' })
  @IsMongoId()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: 'School ID', example: '674d1234567890abcdef1234' })
  @IsMongoId()
  @IsNotEmpty()
  school_id: string;

  @ApiProperty({ description: 'Academic Year ID', example: '674d1234567890abcdef1234' })
  @IsMongoId()
  @IsNotEmpty()
  academic_year_id: string;

  @ApiProperty({ description: 'Standard/Class (1-12)', example: 5, minimum: 1, maximum: 12 })
  @IsInt()
  @Min(1)
  @Max(12)
  standard: number;

  @ApiProperty({ description: 'Section ID', example: '674d1234567890abcdef1234' })
  @IsMongoId()
  @IsNotEmpty()
  section_id: string;

  @ApiProperty({ description: 'Roll Number', example: 'R001' })
  @IsString()
  @IsNotEmpty()
  roll_no: string;

  @ApiProperty({ description: 'Admission Number', example: 'ADM2024001' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9]+$/, { message: 'Admission number must be alphanumeric uppercase' })
  admission_no: string;

  @ApiProperty({ description: 'Date of Admission', example: '2024-04-01' })
  @IsDate()
  @Type(() => Date)
  admission_date: Date;

  @ApiPropertyOptional({ description: 'Blood Group', example: 'A+' })
  @IsOptional()
  @IsString()
  blood_group?: string;

  @ApiPropertyOptional({ description: 'Religion', example: 'Hindu' })
  @IsOptional()
  @IsString()
  religion?: string;

  @ApiPropertyOptional({ description: 'Caste', example: 'General' })
  @IsOptional()
  @IsString()
  caste?: string;

  @ApiPropertyOptional({ description: 'Category', example: 'General' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Mother Tongue', example: 'Hindi' })
  @IsOptional()
  @IsString()
  mother_tongue?: string;

  @ApiPropertyOptional({ description: 'Nationality', example: 'Indian' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({ description: 'Previous School Name' })
  @IsOptional()
  @IsString()
  previous_school?: string;

  @ApiPropertyOptional({ description: 'Transport Mode', example: 'Bus' })
  @IsOptional()
  @IsString()
  transport_mode?: string;

  @ApiPropertyOptional({ description: 'Route ID for transport' })
  @IsOptional()
  @IsMongoId()
  route_id?: string;

  @ApiPropertyOptional({ description: 'Parent IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  parent_ids?: string[];

  @ApiPropertyOptional({ description: 'Father Name', example: 'John Doe' })
  @IsOptional()
  @IsString()
  father_name?: string;

  @ApiPropertyOptional({ description: 'Mother Name', example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  mother_name?: string;

  @ApiPropertyOptional({ description: 'Parent Contact Number', example: '+1234567890' })
  @IsOptional()
  @IsString()
  parent_contact?: string;

  @ApiPropertyOptional({ description: 'Parent Email', example: 'parent@example.com' })
  @IsOptional()
  @IsString()
  parent_email?: string;

  @ApiPropertyOptional({ description: 'Student Status', example: 'active', enum: ['active', 'inactive', 'transferred', 'graduated'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'transferred', 'graduated'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Medical Information',
    type: 'object',
    properties: {
      allergies: { type: 'array', items: { type: 'string' } },
      medications: { type: 'array', items: { type: 'string' } },
      conditions: { type: 'array', items: { type: 'string' } },
      emergency_contact: { type: 'string' },
    },
  })
  @IsOptional()
  medical_info?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    emergency_contact?: string;
  };
}
