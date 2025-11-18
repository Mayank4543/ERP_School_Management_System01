import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TimetableDocument = Timetable & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'timetables' })
export class Timetable {
  @Prop({ type: Types.ObjectId, ref: 'School', required: true, index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AcademicYear', required: true })
  academic_year_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  standard: number;

  @Prop({ type: Types.ObjectId, ref: 'Section', required: true })
  section_id: Types.ObjectId;

  @Prop({ type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] })
  day: string;

  @Prop({
    type: [{
      period_number: { type: Number, required: true },
      subject_id: { type: Types.ObjectId, ref: 'Subject' },
      subject_name: { type: String, required: true },
      teacher_id: { type: Types.ObjectId, ref: 'Teacher' },
      teacher_name: { type: String, required: true },
      start_time: { type: String, required: true },
      end_time: { type: String, required: true },
      room_no: { type: String },
      is_break: { type: Boolean, default: false }
    }],
    required: true
  })
  periods: Array<{
    period_number: number;
    subject_id?: Types.ObjectId;
    subject_name: string;
    teacher_id?: Types.ObjectId;
    teacher_name: string;
    start_time: string;
    end_time: string;
    room_no?: string;
    is_break: boolean;
  }>;

  @Prop({ type: Date, default: null })
  deleted_at: Date;

  created_at: Date;
  updated_at: Date;
}

export const TimetableSchema = SchemaFactory.createForClass(Timetable);

// Indexes for better query performance
TimetableSchema.index({ school_id: 1, academic_year_id: 1, standard: 1, section_id: 1, day: 1 });
TimetableSchema.index({ deleted_at: 1 });
TimetableSchema.index({ 'periods.teacher_id': 1 });

