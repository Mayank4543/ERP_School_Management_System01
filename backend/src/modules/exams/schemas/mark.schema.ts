import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MarkDocument = Mark & Document;

@Schema({ timestamps: true, collection: 'marks' })
export class Mark {
  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Exam', index: true })
  exam_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Student', index: true })
  student_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  subject: string;

  @Prop({ type: Number, required: true })
  marks_obtained: number;

  @Prop({ type: Number, required: true })
  total_marks: number;

  @Prop({ type: Number })
  percentage: number;

  @Prop({ type: String })
  grade: string;

  @Prop({ type: String })
  remarks: string;

  @Prop({ type: Boolean, default: false })
  is_absent: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Teacher' })
  entered_by: Types.ObjectId;

  @Prop({ type: Date })
  deleted_at: Date;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;
}

export const MarkSchema = SchemaFactory.createForClass(Mark);

MarkSchema.index({ exam_id: 1, student_id: 1, subject: 1 }, { unique: true });
MarkSchema.index({ school_id: 1, exam_id: 1 });
