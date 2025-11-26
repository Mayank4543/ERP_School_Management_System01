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

  @Prop({ type: Boolean, default: false })
  is_published: boolean;

  @Prop({ type: String })
  description: string;

  @Prop([{
    subject_id: { type: String, required: true },
    subject_name: { type: String, required: true },
    date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    total_marks: { type: Number, required: true },
    passing_marks: { type: Number, required: true },
    room: { type: String },
    invigilator: { type: String },
  }])
  subjects: Array<{
    subject_id: string;
    subject_name: string;
    date: Date;
    start_time: string;
    end_time: string;
    total_marks: number;
    passing_marks: number;
    room?: string;
    invigilator?: string;
  }>;

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
ExamSchema.index({ school_id: 1, is_published: 1 });
