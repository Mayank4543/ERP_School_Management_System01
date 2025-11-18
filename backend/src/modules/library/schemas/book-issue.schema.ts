import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookIssueDocument = BookIssue & Document;

@Schema({ timestamps: true, collection: 'book_issues' })
export class BookIssue {
  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'LibraryBook', index: true })
  book_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  issued_to: Types.ObjectId;

  @Prop({ type: String, enum: ['student', 'teacher', 'staff'] })
  user_type: string;

  @Prop({ type: Date, required: true })
  issue_date: Date;

  @Prop({ type: Date, required: true })
  due_date: Date;

  @Prop({ type: Date })
  return_date: Date;

  @Prop({ type: String, enum: ['issued', 'returned', 'overdue'], default: 'issued' })
  status: string;

  @Prop({ type: Number, default: 0 })
  fine_amount: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  issued_by: Types.ObjectId;
}

export const BookIssueSchema = SchemaFactory.createForClass(BookIssue);
BookIssueSchema.index({ school_id: 1, issued_to: 1, status: 1 });
