import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeacherAssignmentsController } from './teacher-assignments.controller';
import { TeacherAssignmentsService } from './teacher-assignments.service';
import { TeacherAssignment, TeacherAssignmentSchema } from './schemas/teacher-assignment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TeacherAssignment.name, schema: TeacherAssignmentSchema },
    ]),
  ],
  controllers: [TeacherAssignmentsController],
  providers: [TeacherAssignmentsService],
  exports: [TeacherAssignmentsService],
})
export class TeacherAssignmentsModule {}