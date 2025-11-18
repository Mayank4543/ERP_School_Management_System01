import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PayrollDocument = Payroll & Document;

@Schema({ timestamps: true, collection: 'payrolls' })
export class Payroll {
  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  employee_id: Types.ObjectId;

  @Prop({ type: String, enum: ['teacher', 'staff'], required: true })
  employee_type: string;

  @Prop({ type: Number, required: true })
  month: number; // 1-12

  @Prop({ type: Number, required: true })
  year: number;

  @Prop({ type: Number, required: true })
  basic_salary: number;

  @Prop({ type: Object })
  allowances: {
    hra?: number;
    da?: number;
    ta?: number;
    medical?: number;
    other?: number;
  };

  @Prop({ type: Number, default: 0 })
  total_allowances: number;

  @Prop({ type: Object })
  deductions: {
    pf?: number;
    esi?: number;
    tds?: number;
    loan?: number;
    other?: number;
  };

  @Prop({ type: Number, default: 0 })
  total_deductions: number;

  @Prop({ type: Number, required: true })
  gross_salary: number;

  @Prop({ type: Number, required: true })
  net_salary: number;

  @Prop({ type: Number, default: 0 })
  working_days: number;

  @Prop({ type: Number, default: 0 })
  present_days: number;

  @Prop({ type: Number, default: 0 })
  leave_days: number;

  @Prop({ type: Number, default: 0 })
  absent_days: number;

  @Prop({ type: Date })
  payment_date: Date;

  @Prop({ type: String, enum: ['pending', 'processed', 'paid'], default: 'pending' })
  status: string;

  @Prop({ type: String })
  payment_mode: string; // bank_transfer, cash, cheque

  @Prop({ type: String })
  transaction_id: string;

  @Prop({ type: String })
  remarks: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  processed_by: Types.ObjectId;

  @Prop({ type: Date })
  deleted_at: Date;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}

export const PayrollSchema = SchemaFactory.createForClass(Payroll);
PayrollSchema.index({ school_id: 1, employee_id: 1, month: 1, year: 1 }, { unique: true });
PayrollSchema.index({ school_id: 1, status: 1 });
