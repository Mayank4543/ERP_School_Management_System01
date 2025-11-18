import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AssignmentDocument = Assignment & Document;

@Schema({ timestamps: true, collection: 'assignments' })
export class Assignment {
  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'AcademicYear' })
  academic_year_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, required: true })
  subject: string;

  @Prop({ type: Number, required: true })
  standard: number;

  @Prop({ type: Types.ObjectId, ref: 'Section' })
  section_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Teacher' })
  teacher_id: Types.ObjectId;

  @Prop({ type: Date, required: true })
  due_date: Date;

  @Prop({ type: Number, default: 100 })
  total_marks: number;

  @Prop({ type: [String] })
  attachments: string[];

  @Prop({ type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'active' })
  status: string;

  @Prop({ type: Date })
  deleted_at: Date;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
AssignmentSchema.index({ school_id: 1, standard: 1, section_id: 1 });
