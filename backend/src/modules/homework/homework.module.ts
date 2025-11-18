import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Homework, HomeworkSchema } from './schemas/homework.schema';
import { HomeworkSubmission, HomeworkSubmissionSchema } from './schemas/homework-submission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Homework.name, schema: HomeworkSchema },
      { name: HomeworkSubmission.name, schema: HomeworkSubmissionSchema },
    ]),
  ],
})
export class HomeworkModule {}
