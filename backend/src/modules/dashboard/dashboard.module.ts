import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Teacher, TeacherSchema } from '../teachers/schemas/teacher.schema';
import { Student, StudentSchema } from '../students/schemas/student.schema';
import { Attendance, AttendanceSchema } from '../attendance/schemas/attendance.schema';
import { Assignment, AssignmentSchema } from '../assignments/schemas/assignment.schema';
import { Homework, HomeworkSchema } from '../homework/schemas/homework.schema';
import { Exam, ExamSchema } from '../exams/schemas/exam.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Teacher.name, schema: TeacherSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Assignment.name, schema: AssignmentSchema },
      { name: Homework.name, schema: HomeworkSchema },
      { name: Exam.name, schema: ExamSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
