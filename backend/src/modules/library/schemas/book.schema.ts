import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookDocument = Book & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'books' })
export class Book {
  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  school_id: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  book_no: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: String })
  isbn: string;

  @Prop({ type: String, required: true })
  category: string; // Fiction, Science, History, etc.

  @Prop({ type: String })
  publisher: string;

  @Prop({ type: String })
  edition: string;

  @Prop({ type: Number, required: true })
  total_copies: number;

  @Prop({ type: Number, required: true })
  available_copies: number;

  @Prop({ type: String })
  rack_no: string;

  @Prop({ type: Number, default: 0 })
  price: number;

  @Prop({ type: Date, default: null })
  deleted_at: Date;

  created_at: Date;
  updated_at: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
BookSchema.index({ school_id: 1, book_no: 1 });
BookSchema.index({ title: 'text', author: 'text' });
