import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
  ) {}

  async markAttendance(markAttendanceDto: MarkAttendanceDto, markedBy: string): Promise<any> {
    const { school_id, date, user_type, academic_year_id, standard, section_id, attendance } =
      markAttendanceDto;

    const bulkOps = attendance.map((record) => ({
      updateOne: {
        filter: {
          school_id: new Types.ObjectId(school_id),
          user_id: new Types.ObjectId(record.user_id),
          date,
        },
        update: {
          $set: {
            status: record.status,
            user_type,
            marked_by: new Types.ObjectId(markedBy),
            reason: record.reason,
            remarks: record.remarks,
            academic_year_id: academic_year_id ? new Types.ObjectId(academic_year_id) : undefined,
            standard,
            section_id: section_id ? new Types.ObjectId(section_id) : undefined,
            updated_at: new Date(),
          },
        },
        upsert: true,
      },
    }));

    const result = await this.attendanceModel.bulkWrite(bulkOps);

    return {
      success: true,
      message: 'Attendance marked successfully',
      modified: result.modifiedCount,
      created: result.upsertedCount,
    };
  }

  async getAttendanceByDate(
    schoolId: string,
    date: Date,
    userType?: string,
    standard?: number,
    sectionId?: string,
  ): Promise<Attendance[]> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
      deleted_at: null,
    };

    if (userType) query.user_type = userType;
    if (standard) query.standard = standard;
    if (sectionId) query.section_id = new Types.ObjectId(sectionId);

    return this.attendanceModel.find(query).exec();
  }

  async getAttendanceByUser(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Attendance[]> {
    return this.attendanceModel
      .find({
        user_id: new Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
        deleted_at: null,
      })
      .sort({ date: -1 })
      .exec();
  }

  async getAttendanceSummary(
    schoolId: string,
    academicYearId: string,
    userType: string,
    userId?: string,
  ): Promise<any> {
    const matchStage: any = {
      school_id: new Types.ObjectId(schoolId),
      academic_year_id: new Types.ObjectId(academicYearId),
      user_type: userType,
      deleted_at: null,
    };

    if (userId) {
      matchStage.user_id = new Types.ObjectId(userId);
    }

    const summary = await this.attendanceModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      'half-day': 0,
      leave: 0,
    };

    summary.forEach((item) => {
      result[item._id] = item.count;
      result.total += item.count;
    });

    return result;
  }

  async getMonthlyAttendance(
    schoolId: string,
    academicYearId: string,
    month: number,
    year: number,
    standard?: number,
    sectionId?: string,
  ): Promise<Attendance[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      academic_year_id: new Types.ObjectId(academicYearId),
      date: { $gte: startDate, $lte: endDate },
      deleted_at: null,
    };

    if (standard) query.standard = standard;
    if (sectionId) query.section_id = new Types.ObjectId(sectionId);

    return this.attendanceModel.find(query).sort({ date: 1 }).exec();
  }
}
