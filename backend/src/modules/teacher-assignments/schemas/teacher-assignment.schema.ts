import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export type TeacherAssignmentDocument = TeacherAssignment & Document;

@Schema({ timestamps: true, collection: 'teacher_assignments' })
export class TeacherAssignment {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'AcademicYear' })
  academic_year_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Teacher', index: true })
  teacher_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Subject', index: true })
  subject_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  standard: number; // Class/Grade

  @Prop({ type: Types.ObjectId, required: true, ref: 'Section', index: true })
  section_id: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  periods_per_week: number;

  @Prop({ 
    type: String, 
    enum: ['primary', 'secondary'], 
    default: 'primary',
    description: 'Primary teacher for main responsibility, Secondary for substitute/support'
  })
  assignment_type: string;

  @Prop({ type: Boolean, default: true })
  is_class_teacher: boolean; // If this teacher is the class teacher for this section

  @Prop({ type: Date })
  start_date: Date;

  @Prop({ type: Date })
  end_date: Date;

  @Prop({ type: String, enum: ['active', 'inactive', 'completed'], default: 'active' })
  status: string;

  @Prop({ type: String })
  notes: string;

  @Prop({ type: Date, default: null })
  deleted_at: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const TeacherAssignmentSchema = SchemaFactory.createForClass(TeacherAssignment);

// Compound indexes for better query performance and unique constraints
TeacherAssignmentSchema.index({ 
  school_id: 1, 
  academic_year_id: 1, 
  teacher_id: 1, 
  subject_id: 1, 
  standard: 1, 
  section_id: 1 
}, { unique: true });

TeacherAssignmentSchema.index({ teacher_id: 1, academic_year_id: 1, status: 1 });
TeacherAssignmentSchema.index({ subject_id: 1, standard: 1, section_id: 1 });
TeacherAssignmentSchema.index({ school_id: 1, standard: 1, section_id: 1, is_class_teacher: 1 });