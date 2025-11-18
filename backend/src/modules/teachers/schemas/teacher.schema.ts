import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TeacherDocument = Teacher & Document;

@Schema({ timestamps: true, collection: 'teachers' })
export class Teacher {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  employee_id: string;

  @Prop({ type: Date, required: true })
  joining_date: Date;

  @Prop({ type: String, enum: ['active', 'inactive', 'on-leave', 'terminated'], default: 'active' })
  status: string;

  @Prop({ type: String })
  designation: string;

  @Prop({ type: String })
  department: string;

  @Prop({ type: [String] })
  subjects: string[];

  @Prop({ type: [Number] })
  classes: number[];

  @Prop({ type: String })
  qualification: string;

  @Prop({ type: Number })
  experience_years: number;

  @Prop({ type: Number })
  salary: number;

  @Prop({ type: String })
  bank_account: string;

  @Prop({ type: String })
  bank_name: string;

  @Prop({ type: String })
  ifsc_code: string;

  @Prop({ type: String })
  pan_number: string;

  @Prop({ type: String })
  aadhar_number: string;

  @Prop({ type: Date })
  deleted_at: Date;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);

// Indexes
TeacherSchema.index({ school_id: 1, status: 1 });
TeacherSchema.index({ employee_id: 1 }, { unique: true });
TeacherSchema.index({ school_id: 1, department: 1 });
