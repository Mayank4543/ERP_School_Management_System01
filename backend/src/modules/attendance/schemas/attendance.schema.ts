import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true, collection: 'attendances' })
export class Attendance {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  user_id: Types.ObjectId;

  @Prop({ type: String, enum: ['student', 'teacher', 'staff'], required: true })
  user_type: string;

  @Prop({ type: Date, required: true, index: true })
  date: Date;

  @Prop({ type: String, enum: ['present', 'absent', 'late', 'half-day', 'leave'], required: true })
  status: string;

  @Prop({ type: Types.ObjectId })
  marked_by: Types.ObjectId;

  @Prop({ type: String })
  reason: string;

  @Prop({ type: String })
  remarks: string;

  @Prop({ type: String })
  check_in_time: string;

  @Prop({ type: String })
  check_out_time: string;

  @Prop({ type: Types.ObjectId })
  academic_year_id: Types.ObjectId;

  @Prop({ type: Number })
  standard: number;

  @Prop({ type: Types.ObjectId })
  section_id: Types.ObjectId;

  @Prop({ type: Date })
  deleted_at: Date;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

// Compound index for unique constraint
AttendanceSchema.index({ user_id: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ school_id: 1, date: 1, user_type: 1 });
AttendanceSchema.index({ school_id: 1, academic_year_id: 1, standard: 1, section_id: 1 });
