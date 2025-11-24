import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AcademicController } from './academic.controller';
import { AcademicService } from './academic.service';
import { AcademicYear, AcademicYearSchema } from './schemas/academic-year.schema';
import { SectionsModule } from '../sections/sections.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AcademicYear.name, schema: AcademicYearSchema }]),
    SectionsModule,
  ],
  controllers: [AcademicController],
  providers: [AcademicService],
  exports: [AcademicService],
})
export class AcademicModule {}
