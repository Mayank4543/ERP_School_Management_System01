import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from './schemas/activity-log.schema';

export interface LogActivityDto {
  user_id: string | Types.ObjectId;
  school_id?: string | Types.ObjectId;
  action: string;
  module: string;
  entity_type?: string;
  entity_id?: string | Types.ObjectId;
  description?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  request_data?: Record<string, any>;
  response_data?: Record<string, any>;
  status?: string;
  error_message?: string;
}

@Injectable()
export class ActivityLogService {
  private readonly logger = new Logger(ActivityLogService.name);

  constructor(
    @InjectModel(ActivityLog.name)
    private readonly activityLogModel: Model<ActivityLogDocument>,
  ) {}

  async logActivity(data: LogActivityDto): Promise<void> {
    try {
      await this.activityLogModel.create({
        ...data,
        user_id: new Types.ObjectId(data.user_id.toString()),
        school_id: data.school_id ? new Types.ObjectId(data.school_id.toString()) : undefined,
        entity_id: data.entity_id ? new Types.ObjectId(data.entity_id.toString()) : undefined,
      });
    } catch (error) {
      this.logger.error(`Failed to log activity: ${error.message}`);
    }
  }

  // Get user activity logs
  async getUserActivity(
    userId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ data: ActivityLog[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.activityLogModel
        .find({ user_id: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user_id', 'name email')
        .lean(),
      this.activityLogModel.countDocuments({ user_id: new Types.ObjectId(userId) }),
    ]);

    return { data, total };
  }

  // Get school activity logs
  async getSchoolActivity(
    schoolId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ data: ActivityLog[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.activityLogModel
        .find({ school_id: new Types.ObjectId(schoolId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user_id', 'name email')
        .lean(),
      this.activityLogModel.countDocuments({ school_id: new Types.ObjectId(schoolId) }),
    ]);

    return { data, total };
  }

  // Get activity logs by module
  async getModuleActivity(
    module: string,
    schoolId?: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ data: ActivityLog[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: any = { module };

    if (schoolId) {
      query.school_id = new Types.ObjectId(schoolId);
    }

    const [data, total] = await Promise.all([
      this.activityLogModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user_id', 'name email')
        .lean(),
      this.activityLogModel.countDocuments(query),
    ]);

    return { data, total };
  }

  // Get activity logs for specific entity
  async getEntityActivity(
    entityType: string,
    entityId: string,
  ): Promise<ActivityLog[]> {
    return await this.activityLogModel
      .find({
        entity_type: entityType,
        entity_id: new Types.ObjectId(entityId),
      })
      .sort({ createdAt: -1 })
      .populate('user_id', 'name email')
      .lean();
  }

  // Get recent activities
  async getRecentActivities(
    schoolId: string,
    limit: number = 20,
  ): Promise<ActivityLog[]> {
    return await this.activityLogModel
      .find({ school_id: new Types.ObjectId(schoolId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user_id', 'name email')
      .lean();
  }

  // Delete old logs (cleanup)
  async deleteOldLogs(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.activityLogModel.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    this.logger.log(`Deleted ${result.deletedCount} old activity logs`);
    return result.deletedCount;
  }
}
