import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true, collection: 'events' })
export class Event {
  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, enum: ['academic', 'sports', 'cultural', 'holiday', 'exam', 'meeting', 'other'] })
  event_type: string;

  @Prop({ type: Date, required: true })
  start_date: Date;

  @Prop({ type: Date })
  end_date: Date;

  @Prop({ type: String })
  venue: string;

  @Prop({ type: [String], enum: ['all', 'students', 'teachers', 'parents'] })
  participants: string[];

  @Prop({ type: [Number] })
  target_standards: number[];

  @Prop({ type: String, enum: ['scheduled', 'ongoing', 'completed', 'cancelled'], default: 'scheduled' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  created_by: Types.ObjectId;

  @Prop({ type: Date })
  deleted_at: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ school_id: 1, start_date: -1 });
