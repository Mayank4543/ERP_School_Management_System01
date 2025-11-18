import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, MarkAsReadDto, UpdateNotificationDto } from './dto/notification.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Create notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  async create(@Body() createDto: CreateNotificationDto) {
    const notification = await this.notificationsService.create(createDto);
    return {
      success: true,
      message: 'Notification created successfully',
      data: notification,
    };
  }

  @Post('bulk')
  @Roles('admin')
  @ApiOperation({ summary: 'Create bulk notifications' })
  async createBulk(@Body() createDtos: CreateNotificationDto[]) {
    const notifications = await this.notificationsService.createBulk(createDtos);
    return {
      success: true,
      message: `${notifications.length} notifications created successfully`,
      data: notifications,
    };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'notification_type', required: false })
  @ApiQuery({ name: 'read', required: false, type: Boolean })
  async findUserNotifications(
    @Param('userId') userId: string,
    @Query('notification_type') notificationType?: string,
    @Query('read') read?: string,
  ) {
    const readBoolean = read !== undefined ? read === 'true' : undefined;
    const notifications = await this.notificationsService.findUserNotifications(
      userId,
      notificationType,
      readBoolean,
    );
    return {
      success: true,
      data: notifications,
    };
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  async getUnreadCount(@CurrentUser() user: any) {
    const count = await this.notificationsService.getUnreadCount(user._id);
    return {
      success: true,
      data: { unread_count: count },
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get notification statistics' })
  async getStats(@CurrentUser() user: any) {
    const stats = await this.notificationsService.getNotificationStats(user._id);
    return {
      success: true,
      data: stats,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  async findOne(@Param('id') id: string) {
    const notification = await this.notificationsService.findById(id);
    return {
      success: true,
      data: notification,
    };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@Param('id') id: string, @Body() markDto: MarkAsReadDto) {
    const notification = await this.notificationsService.markAsRead(id, markDto);
    return {
      success: true,
      message: 'Notification updated',
      data: notification,
    };
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@CurrentUser() user: any) {
    const result = await this.notificationsService.markAllAsRead(user._id);
    return {
      success: true,
      message: `${result.modified_count} notifications marked as read`,
      data: result,
    };
  }

  @Delete('expired')
  @Roles('admin')
  @ApiOperation({ summary: 'Remove expired notifications' })
  async removeExpired() {
    const result = await this.notificationsService.removeExpired();
    return {
      success: true,
      message: `${result.modified_count} expired notifications removed`,
      data: result,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete notification' })
  async remove(@Param('id') id: string) {
    await this.notificationsService.remove(id);
  }
}
