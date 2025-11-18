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
import { CommunicationService } from './communication.service';
import {
  SendMessageDto,
  BroadcastMessageDto,
  CreateAnnouncementDto,
  MarkAsReadDto,
  UpdateAnnouncementDto,
} from './dto/communication.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Communication')
@ApiBearerAuth()
@Controller('communication')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  // Messages
  @Post('send')
  @Roles('admin', 'teacher', 'student', 'parent')
  @ApiOperation({ summary: 'Send direct message' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  async sendMessage(@Body() sendDto: SendMessageDto) {
    const message = await this.communicationService.sendMessage(sendDto);
    return {
      success: true,
      message: 'Message sent successfully',
      data: message,
    };
  }

  @Post('broadcast')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Broadcast message to class' })
  @ApiResponse({ status: 201, description: 'Broadcast sent successfully' })
  async broadcastMessage(@Body() broadcastDto: BroadcastMessageDto) {
    const message = await this.communicationService.broadcastMessage(broadcastDto);
    return {
      success: true,
      message: 'Broadcast sent successfully',
      data: message,
    };
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get student messages' })
  @ApiQuery({ name: 'read', required: false, type: Boolean })
  async getStudentMessages(
    @Param('studentId') studentId: string,
    @Query('read') read?: string,
  ) {
    const readBoolean = read !== undefined ? read === 'true' : undefined;
    const messages = await this.communicationService.getStudentMessages(
      studentId,
      readBoolean,
    );
    return {
      success: true,
      data: messages,
    };
  }

  @Get('inbox')
  @ApiOperation({ summary: 'Get user inbox' })
  @ApiQuery({ name: 'read', required: false, type: Boolean })
  async getInbox(@CurrentUser() user: any, @Query('read') read?: string) {
    const readBoolean = read !== undefined ? read === 'true' : undefined;
    const messages = await this.communicationService.getInbox(
      user._id,
      user.role,
      readBoolean,
    );
    return {
      success: true,
      data: messages,
    };
  }

  @Get('sent')
  @ApiOperation({ summary: 'Get sent messages' })
  async getSentMessages(@CurrentUser() user: any) {
    const messages = await this.communicationService.getSentMessages(user._id);
    return {
      success: true,
      data: messages,
    };
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread message count' })
  async getUnreadCount(@CurrentUser() user: any) {
    const count = await this.communicationService.getUnreadCount(user._id);
    return {
      success: true,
      data: { unread_count: count },
    };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark message as read' })
  async markAsRead(@Param('id') id: string, @Body() markDto: MarkAsReadDto) {
    const message = await this.communicationService.markAsRead(id, markDto);
    return {
      success: true,
      message: 'Message marked as read',
      data: message,
    };
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all messages as read' })
  async markAllAsRead(@CurrentUser() user: any) {
    const result = await this.communicationService.markAllAsRead(user._id);
    return {
      success: true,
      message: `${result.modified_count} messages marked as read`,
      data: result,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete message' })
  async deleteMessage(@Param('id') id: string) {
    await this.communicationService.deleteMessage(id);
  }

  // Announcements
  @Post('announcements')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Create announcement' })
  async createAnnouncement(@Body() createDto: CreateAnnouncementDto) {
    const announcement = await this.communicationService.createAnnouncement(createDto);
    return {
      success: true,
      message: 'Announcement created successfully',
      data: announcement,
    };
  }

  @Get('announcements')
  @ApiOperation({ summary: 'Get announcements' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'expired', 'draft'] })
  async getAnnouncements(@CurrentUser() user: any, @Query('status') status?: string) {
    const announcements = await this.communicationService.getAnnouncements(user.schoolId, status);
    return {
      success: true,
      data: announcements,
    };
  }

  @Get('announcements/:id')
  @ApiOperation({ summary: 'Get announcement by ID' })
  async getAnnouncement(@Param('id') id: string) {
    const announcement = await this.communicationService.getAnnouncementById(id);
    return {
      success: true,
      data: announcement,
    };
  }

  @Patch('announcements/:id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Update announcement' })
  async updateAnnouncement(@Param('id') id: string, @Body() updateDto: UpdateAnnouncementDto) {
    const announcement = await this.communicationService.updateAnnouncement(id, updateDto);
    return {
      success: true,
      message: 'Announcement updated successfully',
      data: announcement,
    };
  }

  @Delete('announcements/:id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete announcement' })
  async deleteAnnouncement(@Param('id') id: string) {
    await this.communicationService.deleteAnnouncement(id);
  }
}
