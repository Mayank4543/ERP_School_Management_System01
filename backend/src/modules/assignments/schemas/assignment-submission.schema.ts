import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AssignmentSubmissionDocument = AssignmentSubmission & Document;

@Schema({ timestamps: true })
export class AssignmentSubmission {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Assignment', index: true })
  assignment_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Student', index: true })
  student_id: Types.ObjectId;

  @Prop({ type: Date })
  submitted_at: Date;

  @Prop({ type: [String] })
  files: string[];

  @Prop({ type: String })
  remarks: string;

  @Prop({ type: Number })
  marks_obtained: number;

  @Prop({ type: String, enum: ['submitted', 'graded', 'returned'], default: 'submitted' })
  status: string;

  @Prop({ type: Boolean, default: false })
  is_late: boolean;
}

export const AssignmentSubmissionSchema = SchemaFactory.createForClass(AssignmentSubmission);
AssignmentSubmissionSchema.index({ assignment_id: 1, student_id: 1 }, { unique: true });
