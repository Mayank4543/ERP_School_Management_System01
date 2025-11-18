import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransportRouteDocument = TransportRoute & Document;

@Schema({ timestamps: true, collection: 'transport_routes' })
export class TransportRoute {
  @Prop({ type: Types.ObjectId, required: true, ref: 'School', index: true })
  school_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  route_name: string;

  @Prop({ type: String, required: true })
  route_number: string;

  @Prop({ type: [String] })
  stops: string[];

  @Prop({ type: String })
  start_point: string;

  @Prop({ type: String })
  end_point: string;

  @Prop({ type: Number })
  distance_km: number;

  @Prop({ type: Number })
  monthly_fee: number;

  @Prop({ type: String, enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ type: Date })
  deleted_at: Date;
}

export const TransportRouteSchema = SchemaFactory.createForClass(TransportRoute);
TransportRouteSchema.index({ school_id: 1, status: 1 });
