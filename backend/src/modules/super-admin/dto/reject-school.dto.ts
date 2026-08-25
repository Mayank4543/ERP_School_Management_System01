import { IsString, MaxLength, MinLength } from 'class-validator';

export class RejectSchoolDto {
  @IsString()
  @MinLength(3, { message: 'Rejection reason must be at least 3 characters' })
  @MaxLength(500, { message: 'Rejection reason cannot exceed 500 characters' })
  reason: string;
}
