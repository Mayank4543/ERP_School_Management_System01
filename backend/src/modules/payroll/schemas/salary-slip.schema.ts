import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SalarySlipDocument = SalarySlip & Document;

@Schema({ timestamps: true, collection: 'salary_slips' })
export class SalarySlip {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Payroll', index: true })
  payroll_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  employee_id: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  slip_number: string;

  @Prop({ type: Date, required: true })
  generated_at: Date;

  @Prop({ type: String })
  pdf_path: string;

  @Prop({ type: Boolean, default: false })
  is_sent: boolean;

  @Prop({ type: Date })
  sent_at: Date;
}

export const SalarySlipSchema = SchemaFactory.createForClass(SalarySlip);
SalarySlipSchema.index({ payroll_id: 1, employee_id: 1 });
