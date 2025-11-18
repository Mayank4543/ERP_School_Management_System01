import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NoticeDocument = Notice & Document;

@Schema({ timestamps: true, collection: 'notices' })
export class Notice {
  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Date, required: true })
  notice_date: Date;

  @Prop({ type: [String], enum: ['all', 'students', 'teachers', 'parents', 'staff'] })
  target_audience: string[];

  @Prop({ type: [Number] })
  target_standards: number[];

  @Prop({ type: [String] })
  attachments: string[];

  @Prop({ type: String, enum: ['active', 'expired', 'draft'], default: 'active' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  created_by: Types.ObjectId;

  @Prop({ type: Date })
  deleted_at: Date;
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);
NoticeSchema.index({ school_id: 1, status: 1, notice_date: -1 });
