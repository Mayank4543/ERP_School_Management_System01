import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeaveDocument = Leave & Document;

@Schema({ timestamps: true, collection: 'leaves' })
export class Leave {
  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  user_id: Types.ObjectId;

  @Prop({ type: String, enum: ['student', 'teacher', 'staff'] })
  user_type: string;

  @Prop({ type: String, enum: ['sick', 'casual', 'emergency', 'other'] })
  leave_type: string;

  @Prop({ type: Date, required: true })
  start_date: Date;

  @Prop({ type: Date, required: true })
  end_date: Date;

  @Prop({ type: Number })
  total_days: number;

  @Prop({ type: String, required: true })
  reason: string;

  @Prop({ type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: string;

  @Prop({ type: String })
  remarks: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approved_by: Types.ObjectId;

  @Prop({ type: Date })
  approved_at: Date;

  @Prop({ type: Date, default: Date.now })
  applied_at: Date;
}

export const LeaveSchema = SchemaFactory.createForClass(Leave);
LeaveSchema.index({ school_id: 1, user_id: 1, status: 1 });
