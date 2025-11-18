import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExamDocument = Exam & Document;

@Schema({ timestamps: true, collection: 'exams' })
export class Exam {
  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'AcademicYear', index: true })
  academic_year_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, enum: ['midterm', 'final', 'monthly', 'quarterly', 'half-yearly', 'annual', 'other'] })
  exam_type: string;

  @Prop({ type: Date, required: true })
  start_date: Date;

  @Prop({ type: Date, required: true })
  end_date: Date;

  @Prop({ type: [Number] })
  standards: number[];

  @Prop({ type: String, enum: ['scheduled', 'ongoing', 'completed', 'cancelled'], default: 'scheduled' })
  status: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Date })
  deleted_at: Date;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);

ExamSchema.index({ school_id: 1, academic_year_id: 1 });
ExamSchema.index({ school_id: 1, status: 1 });
