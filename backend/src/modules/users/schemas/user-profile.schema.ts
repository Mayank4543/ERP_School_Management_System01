import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export type UserProfileDocument = UserProfile & Document;

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
}

@Schema({ timestamps: true, collection: 'userprofiles' })
export class UserProfile {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true, index: true })
  school_id: Types.ObjectId;

  @Prop({ trim: true })
  firstname: string;

  @Prop({ trim: true })
  lastname: string;

  @Prop({ enum: Gender })
  gender: string;

  @Prop({ type: Date })
  date_of_birth: Date;

  @Prop({ trim: true })
  blood_group: string;

  @Prop({ trim: true })
  nationality: string;

  @Prop({ trim: true })
  religion: string;

  @Prop({ trim: true })
  caste: string;

  @Prop({ trim: true })
  mother_tongue: string;

  @Prop({ enum: MaritalStatus })
  marital_status: string;

  @Prop()
  address: string;

  @Prop({ type: Types.ObjectId, ref: 'Country' })
  country_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'State' })
  state_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'City' })
  city_id: Types.ObjectId;

  @Prop({ trim: true })
  pincode: string;

  @Prop()
  profile_picture: string;

  @Prop({ default: 'active', enum: ['active', 'inactive', 'suspended'] })
  status: string;

  @Prop({ type: Date })
  deleted_at: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);

// Indexes
UserProfileSchema.index({ school_id: 1, user_id: 1 });
UserProfileSchema.index({ school_id: 1, status: 1 });
