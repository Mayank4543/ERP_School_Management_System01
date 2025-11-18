import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonPlan, LessonPlanSchema } from './schemas/lesson-plan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LessonPlan.name, schema: LessonPlanSchema }]),
  ],
})
export class LessonPlansModule {}
