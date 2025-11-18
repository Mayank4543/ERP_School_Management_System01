import { IsEmail, IsNotEmpty, IsString, MinLength, IsMongoId, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsMongoId()
  @IsOptional()
  school_id?: string;

  @IsString()
  @IsNotEmpty()
  usergroup_id: string;

  @IsString()
  @IsOptional()
  mobile_no?: string;
}
