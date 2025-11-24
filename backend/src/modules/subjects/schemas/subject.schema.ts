import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export type SubjectDocument = Subject & Document;

@Schema({ timestamps: true, collection: 'subjects' })
export class Subject {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'AcademicYear' })
  academic_year_id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  code: string; // e.g., "MATH10", "ENG09"

  @Prop({ 
    enum: ['core', 'elective', 'language', 'science', 'arts', 'vocational', 'sports'], 
    default: 'core' 
  })
  type: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [Number], required: true })
  standards: number[]; // Classes/grades this subject is taught in

  @Prop({ type: Number, default: 0 })
  total_periods_per_week: number;

  @Prop({ type: Number, default: 100 })
  max_marks: number;

  @Prop({ type: Number, default: 40 })
  pass_marks: number;

  @Prop({ type: Boolean, default: true })
  is_practical: boolean;

  @Prop({ type: Boolean, default: true })
  is_theory: boolean;

  @Prop({ type: String })
  syllabus_url: string;

  @Prop({ type: String })
  textbook_name: string;

  @Prop({ type: String, enum: ['active', 'inactive', 'archived'], default: 'active' })
  status: string;

  @Prop({ type: Date, default: null })
  deleted_at: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);

// Indexes for better query performance
SubjectSchema.index({ school_id: 1, academic_year_id: 1 });
SubjectSchema.index({ code: 1 }, { unique: true });
SubjectSchema.index({ school_id: 1, type: 1 });
SubjectSchema.index({ school_id: 1, status: 1 });