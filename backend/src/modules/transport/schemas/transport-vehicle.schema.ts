import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransportVehicleDocument = TransportVehicle & Document;

@Schema({ timestamps: true, collection: 'transport_vehicles' })
export class TransportVehicle {
  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  vehicle_number: string;

  @Prop({ type: String })
  vehicle_model: string;

  @Prop({ type: Types.ObjectId, ref: 'TransportRoute' })
  route_id: Types.ObjectId;

  @Prop({ type: String })
  driver_name: string;

  @Prop({ type: String })
  driver_contact: string;

  @Prop({ type: String })
  driver_license: string;

  @Prop({ type: Number })
  seating_capacity: number;

  @Prop({ type: String, enum: ['active', 'maintenance', 'inactive'], default: 'active' })
  status: string;

  @Prop({ type: Date })
  deleted_at: Date;
}

export const TransportVehicleSchema = SchemaFactory.createForClass(TransportVehicle);
TransportVehicleSchema.index({ school_id: 1, route_id: 1 });
