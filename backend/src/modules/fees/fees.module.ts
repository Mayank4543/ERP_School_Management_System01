import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeeStructure, FeeStructureSchema } from './schemas/fee-structure.schema';
import { FeePayment, FeePaymentSchema } from './schemas/fee-payment.schema';
import { StudentFee, StudentFeeSchema } from './schemas/student-fee.schema';
import { FeesController } from './fees.controller';
import { FeesService } from './fees.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FeeStructure.name, schema: FeeStructureSchema },
      { name: FeePayment.name, schema: FeePaymentSchema },
      { name: StudentFee.name, schema: StudentFeeSchema },
    ]),
  ],
  controllers: [FeesController],
  providers: [FeesService],
  exports: [FeesService],
})
export class FeesModule {}
