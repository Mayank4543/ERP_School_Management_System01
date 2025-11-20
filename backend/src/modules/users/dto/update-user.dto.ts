import { IsString, IsEmail, IsOptional, IsBoolean, IsEnum, IsArray, IsMongoId } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class UpdateUserDto {
  @IsOptional()
  @IsMongoId()
  school_id?: string;

  @IsOptional()
  @IsString()
  @IsEnum(UserRole)
  usergroup_id?: string;

  @IsOptional()
  @IsMongoId()
  ref_id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

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