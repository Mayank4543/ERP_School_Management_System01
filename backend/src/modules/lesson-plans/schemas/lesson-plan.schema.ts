import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LessonPlanDocument = LessonPlan & Document;

@Schema({ timestamps: true, collection: 'lesson_plans' })
export class LessonPlan {
  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'AcademicYear' })
  academic_year_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Teacher', index: true })
  teacher_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  subject: string;

  @Prop({ type: Number, required: true })
  standard: number;

  @Prop({ type: Types.ObjectId, ref: 'Section' })
  section_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  topic: string;

  @Prop({ type: String, required: true })
  lesson_title: string;

  @Prop({ type: Date, required: true })
  lesson_date: Date;

  @Prop({ type: String })
  duration: string; // e.g., "45 minutes", "1 hour"

  @Prop({ type: String })
  learning_objectives: string;

  @Prop({ type: String })
  teaching_methods: string;

  @Prop({ type: String })
  resources_required: string;

  @Prop({ type: String })
  activities: string;

  @Prop({ type: String })
  assessment_method: string;

  @Prop({ type: String })
  homework_assigned: string;

  @Prop({ type: [String] })
  attachments: string[];

  @Prop({ type: String })
  remarks: string;

  @Prop({ type: String, enum: ['draft', 'approved', 'completed'], default: 'draft' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approved_by: Types.ObjectId;

  @Prop({ type: Date })
  approved_at: Date;

  @Prop({ type: Date })
  deleted_at: Date;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}

export const LessonPlanSchema = SchemaFactory.createForClass(LessonPlan);
LessonPlanSchema.index({ school_id: 1, teacher_id: 1, lesson_date: -1 });
LessonPlanSchema.index({ school_id: 1, standard: 1, subject: 1 });
