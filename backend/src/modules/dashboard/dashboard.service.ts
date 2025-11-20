import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Teacher, TeacherDocument } from '../teachers/schemas/teacher.schema';
import { Student, StudentDocument } from '../students/schemas/student.schema';
import { Attendance, AttendanceDocument } from '../attendance/schemas/attendance.schema';
import { Assignment, AssignmentDocument } from '../assignments/schemas/assignment.schema';
import { Homework, HomeworkDocument } from '../homework/schemas/homework.schema';
import { Exam, ExamDocument } from '../exams/schemas/exam.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(Assignment.name) private assignmentModel: Model<AssignmentDocument>,
    @InjectModel(Homework.name) private homeworkModel: Model<HomeworkDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Teacher Dashboard - Composite API
   */
  async getTeacherDashboard(teacherId: string, date?: string): Promise<any> {
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Get teacher info with assigned classes
    const teacher = await this.teacherModel
      .findById(teacherId)
      .populate('user_id', 'name email mobile_no')
      .exec();

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    // Get total students under this teacher (from assigned classes)
    const totalStudents = await this.studentModel.countDocuments({
      school_id: teacher.school_id,
      // Add class filter if teacher has specific classes assigned
    });

    // Get today's classes/schedule count
    const todayClasses = 4; // This would come from timetable module

    // Get pending grading count (assignments + homework)
    const [pendingAssignments, pendingHomework] = await Promise.all([
      this.assignmentModel.countDocuments({
        school_id: teacher.school_id,
        assigned_by: new Types.ObjectId(teacherId),
        status: { $in: ['active', 'submitted'] },
      }),
      this.homeworkModel.countDocuments({
        school_id: teacher.school_id,
        assigned_by: new Types.ObjectId(teacherId),
        status: 'active',
      }),
    ]);

    // Get today's attendance summary (classes where teacher marked attendance)
    const todayAttendance = await this.attendanceModel.aggregate([
      {
        $match: {
          school_id: teacher.school_id,
          marked_by: new Types.ObjectId(teacherId),
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
          },
          absent: {
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
          },
        },
      },
    ]);

    const attendanceStats = todayAttendance[0] || { total: 0, present: 0, absent: 0 };
    const attendancePercentage = attendanceStats.total > 0 
      ? (attendanceStats.present / attendanceStats.total) * 100 
      : 0;

    // Get upcoming exams (where teacher is examiner)
    const upcomingExams = await this.examModel
      .find({
        school_id: teacher.school_id,
        start_date: { $gte: new Date() },
      })
      .sort({ start_date: 1 })
      .limit(5)
      .exec();

    // Get recent activities
    const recentActivities = [
      { action: 'Attendance marked', details: `${attendanceStats.present} students present`, time: 'Today' },
      { action: 'Assignment created', details: 'Physics Chapter 5', time: '2 days ago' },
      { action: 'Homework assigned', details: 'Mathematics problems', time: '3 days ago' },
    ];

    return {
      teacher_info: {
        name: (teacher.user_id as any)?.name || 'Unknown',
        employee_id: teacher.employee_id,
        subjects: teacher.subjects,
        email: (teacher.user_id as any)?.email,
        phone: (teacher.user_id as any)?.mobile_no,
      },
      stats: {
        my_classes: teacher.subjects?.length || 0,
        total_students: totalStudents,
        today_classes: todayClasses,
        pending_grading: pendingAssignments + pendingHomework,
      },
      today_attendance: {
        total: attendanceStats.total,
        present: attendanceStats.present,
        absent: attendanceStats.absent,
        percentage: Math.round(attendancePercentage * 10) / 10,
      },
      upcoming_exams: upcomingExams.map(exam => ({
        id: exam._id,
        name: exam.name,
        exam_type: exam.exam_type,
        date: exam.start_date,
        status: exam.status,
      })),
      recent_activities: recentActivities,
    };
  }

  /**
   * Admin Dashboard - School Overview
   */
  async getAdminDashboard(schoolId: string, startDate?: string, endDate?: string): Promise<any> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const schoolObjectId = new Types.ObjectId(schoolId);

    // Get total counts
    const [totalStudents, totalTeachers, totalStaff] = await Promise.all([
      this.studentModel.countDocuments({ school_id: schoolObjectId, deleted_at: null }),
      this.teacherModel.countDocuments({ school_id: schoolObjectId, deleted_at: null }),
      this.userModel.countDocuments({ 
        school_id: schoolObjectId, 
        role: { $in: ['accountant', 'librarian', 'receptionist'] },
        deleted_at: null,
      }),
    ]);

    // Get today's attendance
    const todayAttendance = await this.attendanceModel.aggregate([
      {
        $match: {
          school_id: schoolObjectId,
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
          },
        },
      },
    ]);

    const attendanceStats = todayAttendance[0] || { total: 0, present: 0 };
    const attendancePercentage = attendanceStats.total > 0
      ? (attendanceStats.present / attendanceStats.total) * 100
      : 0;

    // Get fee collection stats (mock for now, will be replaced with actual fee module data)
    const feeStats = {
      total_collected: 450000,
      pending: 150000,
      defaulters: 28,
    };

    // Get recent activities
    const recentActivities = [
      { action: 'New student admission', user: 'Raj Kumar', time: '2 hours ago' },
      { action: 'Fee payment received', user: 'Priya Sharma', time: '4 hours ago' },
      { action: 'Exam scheduled', user: 'Math Teacher', time: '5 hours ago' },
      { action: 'Teacher joined', user: 'Mr. Singh', time: '1 day ago' },
    ];

    // Get class-wise student distribution
    const classDistribution = await this.studentModel.aggregate([
      {
        $match: {
          school_id: schoolObjectId,
          deleted_at: null,
        },
      },
      {
        $group: {
          _id: '$standard',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return {
      overview: {
        total_students: totalStudents,
        total_teachers: totalTeachers,
        total_staff: totalStaff,
        total_users: totalStudents + totalTeachers + totalStaff,
      },
      today_attendance: {
        total: attendanceStats.total,
        present: attendanceStats.present,
        absent: attendanceStats.total - attendanceStats.present,
        percentage: Math.round(attendancePercentage * 10) / 10,
      },
      fee_collection: feeStats,
      class_distribution: classDistribution.map(item => ({
        class: item._id,
        students: item.count,
      })),
      recent_activities: recentActivities,
    };
  }

  /**
   * Get all students of a parent
   */
  async getParentStudents(parentId: string): Promise<any> {
    // Find all students where parent_id matches
    const students = await this.studentModel
      .find({
        parent_ids: new Types.ObjectId(parentId),
        deleted_at: null,
      })
      .populate('user_id', 'name')
      .populate('section_id', 'name')
      .exec();

    return students.map(student => ({
      id: student._id,
      name: (student.user_id as any)?.name || 'Unknown',
      admission_no: student.admission_no,
      class: student.standard,
      section: student.section_id ? (student.section_id as any).name : null,
      roll_no: student.roll_no,
      status: student.status,
    }));
  }

  /**
   * Get detailed info for one child (for parent app)
   */
  async getChildDashboard(studentId: string, parentId: string): Promise<any> {
    // Verify parent-child relationship
    const student = await this.studentModel.findOne({
      _id: new Types.ObjectId(studentId),
      parent_ids: new Types.ObjectId(parentId),
      deleted_at: null,
    }).populate('user_id', 'name');

    if (!student) {
      throw new Error('Student not found or not associated with this parent');
    }

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get attendance for current month
    const attendanceRecords = await this.attendanceModel.find({
      user_id: new Types.ObjectId(studentId),
      date: { $gte: startOfMonth },
    });

    const presentDays = attendanceRecords.filter(a => a.status === 'present').length;
    const totalDays = attendanceRecords.length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    // Get pending assignments
    const pendingAssignments = await this.assignmentModel.countDocuments({
      standard: student.standard,
      section_id: student.section_id,
      due_date: { $gte: today },
      status: 'active',
    });

    // Get pending homework
    const pendingHomework = await this.homeworkModel.countDocuments({
      standard: student.standard,
      section_id: student.section_id,
      submission_date: { $gte: today },
      status: 'active',
    });

    return {
      student_info: {
        id: student._id,
        name: (student.user_id as any)?.name || 'Unknown',
        class: student.standard,
        roll_no: student.roll_no,
        admission_no: student.admission_no,
      },
      stats: {
        attendance: Math.round(attendancePercentage * 10) / 10,
        pending_assignments: pendingAssignments,
        pending_homework: pendingHomework,
      },
      attendance_summary: {
        total_days: totalDays,
        present_days: presentDays,
        absent_days: totalDays - presentDays,
      },
    };
  }
}
