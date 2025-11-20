import { IsString, IsEmail, IsOptional, IsBoolean, IsEnum, IsArray, IsMongoId } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @IsOptional()
  @IsMongoId()
  school_id?: string;

  @IsString()
  @IsEnum(UserRole)
  usergroup_id: string;

  @IsOptional()
  @IsMongoId()
  ref_id?: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  mobile_no?: string;

  @IsOptional()
  @IsBoolean()
  is_activated?: boolean;

  @IsOptional()
  @IsArray()
  roles?: string[];

  @IsOptional()
  @IsArray()
  permissions?: string[];
}