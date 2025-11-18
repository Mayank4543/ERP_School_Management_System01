import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export type AcademicYearDocument = AcademicYear & Document;

@Schema({ timestamps: true, collection: 'academic_years' })
export class AcademicYear {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true, index: true })
  school_id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Date, required: true })
  start_date: Date;

  @Prop({ type: Date, required: true })
  end_date: Date;

  @Prop({ default: false })
  is_current: boolean;

  @Prop({ default: 'active', enum: ['active', 'inactive', 'completed'] })
  status: string;

  @Prop({ type: Date })
  deleted_at: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const AcademicYearSchema = SchemaFactory.createForClass(AcademicYear);

// Indexes
AcademicYearSchema.index({ school_id: 1, is_current: 1 });
AcademicYearSchema.index({ school_id: 1, status: 1 });
