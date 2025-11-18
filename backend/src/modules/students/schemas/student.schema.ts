import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true, collection: 'student_academics' })
export class Student {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  school_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  academic_year_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  standard: number;

  @Prop({ type: Types.ObjectId, required: true })
  section_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  roll_no: string;

  @Prop({ type: String, required: true })
  admission_no: string;

  @Prop({ type: Date, required: true })
  admission_date: Date;

  @Prop({ type: String, enum: ['active', 'inactive', 'transferred', 'graduated'], default: 'active' })
  status: string;

  @Prop({ type: String })
  blood_group: string;

  @Prop({ type: String })
  religion: string;

  @Prop({ type: String })
  caste: string;

  @Prop({ type: String })
  category: string;

  @Prop({ type: String })
  mother_tongue: string;

  @Prop({ type: String })
  nationality: string;

  @Prop({ type: String })
  previous_school: string;

  @Prop({ type: String })
  transport_mode: string;

  @Prop({ type: Types.ObjectId })
  route_id: Types.ObjectId;

  @Prop([{ type: Types.ObjectId }])
  parent_ids: Types.ObjectId[];

  @Prop({ type: Object })
  medical_info: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    emergency_contact?: string;
  };

  @Prop({ type: Date })
  deleted_at: Date;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

// Indexes for better query performance
StudentSchema.index({ school_id: 1, academic_year_id: 1, standard: 1 });
StudentSchema.index({ admission_no: 1 }, { unique: true });
StudentSchema.index({ roll_no: 1, section_id: 1 });
