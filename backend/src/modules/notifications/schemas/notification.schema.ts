import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: String, required: true, enum: [
    'exam', 'assignment', 'homework', 'fee', 'attendance', 
    'leave', 'message', 'announcement', 'library', 'timetable', 'general'
  ] })
  notification_type: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String })
  link: string;

  @Prop({ type: String, enum: ['low', 'medium', 'high'], default: 'medium' })
  priority: string;

  @Prop({ type: Boolean, default: false })
  read: boolean;

  @Prop({ type: Date })
  read_at: Date;

  @Prop({ type: Date })
  expires_at: Date;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop({ type: Date, default: null })
  deleted_at: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Indexes
NotificationSchema.index({ school_id: 1, user_id: 1, read: 1 });
NotificationSchema.index({ school_id: 1, notification_type: 1 });
NotificationSchema.index({ expires_at: 1 });
NotificationSchema.index({ created_at: -1 });
