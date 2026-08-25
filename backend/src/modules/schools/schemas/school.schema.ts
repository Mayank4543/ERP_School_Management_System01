import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export type SchoolDocument = School & Document;

export enum SchoolStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

@Schema({ timestamps: true, collection: 'schools' })
export class School {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ trim: true })
  phone: string;

  @Prop()
  address: string;

  @Prop({ required: true, trim: true })
  state: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ type: Types.ObjectId, ref: 'Country' })
  country_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'State' })
  state_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'City' })
  city_id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  pincode: string;

  @Prop({ unique: true, trim: true, lowercase: true })
  slug: string;

  @Prop({ type: String, enum: Object.values(SchoolStatus), default: SchoolStatus.PENDING })
  status: SchoolStatus;

  @Prop({ type: Date })
  approved_at: Date;

  @Prop({ type: Date })
  rejected_at: Date;

  @Prop({ trim: true, maxlength: 500 })
  rejection_reason: string;

  @Prop()
  logo: string;

  @Prop()
  board: string;

  @Prop()
  website: string;

  @Prop({ type: Date })
  deleted_at: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const SchoolSchema = SchemaFactory.createForClass(School);

// Indexes
SchoolSchema.index({ slug: 1 });
SchoolSchema.index({ email: 1 });
SchoolSchema.index({ status: 1 });
