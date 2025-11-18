import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransportRoute, TransportRouteSchema } from './schemas/transport-route.schema';
import { TransportVehicle, TransportVehicleSchema } from './schemas/transport-vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransportRoute.name, schema: TransportRouteSchema },
      { name: TransportVehicle.name, schema: TransportVehicleSchema },
    ]),
  ],
})
export class TransportModule {}
