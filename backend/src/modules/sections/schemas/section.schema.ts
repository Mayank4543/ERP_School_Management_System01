import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export type SectionDocument = Section & Document;

@Schema({ timestamps: true, collection: 'sections' })
export class Section {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'AcademicYear' })
  academic_year_id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string; // A, B, C, etc.

  @Prop({ type: Number, required: true })
  standard: number; // Class/Grade

  @Prop({ type: Number, default: 40 })
  capacity: number; // Maximum students

  @Prop({ type: Number, default: 0 })
  current_strength: number; // Current number of students

  @Prop({ type: Types.ObjectId, ref: 'Teacher' })
  class_teacher_id: Types.ObjectId;

  @Prop({ type: String })
  room_number: string;

  @Prop({ type: String })
  building: string;

  @Prop({ type: String })
  floor: string;

  @Prop({ 
    type: String, 
    enum: ['morning', 'afternoon', 'evening'], 
    default: 'morning' 
  })
  shift: string;

  @Prop({ type: Boolean, default: true })
  is_active: boolean;

  @Prop({ type: String })
  remarks: string;

  @Prop({ type: Date, default: null })
  deleted_at: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const SectionSchema = SchemaFactory.createForClass(Section);

// Compound indexes for better query performance and unique constraints
SectionSchema.index({ 
  school_id: 1, 
  academic_year_id: 1, 
  standard: 1, 
  name: 1 
}, { unique: true });

SectionSchema.index({ school_id: 1, standard: 1, is_active: 1 });
SectionSchema.index({ class_teacher_id: 1 });
SectionSchema.index({ school_id: 1, academic_year_id: 1 });