import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance, AttendanceDocument } from '../attendance/schemas/attendance.schema';
import { Student, StudentDocument } from '../students/schemas/student.schema';
import { StudentFee, StudentFeeDocument } from '../fees/schemas/student-fee.schema';
import { Exam, ExamDocument } from '../exams/schemas/exam.schema';
import { Mark, MarkDocument } from '../exams/schemas/mark.schema';
import { AttendanceReportDto, FeeReportDto, AcademicReportDto } from './dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(StudentFee.name) private studentFeeModel: Model<StudentFeeDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    @InjectModel(Mark.name) private markModel: Model<MarkDocument>,
  ) {}

  /**
   * Generate Attendance Report
   */
  async generateAttendanceReport(dto: AttendanceReportDto): Promise<any> {
    const { standard, section_id, start_date, end_date, student_id } = dto;
    
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    const matchCondition: any = {
      date: { $gte: startDate, $lte: endDate },
    };

    if (student_id) {
      // Individual student report
      matchCondition.user_id = new Types.ObjectId(student_id);
      
      const student = await this.studentModel.findById(student_id).populate('user_id', 'name');
      const attendanceRecords = await this.attendanceModel.find(matchCondition).sort({ date: 1 });

      const totalDays = attendanceRecords.length;
      const presentDays = attendanceRecords.filter(a => a.status === 'present').length;
      const absentDays = attendanceRecords.filter(a => a.status === 'absent').length;
      const lateDays = attendanceRecords.filter(a => a.status === 'late').length;
      const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      return {
        report_type: 'student_attendance',
        student: {
          id: student._id,
          name: (student.user_id as any)?.name || 'Unknown',
          admission_no: student.admission_no,
          class: student.standard,
          roll_no: student.roll_no,
        },
        period: {
          start_date,
          end_date,
        },
        summary: {
          total_days: totalDays,
          present: presentDays,
          absent: absentDays,
          late: lateDays,
          percentage: Math.round(percentage * 10) / 10,
        },
        daily_records: attendanceRecords.map(record => ({
          date: record.date,
          status: record.status,
          remarks: record.remarks,
        })),
      };
    } else {
      // Class-wise report
      const students = await this.studentModel.find({
        standard,
        ...(section_id && { section_id: new Types.ObjectId(section_id) }),
        deleted_at: null,
      }).populate('user_id', 'name');

      const studentIds = students.map(s => s._id);
      matchCondition.user_id = { $in: studentIds };

      const attendanceData = await this.attendanceModel.aggregate([
        { $match: matchCondition },
        {
          $group: {
            _id: '$user_id',
            total: { $sum: 1 },
            present: {
              $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
            },
            absent: {
              $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
            },
            late: {
              $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] },
            },
          },
        },
      ]);

      const reportData = students.map(student => {
        const attendance = attendanceData.find(a => a._id.equals(student._id));
        const total = attendance?.total || 0;
        const present = attendance?.present || 0;
        const percentage = total > 0 ? (present / total) * 100 : 0;

        return {
          student_id: student._id,
          name: (student.user_id as any)?.name || 'Unknown',
          admission_no: student.admission_no,
          roll_no: student.roll_no,
          total_days: total,
          present: present,
          absent: attendance?.absent || 0,
          late: attendance?.late || 0,
          percentage: Math.round(percentage * 10) / 10,
        };
      });

      // Calculate class average
      const classAverage = reportData.length > 0
        ? reportData.reduce((sum, s) => sum + s.percentage, 0) / reportData.length
        : 0;

      return {
        report_type: 'class_attendance',
        class: { standard, section_id },
        period: { start_date, end_date },
        total_students: students.length,
        class_average: Math.round(classAverage * 10) / 10,
        students: reportData.sort((a, b) => a.roll_no.localeCompare(b.roll_no)),
      };
    }
  }

  /**
   * Generate Fee Collection Report
   */
  async generateFeeReport(dto: FeeReportDto): Promise<any> {
    const { school_id, academic_year, standard } = dto;

    const matchCondition: any = {
      school_id: new Types.ObjectId(school_id),
      deleted_at: null,
    };

    if (academic_year) {
      matchCondition.academic_year_id = new Types.ObjectId(academic_year);
    }

    if (standard) {
      // Get students of this class
      const students = await this.studentModel.find({
        school_id: new Types.ObjectId(school_id),
        standard,
        deleted_at: null,
      });
      matchCondition.student_id = { $in: students.map(s => s._id) };
    }

    const fees = await this.studentFeeModel
      .find(matchCondition)
      .populate({
        path: 'student_id',
        populate: { path: 'user_id', select: 'name' },
      })
      .exec();

    const totalAmount = fees.reduce((sum, fee) => sum + fee.total_fees, 0);
    const paidAmount = fees.reduce((sum, fee) => sum + fee.paid_fees, 0);
    const pendingAmount = fees.reduce((sum, fee) => sum + fee.pending_fees, 0);
    
    // Count defaulters (students with overdue fee items)
    const defaulters = fees.filter(fee => 
      fee.fee_items.some(item => item.status === 'overdue')
    ).length;

    // Get class-wise breakdown
    const studentIds = fees.map(f => f.student_id);
    const students = await this.studentModel.find({
      _id: { $in: studentIds },
      deleted_at: null,
    });

    const classWiseMap = new Map();
    fees.forEach(fee => {
      const feeStudentId = fee.student_id as Types.ObjectId | string;
      const student = students.find(s => s._id.toString() === (feeStudentId as any).toString());
      if (student) {
        const std = student.standard;
        if (!classWiseMap.has(std)) {
          classWiseMap.set(std, { total: 0, paid: 0, count: 0 });
        }
        const data = classWiseMap.get(std);
        data.total += fee.total_fees;
        data.paid += fee.paid_fees;
        data.count += 1;
      }
    });

    const classWise = Array.from(classWiseMap.entries()).map(([std, data]) => ({
      class: std,
      students: data.count,
      total_amount: data.total,
      paid_amount: data.paid,
      pending: data.total - data.paid,
    }));

    return {
      report_type: 'fee_collection',
      school_id,
      period: { academic_year },
      summary: {
        total_fees: fees.length,
        total_amount: totalAmount,
        paid_amount: paidAmount,
        pending_amount: pendingAmount,
        defaulters_count: defaulters,
        collection_percentage: totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0,
      },
      class_wise: classWise.sort((a, b) => a.class - b.class),
      detailed_records: fees.map(fee => {
        const student = fee.student_id as any;
        return {
          student: {
            id: student._id,
            name: student.user_id?.name || 'Unknown',
            admission_no: student.admission_no,
            class: student.standard,
            roll_no: student.roll_no,
          },
          total_amount: fee.total_fees,
          paid_amount: fee.paid_fees,
          pending_amount: fee.pending_fees,
          fee_items: fee.fee_items,
        };
      }),
    };
  }

  /**
   * Generate Academic Progress Report
   */
  async generateAcademicReport(dto: AcademicReportDto): Promise<any> {
    const { student_id, academic_year_id } = dto;

    const student = await this.studentModel.findById(student_id).populate('user_id', 'name');
    if (!student) {
      throw new Error('Student not found');
    }

    // Get all exams for this academic year and class
    const exams = await this.examModel.find({
      academic_year_id: new Types.ObjectId(academic_year_id),
      standards: student.standard,
      deleted_at: null,
    }).sort({ start_date: 1 });

    const examIds = exams.map(e => e._id);

    // Get student's marks in all these exams
    const marks = await this.markModel.find({
      exam_id: { $in: examIds },
      student_id: new Types.ObjectId(student_id),
      deleted_at: null,
    }).populate('exam_id', 'name exam_type');

    const examResults = marks.map(mark => {
      const exam = mark.exam_id as any;
      const percentage = (mark.marks_obtained / mark.total_marks) * 100;
      
      return {
        exam_name: exam.name,
        exam_type: exam.exam_type,
        subject: mark.subject,
        total_marks: mark.total_marks,
        marks_obtained: mark.marks_obtained,
        percentage: Math.round(percentage * 10) / 10,
        grade: mark.grade || this.calculateGrade(percentage),
      };
    });

    // Calculate overall statistics
    const totalMarks = marks.reduce((sum, m) => sum + m.total_marks, 0);
    const obtainedMarks = marks.reduce((sum, m) => sum + m.marks_obtained, 0);
    const overallPercentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

    return {
      report_type: 'academic_progress',
      student: {
        id: student._id,
        name: (student.user_id as any)?.name || 'Unknown',
        admission_no: student.admission_no,
        class: student.standard,
        roll_no: student.roll_no,
      },
      academic_year: academic_year_id,
      overall_performance: {
        total_exams: marks.length,
        total_marks: totalMarks,
        marks_obtained: obtainedMarks,
        percentage: Math.round(overallPercentage * 10) / 10,
        grade: this.calculateGrade(overallPercentage),
      },
      exam_wise_performance: examResults,
    };
  }

  /**
   * Get defaulters list
   */
  async getDefaultersList(schoolId: string): Promise<any> {
    const fees = await this.studentFeeModel
      .find({
        school_id: new Types.ObjectId(schoolId),
        pending_fees: { $gt: 0 },
        deleted_at: null,
      })
      .populate({
        path: 'student_id',
        populate: { path: 'user_id', select: 'name mobile_no' },
      })
      .exec();

    // Filter students with overdue fee items
    const defaulters = fees.filter(fee =>
      fee.fee_items.some(item => item.status === 'overdue')
    );

    return defaulters.map(fee => {
      const student = fee.student_id as any;
      const overdueItems = fee.fee_items.filter(item => item.status === 'overdue');
      const overdueDays = overdueItems.length > 0 && overdueItems[0].due_date
        ? Math.floor((new Date().getTime() - new Date(overdueItems[0].due_date).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      return {
        student: {
          id: student._id,
          name: student.user_id?.name || 'Unknown',
          admission_no: student.admission_no,
          class: student.standard,
          roll_no: student.roll_no,
          phone: student.user_id?.mobile_no,
        },
        total_amount: fee.total_fees,
        paid_amount: fee.paid_fees,
        pending_amount: fee.pending_fees,
        overdue_items: overdueItems,
        overdue_days: overdueDays,
      };
    });
  }

  /**
   * Helper: Calculate grade from percentage
   */
  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  }
}
