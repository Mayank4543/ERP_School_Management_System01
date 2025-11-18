import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FeesService } from './fees.service';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Fees')
@ApiBearerAuth()
@Controller('fees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post('create-structure')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create fee structure' })
  async createFeeStructure(@Body() createDto: CreateFeeStructureDto) {
    const feeStructure = await this.feesService.createFeeStructure(createDto);
    return {
      success: true,
      message: 'Fee structure created successfully',
      data: feeStructure,
    };
  }

  @Get('structure')
  @ApiOperation({ summary: 'Get fee structures' })
  async getFeeStructures(
    @CurrentUser() user: any,
    @Query('academic_year_id') academicYearId?: string,
    @Query('standard') standard?: number,
  ) {
    const structures = await this.feesService.findAllFeeStructures(
      user.schoolId,
      academicYearId,
      standard ? Number(standard) : undefined,
    );
    return {
      success: true,
      data: structures,
    };
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get student fee details' })
  @ApiResponse({ status: 200, description: 'Student fees retrieved' })
  async getStudentFees(@Param('studentId') studentId: string) {
    const fees = await this.feesService.getStudentFees(studentId);
    return {
      success: true,
      data: fees,
    };
  }

  @Get('payments/:studentId')
  @ApiOperation({ summary: 'Get student payment history' })
  async getPaymentHistory(@Param('studentId') studentId: string) {
    const payments = await this.feesService.getStudentPaymentHistory(studentId);
    return {
      success: true,
      data: payments,
    };
  }

  @Post('payment')
  @Roles('admin', 'superadmin', 'accountant')
  @ApiOperation({ summary: 'Record fee payment' })
  async recordPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() user: any,
  ) {
    const payment = await this.feesService.recordPayment(createPaymentDto, user._id);
    return {
      success: true,
      message: 'Payment recorded successfully',
      data: payment,
    };
  }

  @Get('defaulters')
  @Roles('admin', 'superadmin', 'accountant')
  @ApiOperation({ summary: 'Get fee defaulters list' })
  async getDefaulters(@CurrentUser() user: any) {
    const defaulters = await this.feesService.getDefaulters(user.schoolId);
    return {
      success: true,
      data: defaulters,
    };
  }

  @Get('receipt/:receiptNo')
  @ApiOperation({ summary: 'Get payment receipt' })
  async getReceipt(@Param('receiptNo') receiptNo: string) {
    const receipt = await this.feesService.getPaymentReceipt(receiptNo);
    return {
      success: true,
      data: receipt,
    };
  }
}
