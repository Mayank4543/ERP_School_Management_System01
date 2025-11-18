import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

export type UserDocument = User & Document;

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  LIBRARIAN = 'librarian',
  ACCOUNTANT = 'accountant',
  RECEPTIONIST = 'receptionist',
}

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School', required: false, index: true })
  school_id: Types.ObjectId;

  @Prop({ required: true, enum: UserRole, index: true })
  usergroup_id: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  ref_id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ trim: true, index: true })
  mobile_no: string;

  @Prop({ default: true })
  is_activated: boolean;

  @Prop()
  email_verification_code: string;

  @Prop({ default: false })
  email_verified: boolean;

  @Prop({ type: Date })
  email_verified_at: Date;

  @Prop()
  platform_token: string;

  @Prop({ type: [String], default: [] })
  roles: string[];

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ type: Date })
  deleted_at: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ school_id: 1, email: 1 });
UserSchema.index({ school_id: 1, usergroup_id: 1 });
UserSchema.index({ school_id: 1, mobile_no: 1 });

// Virtual populate for profile
UserSchema.virtual('profile', {
  ref: 'UserProfile',
  localField: '_id',
  foreignField: 'user_id',
  justOne: true,
});

// Ensure virtuals are included in JSON
UserSchema.set('toJSON', {
  virtuals: true,
});
