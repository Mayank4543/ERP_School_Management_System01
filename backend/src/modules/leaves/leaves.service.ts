import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Leave, LeaveDocument } from './schemas/leave.schema';
import { ApplyLeaveDto, ApproveLeaveDto, RejectLeaveDto, UpdateLeaveDto } from './dto/leave.dto';

@Injectable()
export class LeavesService {
  constructor(
    @InjectModel(Leave.name) private leaveModel: Model<LeaveDocument>,
  ) {}

  async applyLeave(applyDto: ApplyLeaveDto): Promise<Leave> {
    const startDate = new Date(applyDto.start_date);
    const endDate = new Date(applyDto.end_date);

    if (endDate < startDate) {
      throw new BadRequestException('End date cannot be before start date');
    }

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const leave = new this.leaveModel({
      ...applyDto,
      school_id: new Types.ObjectId(applyDto.school_id),
      user_id: new Types.ObjectId(applyDto.user_id),
      start_date: startDate,
      end_date: endDate,
      total_days: totalDays,
      status: 'pending',
    });

    return leave.save();
  }

  async findAll(schoolId: string, status?: string, userType?: string): Promise<Leave[]> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      deleted_at: null,
    };

    if (status) query.status = status;
    if (userType) query.user_type = userType;

    return this.leaveModel
      .find(query)
      .populate('user_id', 'first_name last_name admission_no employee_code')
      .populate('approved_by', 'first_name last_name')
      .sort({ created_at: -1 })
      .exec();
  }

  async findById(id: string): Promise<Leave> {
    const leave = await this.leaveModel
      .findOne({ _id: new Types.ObjectId(id), deleted_at: null })
      .populate('user_id', 'first_name last_name admission_no employee_code')
      .populate('approved_by', 'first_name last_name')
      .exec();

    if (!leave) {
      throw new NotFoundException('Leave application not found');
    }

    return leave;
  }

  async findStudentLeaves(studentId: string, status?: string): Promise<any[]> {
    const query: any = {
      user_id: new Types.ObjectId(studentId),
      user_type: 'student',
      deleted_at: null,
    };

    if (status) query.status = status;

    const leaves = await this.leaveModel
      .find(query)
      .populate('approved_by', 'first_name last_name')
      .sort({ created_at: -1 })
      .exec();

    return leaves.map(leave => {
      const leaveObj = leave.toObject();
      const now = new Date();
      const endDate = new Date(leave.end_date);
      
      return {
        ...leaveObj,
        is_past: endDate < now,
        is_ongoing: leave.start_date <= now && endDate >= now,
      };
    });
  }

  async findTeacherLeaves(teacherId: string, status?: string): Promise<Leave[]> {
    const query: any = {
      user_id: new Types.ObjectId(teacherId),
      user_type: 'teacher',
      deleted_at: null,
    };

    if (status) query.status = status;

    return this.leaveModel
      .find(query)
      .populate('approved_by', 'first_name last_name')
      .sort({ created_at: -1 })
      .exec();
  }

  async findPendingLeaves(schoolId: string): Promise<Leave[]> {
    return this.leaveModel
      .find({
        school_id: new Types.ObjectId(schoolId),
        status: 'pending',
        deleted_at: null,
      })
      .populate('user_id', 'first_name last_name admission_no employee_code')
      .sort({ created_at: 1 }) // Oldest first
      .exec();
  }

  async approveLeave(
    leaveId: string,
    approveDto: ApproveLeaveDto,
    approvedBy: string,
  ): Promise<Leave> {
    const leave = await this.leaveModel.findOne({
      _id: new Types.ObjectId(leaveId),
      deleted_at: null,
    });

    if (!leave) {
      throw new NotFoundException('Leave application not found');
    }

    if (leave.status !== 'pending') {
      throw new BadRequestException('Leave application is already processed');
    }

    leave.status = 'approved';
    leave.approved_by = new Types.ObjectId(approvedBy);
    leave.approved_at = new Date();
    if (approveDto.remarks) leave.remarks = approveDto.remarks;

    return leave.save();
  }

  async rejectLeave(
    leaveId: string,
    rejectDto: RejectLeaveDto,
    rejectedBy: string,
  ): Promise<Leave> {
    const leave = await this.leaveModel.findOne({
      _id: new Types.ObjectId(leaveId),
      deleted_at: null,
    });

    if (!leave) {
      throw new NotFoundException('Leave application not found');
    }

    if (leave.status !== 'pending') {
      throw new BadRequestException('Leave application is already processed');
    }

    leave.status = 'rejected';
    leave.approved_by = new Types.ObjectId(rejectedBy);
    leave.approved_at = new Date();
    // Store rejection reason in remarks field
    leave.remarks = rejectDto.rejection_reason + (rejectDto.remarks ? ' - ' + rejectDto.remarks : '');

    return leave.save();
  }

  async updateLeave(id: string, updateDto: UpdateLeaveDto): Promise<Leave> {
    const leave = await this.leaveModel.findOne({
      _id: new Types.ObjectId(id),
      deleted_at: null,
    });

    if (!leave) {
      throw new NotFoundException('Leave application not found');
    }

    if (leave.status !== 'pending') {
      throw new BadRequestException('Cannot update processed leave application');
    }

    if (updateDto.start_date || updateDto.end_date) {
      const startDate = updateDto.start_date ? new Date(updateDto.start_date) : leave.start_date;
      const endDate = updateDto.end_date ? new Date(updateDto.end_date) : leave.end_date;
      
      if (endDate < startDate) {
        throw new BadRequestException('End date cannot be before start date');
      }

      leave.total_days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (updateDto.start_date) leave.start_date = startDate;
      if (updateDto.end_date) leave.end_date = endDate;
    }

    if (updateDto.leave_type) leave.leave_type = updateDto.leave_type;
    if (updateDto.reason) leave.reason = updateDto.reason;

    return leave.save();
  }

  async remove(id: string): Promise<void> {
    const leave = await this.leaveModel.findOne({
      _id: new Types.ObjectId(id),
      deleted_at: null,
    });

    if (!leave) {
      throw new NotFoundException('Leave application not found');
    }

    await this.leaveModel.deleteOne({ _id: new Types.ObjectId(id) });
  }

  async getLeaveStats(schoolId: string, userId?: string, userType?: string): Promise<any> {
    const query: any = { school_id: new Types.ObjectId(schoolId), deleted_at: null };
    
    if (userId) {
      query.user_id = new Types.ObjectId(userId);
      query.user_type = userType;
    }

    const [totalLeaves, pendingLeaves, approvedLeaves, rejectedLeaves] = await Promise.all([
      this.leaveModel.countDocuments(query),
      this.leaveModel.countDocuments({ ...query, status: 'pending' }),
      this.leaveModel.countDocuments({ ...query, status: 'approved' }),
      this.leaveModel.countDocuments({ ...query, status: 'rejected' }),
    ]);

    // Calculate total approved days
    const approvedLeavesData = await this.leaveModel.find({
      ...query,
      status: 'approved',
    });

    const totalApprovedDays = approvedLeavesData.reduce((sum, leave) => sum + leave.total_days, 0);

    return {
      total_leaves: totalLeaves,
      pending_leaves: pendingLeaves,
      approved_leaves: approvedLeaves,
      rejected_leaves: rejectedLeaves,
      total_approved_days: totalApprovedDays,
    };
  }
}
