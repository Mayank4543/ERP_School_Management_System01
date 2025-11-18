import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LibraryBookDocument = LibraryBook & Document;

@Schema({ timestamps: true, collection: 'library_books' })
export class LibraryBook {
  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  author: string;

  @Prop({ type: String, unique: true, required: true })
  isbn: string;

  @Prop({ type: String })
  publisher: string;

  @Prop({ type: String })
  category: string;

  @Prop({ type: Number, required: true })
  total_copies: number;

  @Prop({ type: Number, default: 0 })
  available_copies: number;

  @Prop({ type: String })
  rack_number: string;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: Date })
  purchase_date: Date;

  @Prop({ type: String, enum: ['available', 'unavailable'], default: 'available' })
  status: string;

  @Prop({ type: Date })
  deleted_at: Date;
}

export const LibraryBookSchema = SchemaFactory.createForClass(LibraryBook);
LibraryBookSchema.index({ school_id: 1, category: 1 });
