import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityLogDocument = ActivityLog & Document;

@Schema({ timestamps: true })
export class ActivityLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School' })
  school_id: Types.ObjectId;

  @Prop({ required: true })
  action: string; // login, logout, create, update, delete, view, download, etc.

  @Prop({ required: true })
  module: string; // students, teachers, exams, fees, etc.

  @Prop()
  entity_type: string; // Student, Teacher, Exam, etc.

  @Prop({ type: Types.ObjectId })
  entity_id: Types.ObjectId;

  @Prop()
  description: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop()
  ip_address: string;

  @Prop()
  user_agent: string;

  @Prop({ type: Object })
  request_data: Record<string, any>;

  @Prop({ type: Object })
  response_data: Record<string, any>;

  @Prop()
  status: string; // success, failed, error

  @Prop()
  error_message: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

// Indexes
ActivityLogSchema.index({ user_id: 1, createdAt: -1 });
ActivityLogSchema.index({ school_id: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });
ActivityLogSchema.index({ module: 1, createdAt: -1 });
ActivityLogSchema.index({ entity_type: 1, entity_id: 1 });
