import { IsEmail, IsNotEmpty, IsString, MinLength, IsMongoId, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsMongoId()
  @IsOptional()
  school_id?: string;

  @IsString()
  @IsNotEmpty({ message: 'User group is required' })
  usergroup_id: string;

  @IsString()
  @IsOptional({ message: 'Mobile number is optional' })
  mobile_no?: string;
}
