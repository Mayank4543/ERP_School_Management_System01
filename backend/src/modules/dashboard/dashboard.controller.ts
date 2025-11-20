import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { TeacherDashboardQueryDto, AdminDashboardQueryDto } from './dto/dashboard.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('teacher/:teacherId')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Get teacher dashboard data' })
  @ApiQuery({ name: 'date', required: false, description: 'Date for schedule (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Teacher dashboard data retrieved successfully' })
  async getTeacherDashboard(
    @Param('teacherId') teacherId: string,
    @Query() query: TeacherDashboardQueryDto,
  ) {
    const data = await this.dashboardService.getTeacherDashboard(teacherId, query.date);
    return {
      success: true,
      data,
    };
  }

  @Get('admin/:schoolId')
  @Roles('admin')
  @ApiOperation({ summary: 'Get admin dashboard data' })
  @ApiQuery({ name: 'start_date', required: false, description: 'Start date for reports' })
  @ApiQuery({ name: 'end_date', required: false, description: 'End date for reports' })
  @ApiResponse({ status: 200, description: 'Admin dashboard data retrieved successfully' })
  async getAdminDashboard(
    @Param('schoolId') schoolId: string,
    @Query() query: AdminDashboardQueryDto,
  ) {
    const data = await this.dashboardService.getAdminDashboard(
      schoolId,
      query.start_date,
      query.end_date,
    );
    return {
      success: true,
      data,
    };
  }

  @Get('parent/:parentId/students')
  @Roles('parent', 'admin')
  @ApiOperation({ summary: 'Get all children of a parent' })
  @ApiResponse({ status: 200, description: 'Parent students retrieved successfully' })
  async getParentStudents(@Param('parentId') parentId: string) {
    const students = await this.dashboardService.getParentStudents(parentId);
    return {
      success: true,
      data: students,
    };
  }

  @Get('parent/:parentId/child/:studentId')
  @Roles('parent', 'admin')
  @ApiOperation({ summary: 'Get detailed dashboard for one child' })
  @ApiResponse({ status: 200, description: 'Child dashboard data retrieved successfully' })
  async getChildDashboard(
    @Param('parentId') parentId: string,
    @Param('studentId') studentId: string,
  ) {
    const data = await this.dashboardService.getChildDashboard(studentId, parentId);
    return {
      success: true,
      data,
    };
  }
}
