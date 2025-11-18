import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FeePaymentDocument = FeePayment & Document;

@Schema({ timestamps: true, collection: 'fee_payments' })
export class FeePayment {
  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Student', index: true })
  student_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'AcademicYear' })
  academic_year_id: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  receipt_no: string;

  @Prop({ type: Date, required: true })
  payment_date: Date;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, enum: ['cash', 'card', 'upi', 'bank_transfer', 'cheque'] })
  payment_mode: string;

  @Prop({ type: String })
  transaction_id: string;

  @Prop({ type: String, enum: ['paid', 'pending', 'failed', 'refunded'], default: 'paid' })
  status: string;

  @Prop({ type: String })
  remarks: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  collected_by: Types.ObjectId;
}

export const FeePaymentSchema = SchemaFactory.createForClass(FeePayment);
FeePaymentSchema.index({ school_id: 1, student_id: 1, academic_year_id: 1 });
