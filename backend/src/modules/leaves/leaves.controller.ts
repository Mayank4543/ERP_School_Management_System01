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
import { LeavesService } from './leaves.service';
import { ApplyLeaveDto, ApproveLeaveDto, RejectLeaveDto, UpdateLeaveDto } from './dto/leave.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Leaves')
@ApiBearerAuth()
@Controller('leaves')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post('apply')
  @Roles('student', 'teacher', 'admin')
  @ApiOperation({ summary: 'Apply for leave' })
  @ApiResponse({ status: 201, description: 'Leave application submitted successfully' })
  async applyLeave(@Body() applyDto: ApplyLeaveDto) {
    const leave = await this.leavesService.applyLeave(applyDto);
    return {
      success: true,
      message: 'Leave application submitted successfully',
      data: leave,
    };
  }

  @Get()
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Get all leaves' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'approved', 'rejected'] })
  @ApiQuery({ name: 'user_type', required: false, enum: ['student', 'teacher'] })
  async findAll(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('user_type') userType?: string,
  ) {
    const leaves = await this.leavesService.findAll(user.schoolId, status, userType);
    return {
      success: true,
      data: leaves,
    };
  }

  @Get('pending')
  @Roles('admin')
  @ApiOperation({ summary: 'Get pending leave applications' })
  async findPendingLeaves(@CurrentUser() user: any) {
    const leaves = await this.leavesService.findPendingLeaves(user.schoolId);
    return {
      success: true,
      data: leaves,
    };
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get student leaves' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'approved', 'rejected'] })
  async findStudentLeaves(
    @Param('studentId') studentId: string,
    @Query('status') status?: string,
  ) {
    const leaves = await this.leavesService.findStudentLeaves(studentId, status);
    return {
      success: true,
      data: leaves,
    };
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Get teacher leaves' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'approved', 'rejected'] })
  async findTeacherLeaves(
    @Param('teacherId') teacherId: string,
    @Query('status') status?: string,
  ) {
    const leaves = await this.leavesService.findTeacherLeaves(teacherId, status);
    return {
      success: true,
      data: leaves,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get leave statistics' })
  @ApiQuery({ name: 'user_id', required: false })
  @ApiQuery({ name: 'user_type', required: false, enum: ['student', 'teacher'] })
  async getLeaveStats(
    @CurrentUser() user: any,
    @Query('user_id') userId?: string,
    @Query('user_type') userType?: string,
  ) {
    const stats = await this.leavesService.getLeaveStats(user.schoolId, userId, userType);
    return {
      success: true,
      data: stats,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get leave by ID' })
  @ApiResponse({ status: 200, description: 'Leave found' })
  @ApiResponse({ status: 404, description: 'Leave not found' })
  async findOne(@Param('id') id: string) {
    const leave = await this.leavesService.findById(id);
    return {
      success: true,
      data: leave,
    };
  }

  @Patch(':id/approve')
  @Roles('admin')
  @ApiOperation({ summary: 'Approve leave application' })
  async approveLeave(
    @Param('id') id: string,
    @Body() approveDto: ApproveLeaveDto,
    @CurrentUser() user: any,
  ) {
    const leave = await this.leavesService.approveLeave(id, approveDto, user._id);
    return {
      success: true,
      message: 'Leave approved successfully',
      data: leave,
    };
  }

  @Patch(':id/reject')
  @Roles('admin')
  @ApiOperation({ summary: 'Reject leave application' })
  async rejectLeave(
    @Param('id') id: string,
    @Body() rejectDto: RejectLeaveDto,
    @CurrentUser() user: any,
  ) {
    const leave = await this.leavesService.rejectLeave(id, rejectDto, user._id);
    return {
      success: true,
      message: 'Leave rejected',
      data: leave,
    };
  }

  @Patch(':id')
  @Roles('student', 'teacher', 'admin')
  @ApiOperation({ summary: 'Update leave application (only if pending)' })
  async updateLeave(@Param('id') id: string, @Body() updateDto: UpdateLeaveDto) {
    const leave = await this.leavesService.updateLeave(id, updateDto);
    return {
      success: true,
      message: 'Leave updated successfully',
      data: leave,
    };
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete leave application' })
  async remove(@Param('id') id: string) {
    await this.leavesService.remove(id);
  }
}
