import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { CreateNotificationDto, MarkAsReadDto, UpdateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(createDto: CreateNotificationDto): Promise<Notification> {
    const notification = new this.notificationModel({
      ...createDto,
      school_id: new Types.ObjectId(createDto.school_id),
      user_id: new Types.ObjectId(createDto.user_id),
      expires_at: createDto.expires_at ? new Date(createDto.expires_at) : undefined,
      priority: createDto.priority || 'medium',
      read: false,
    });

    return notification.save();
  }

  async createBulk(createDtos: CreateNotificationDto[]): Promise<any[]> {
    const notifications = createDtos.map(dto => ({
      ...dto,
      school_id: new Types.ObjectId(dto.school_id),
      user_id: new Types.ObjectId(dto.user_id),
      expires_at: dto.expires_at ? new Date(dto.expires_at) : undefined,
      priority: dto.priority || 'medium',
      read: false,
    }));

    return this.notificationModel.insertMany(notifications);
  }

  async findUserNotifications(
    userId: string,
    notificationType?: string,
    read?: boolean,
  ): Promise<Notification[]> {
    const now = new Date();
    const query: any = {
      user_id: new Types.ObjectId(userId),
      deleted_at: null,
      $or: [
        { expires_at: { $gt: now } },
        { expires_at: null },
      ],
    };

    if (notificationType) query.notification_type = notificationType;
    if (typeof read === 'boolean') query.read = read;

    return this.notificationModel
      .find(query)
      .sort({ created_at: -1 })
      .exec();
  }

  async findById(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findOne({
      _id: new Types.ObjectId(id),
      deleted_at: null,
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAsRead(notificationId: string, markDto: MarkAsReadDto): Promise<Notification> {
    const notification = await this.notificationModel.findOne({
      _id: new Types.ObjectId(notificationId),
      deleted_at: null,
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.read = markDto.read !== undefined ? markDto.read : true;
    if (notification.read) {
      notification.read_at = new Date();
    } else {
      notification.read_at = undefined;
    }

    return notification.save();
  }

  async markAllAsRead(userId: string): Promise<any> {
    const result = await this.notificationModel.updateMany(
      {
        user_id: new Types.ObjectId(userId),
        read: false,
        deleted_at: null,
      },
      {
        $set: { read: true, read_at: new Date() },
      },
    );

    return {
      matched_count: result.matchedCount,
      modified_count: result.modifiedCount,
    };
  }

  async getUnreadCount(userId: string): Promise<number> {
    const now = new Date();
    return this.notificationModel.countDocuments({
      user_id: new Types.ObjectId(userId),
      read: false,
      deleted_at: null,
      $or: [
        { expires_at: { $gt: now } },
        { expires_at: null },
      ],
    });
  }

  async remove(id: string): Promise<void> {
    const notification = await this.notificationModel.findOne({
      _id: new Types.ObjectId(id),
      deleted_at: null,
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.deleted_at = new Date();
    await notification.save();
  }

  async removeExpired(): Promise<any> {
    const now = new Date();
    const result = await this.notificationModel.updateMany(
      {
        expires_at: { $lt: now },
        deleted_at: null,
      },
      {
        $set: { deleted_at: now },
      },
    );

    return {
      matched_count: result.matchedCount,
      modified_count: result.modifiedCount,
    };
  }

  async getNotificationStats(userId: string): Promise<any> {
    const now = new Date();
    const query = {
      user_id: new Types.ObjectId(userId),
      deleted_at: null,
      $or: [
        { expires_at: { $gt: now } },
        { expires_at: null },
      ],
    };

    const [totalNotifications, unreadNotifications, highPriorityUnread] = await Promise.all([
      this.notificationModel.countDocuments(query),
      this.notificationModel.countDocuments({ ...query, read: false }),
      this.notificationModel.countDocuments({ ...query, read: false, priority: 'high' }),
    ]);

    // Count by type
    const notificationsByType = await this.notificationModel.aggregate([
      { $match: query },
      { $group: { _id: '$notification_type', count: { $sum: 1 } } },
    ]);

    return {
      total_notifications: totalNotifications,
      unread_notifications: unreadNotifications,
      high_priority_unread: highPriorityUnread,
      by_type: notificationsByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };
  }
}
