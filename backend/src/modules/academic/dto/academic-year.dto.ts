import { IsString, IsDateString, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAcademicYearDto {
  @IsString()
  name: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return Boolean(value);
  })
  is_current?: boolean;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}

export class UpdateAcademicYearDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return Boolean(value);
  })
  is_current?: boolean;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'completed'])
  status?: 'active' | 'inactive' | 'completed';
}