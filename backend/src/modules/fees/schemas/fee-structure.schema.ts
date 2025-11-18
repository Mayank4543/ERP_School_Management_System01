import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FeeStructureDocument = FeeStructure & Document;

@Schema({ timestamps: true, collection: 'fee_structures' })
export class FeeStructure {
  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'AcademicYear' })
  academic_year_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  standard: number;

  @Prop({ type: String, required: true })
  fee_type: string; // Tuition, Transport, Exam, etc.

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, enum: ['monthly', 'quarterly', 'half-yearly', 'yearly', 'one-time'] })
  frequency: string;

  @Prop({ type: Boolean, default: true })
  is_mandatory: boolean;

  @Prop({ type: Date })
  deleted_at: Date;
}

export const FeeStructureSchema = SchemaFactory.createForClass(FeeStructure);
FeeStructureSchema.index({ school_id: 1, academic_year_id: 1, standard: 1 });
