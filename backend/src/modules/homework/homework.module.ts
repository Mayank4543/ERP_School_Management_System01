import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Homework, HomeworkSchema } from './schemas/homework.schema';
import { HomeworkSubmission, HomeworkSubmissionSchema } from './schemas/homework-submission.schema';
import { HomeworkController } from './homework.controller';
import { HomeworkService } from './homework.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Homework.name, schema: HomeworkSchema },
      { name: HomeworkSubmission.name, schema: HomeworkSubmissionSchema },
    ]),
  ],
  controllers: [HomeworkController],
  providers: [HomeworkService],
  exports: [HomeworkService],
})
export class HomeworkModule {}
