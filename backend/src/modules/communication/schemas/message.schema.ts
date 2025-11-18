import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, refPath: 'sender_type', required: true })
  sender_id: Types.ObjectId;

  @Prop({ type: String, required: true, enum: ['admin', 'teacher', 'student', 'parent'] })
  sender_type: string;

  @Prop({ type: Types.ObjectId, refPath: 'recipient_type' })
  recipient_id: Types.ObjectId;

  @Prop({ type: String, enum: ['admin', 'teacher', 'student', 'parent', 'class'] })
  recipient_type: string;

  @Prop({ type: String, required: true, enum: ['direct', 'broadcast', 'announcement'] })
  message_type: string;

  // For broadcast to specific class
  @Prop({ type: Number })
  target_standard: number;

  @Prop({ type: Types.ObjectId, ref: 'Section' })
  target_section_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  subject: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String, enum: ['low', 'medium', 'high'], default: 'medium' })
  priority: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({ type: Boolean, default: false })
  read: boolean;

  @Prop({ type: Date })
  read_at: Date;

  @Prop({ type: Date, default: null })
  deleted_at: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Indexes
MessageSchema.index({ school_id: 1, recipient_id: 1, read: 1 });
MessageSchema.index({ school_id: 1, sender_id: 1 });
MessageSchema.index({ school_id: 1, target_standard: 1, target_section_id: 1 });
MessageSchema.index({ created_at: -1 });
