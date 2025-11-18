import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HomeworkDocument = Homework & Document;

@Schema({ timestamps: true, collection: 'homework' })
export class Homework {
  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'AcademicYear' })
  academic_year_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  subject: string;

  @Prop({ type: Number, required: true })
  standard: number;

  @Prop({ type: Types.ObjectId, ref: 'Section' })
  section_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Teacher' })
  assigned_by: Types.ObjectId;

  @Prop({ type: Date, required: true })
  homework_date: Date;

  @Prop({ type: Date, required: true })
  submission_date: Date;

  @Prop({ type: [String] })
  attachments: string[];

  @Prop({ type: String, enum: ['pending', 'active', 'completed'], default: 'active' })
  status: string;

  @Prop({ type: Date })
  deleted_at: Date;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}

export const HomeworkSchema = SchemaFactory.createForClass(Homework);
HomeworkSchema.index({ school_id: 1, standard: 1, homework_date: -1 });
HomeworkSchema.index({ school_id: 1, section_id: 1, subject: 1 });
