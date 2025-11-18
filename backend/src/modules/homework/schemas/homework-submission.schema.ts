import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HomeworkSubmissionDocument = HomeworkSubmission & Document;

@Schema({ timestamps: true, collection: 'homework_submissions' })
export class HomeworkSubmission {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Homework', index: true })
  homework_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Student', index: true })
  student_id: Types.ObjectId;

  @Prop({ type: Date })
  submitted_at: Date;

  @Prop({ type: String })
  submission_text: string;

  @Prop({ type: [String] })
  files: string[];

  @Prop({ type: String, enum: ['pending', 'submitted', 'checked', 'resubmit'], default: 'pending' })
  status: string;

  @Prop({ type: String })
  teacher_remarks: string;

  @Prop({ type: Boolean, default: false })
  is_late: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Teacher' })
  checked_by: Types.ObjectId;

  @Prop({ type: Date })
  checked_at: Date;
}

export const HomeworkSubmissionSchema = SchemaFactory.createForClass(HomeworkSubmission);
HomeworkSubmissionSchema.index({ homework_id: 1, student_id: 1 }, { unique: true });
