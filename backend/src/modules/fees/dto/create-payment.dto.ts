import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'upi', enum: ['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'online'] })
  @IsEnum(['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'online'])
  @IsNotEmpty()
  payment_mode: string;

  @ApiProperty({ example: 'Tuition Fee' })
  @IsString()
  @IsNotEmpty()
  fee_type: string;

  @ApiProperty({ example: 'TXN123456789', required: false })
  @IsString()
  @IsOptional()
  transaction_id?: string;

  @ApiProperty({ example: 'November month fee payment', required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}
