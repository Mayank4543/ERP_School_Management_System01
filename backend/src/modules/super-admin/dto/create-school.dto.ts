import { IsString, IsOptional, IsEmail, IsBoolean, IsUrl } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsString()
  pincode: string;

  @IsOptional()
  @IsString()
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