import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentFeeDocument = StudentFee & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'student_fees' })
export class StudentFee {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true, index: true })
  student_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AcademicYear', required: true })
  academic_year_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  total_fees: number;

  @Prop({ type: Number, default: 0 })
  paid_fees: number;

  @Prop({ type: Number, default: 0 })
  pending_fees: number;

  @Prop({
    type: [{
      fee_type: { type: String, required: true },
      amount: { type: Number, required: true },
      status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
      due_date: { type: Date }
    }]
  })
  fee_items: Array<{
    fee_type: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    due_date?: Date;
  }>;

  @Prop({ type: Date, default: null })
  deleted_at: Date;

  created_at: Date;
  updated_at: Date;
}

export const StudentFeeSchema = SchemaFactory.createForClass(StudentFee);
StudentFeeSchema.index({ student_id: 1, academic_year_id: 1 });
