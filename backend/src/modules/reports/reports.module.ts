import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Attendance, AttendanceSchema } from '../attendance/schemas/attendance.schema';
import { Student, StudentSchema } from '../students/schemas/student.schema';
import { StudentFee, StudentFeeSchema } from '../fees/schemas/student-fee.schema';
import { Exam, ExamSchema } from '../exams/schemas/exam.schema';
import { Mark, MarkSchema } from '../exams/schemas/mark.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Student.name, schema: StudentSchema },
      { name: StudentFee.name, schema: StudentFeeSchema },
      { name: Exam.name, schema: ExamSchema },
      { name: Mark.name, schema: MarkSchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
