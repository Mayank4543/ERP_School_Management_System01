import { IsString, IsOptional, IsEmail, IsEnum, Length, MaxLength, Matches, IsUrl } from 'class-validator';
import { SchoolStatus } from '../../schools/schemas/school.schema';
import { Transform } from 'class-transformer';
export class UpdateSchoolDto {
  @IsOptional()
  @IsString()
  @Length(2, 100, { message: 'School Name must be between 2 and 100 characters' })
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(500)
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Phone must be a valid 10-digit Indian phone number',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/, {
    message: 'Pincode must be exactly 6 digits',
  })
  pincode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  board?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsUrl({}, { message: 'Please enter a valid website URL' })
  website?: string;

  @IsOptional()
  @IsEnum(SchoolStatus)
  status?: SchoolStatus;

  @IsOptional()
  @IsString()
  logo?: string;
}