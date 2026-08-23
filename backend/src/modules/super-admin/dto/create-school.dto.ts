import { IsString, IsOptional, IsEmail, Length, IsBoolean, IsUrl, MaxLength, Matches } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @Length(2, 100, { message: 'School Name must be between 2 and 100 characters' })
  name: string;

  @IsEmail()
  @MaxLength(500)
  email: string;

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

  @IsString()
  @MaxLength(100)
  state: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsString()
  @Matches(/^\d{6}$/, {
    message: 'Pincode must be exactly 6 digits',
  })
  pincode: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  board?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsString()
  logo?: string;
}