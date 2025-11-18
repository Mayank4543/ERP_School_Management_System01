import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { Notice, NoticeDocument } from './schemas/notice.schema';
import {
  SendMessageDto,
  BroadcastMessageDto,
  CreateAnnouncementDto,
  MarkAsReadDto,
  UpdateAnnouncementDto,
} from './dto/communication.dto';

@Injectable()
export class CommunicationService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Notice.name) private noticeModel: Model<NoticeDocument>,
  ) {}

  // Messages
  async sendMessage(sendDto: SendMessageDto): Promise<Message> {
    if (sendDto.message_type === 'direct' && (!sendDto.recipient_id || !sendDto.recipient_type)) {
      throw new BadRequestException('Direct messages require recipient_id and recipient_type');
    }

    const message = new this.messageModel({
      ...sendDto,
      school_id: new Types.ObjectId(sendDto.school_id),
      sender_id: new Types.ObjectId(sendDto.sender_id),
      recipient_id: sendDto.recipient_id ? new Types.ObjectId(sendDto.recipient_id) : undefined,
      read: false,
    });

    return message.save();
  }

  async broadcastMessage(broadcastDto: BroadcastMessageDto): Promise<Message> {
    const message = new this.messageModel({
      school_id: new Types.ObjectId(broadcastDto.school_id),
      sender_id: new Types.ObjectId(broadcastDto.sender_id),
      sender_type: broadcastDto.sender_type,
      message_type: 'broadcast',
      target_standard: broadcastDto.target_standard,
      target_section_id: new Types.ObjectId(broadcastDto.target_section_id),
      subject: broadcastDto.subject,
      message: broadcastDto.message,
      priority: broadcastDto.priority || 'medium',
      attachments: broadcastDto.attachments || [],
      read: false,
    });

    return message.save();
  }

  async getStudentMessages(studentId: string, read?: boolean): Promise<Message[]> {
    const query: any = {
      recipient_id: new Types.ObjectId(studentId),
      recipient_type: 'student',
      deleted_at: null,
    };

    if (typeof read === 'boolean') {
      query.read = read;
    }

    return this.messageModel
      .find(query)
      .populate('sender_id', 'first_name last_name')
      .sort({ created_at: -1 })
      .exec();
  }

  async getInbox(userId: string, userType: string, read?: boolean): Promise<Message[]> {
    const query: any = {
      recipient_id: new Types.ObjectId(userId),
      recipient_type: userType,
      deleted_at: null,
    };

    if (typeof read === 'boolean') {
      query.read = read;
    }

    return this.messageModel
      .find(query)
      .populate('sender_id', 'first_name last_name')
      .sort({ created_at: -1 })
      .exec();
  }

  async getSentMessages(userId: string): Promise<Message[]> {
    return this.messageModel
      .find({
        sender_id: new Types.ObjectId(userId),
        deleted_at: null,
      })
      .populate('recipient_id', 'first_name last_name')
      .sort({ created_at: -1 })
      .exec();
  }

  async markAsRead(messageId: string, markDto: MarkAsReadDto): Promise<Message> {
    const message = await this.messageModel.findOne({
      _id: new Types.ObjectId(messageId),
      deleted_at: null,
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.read = markDto.read !== undefined ? markDto.read : true;
    if (message.read) {
      message.read_at = new Date();
    }

    return message.save();
  }

  async markAllAsRead(userId: string): Promise<any> {
    const result = await this.messageModel.updateMany(
      {
        recipient_id: new Types.ObjectId(userId),
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

  async deleteMessage(messageId: string): Promise<void> {
    const message = await this.messageModel.findOne({
      _id: new Types.ObjectId(messageId),
      deleted_at: null,
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.deleted_at = new Date();
    await message.save();
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messageModel.countDocuments({
      recipient_id: new Types.ObjectId(userId),
      read: false,
      deleted_at: null,
    });
  }

  // Announcements (Notices)
  async createAnnouncement(createDto: CreateAnnouncementDto): Promise<Notice> {
    const notice = new this.noticeModel({
      ...createDto,
      school_id: new Types.ObjectId(createDto.school_id),
      created_by: new Types.ObjectId(createDto.created_by),
      notice_date: new Date(createDto.notice_date),
      status: createDto.status || 'active',
    });

    return notice.save();
  }

  async getAnnouncements(schoolId: string, status?: string): Promise<Notice[]> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      deleted_at: null,
    };

    if (status) query.status = status;

    return this.noticeModel
      .find(query)
      .populate('created_by', 'first_name last_name')
      .sort({ notice_date: -1 })
      .exec();
  }

  async getAnnouncementById(id: string): Promise<Notice> {
    const notice = await this.noticeModel
      .findOne({ _id: new Types.ObjectId(id), deleted_at: null })
      .populate('created_by', 'first_name last_name')
      .exec();

    if (!notice) {
      throw new NotFoundException('Announcement not found');
    }

    return notice;
  }

  async updateAnnouncement(id: string, updateDto: UpdateAnnouncementDto): Promise<Notice> {
    const notice = await this.noticeModel.findOne({
      _id: new Types.ObjectId(id),
      deleted_at: null,
    });

    if (!notice) {
      throw new NotFoundException('Announcement not found');
    }

    if (updateDto.title) notice.title = updateDto.title;
    if (updateDto.description) notice.description = updateDto.description;
    if (updateDto.notice_date) notice.notice_date = new Date(updateDto.notice_date);
    if (updateDto.target_audience) notice.target_audience = updateDto.target_audience;
    if (updateDto.target_standards) notice.target_standards = updateDto.target_standards;
    if (updateDto.attachments) notice.attachments = updateDto.attachments;
    if (updateDto.status) notice.status = updateDto.status;

    return notice.save();
  }

  async deleteAnnouncement(id: string): Promise<void> {
    const notice = await this.noticeModel.findOne({
      _id: new Types.ObjectId(id),
      deleted_at: null,
    });

    if (!notice) {
      throw new NotFoundException('Announcement not found');
    }

    notice.deleted_at = new Date();
    await notice.save();
  }
}
