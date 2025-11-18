import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payroll, PayrollSchema } from './schemas/payroll.schema';
import { SalarySlip, SalarySlipSchema } from './schemas/salary-slip.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payroll.name, schema: PayrollSchema },
      { name: SalarySlip.name, schema: SalarySlipSchema },
    ]),
  ],
})
export class PayrollModule {}
