import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Attendance')
@ApiBearerAuth()
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('mark')
  @Roles('admin', 'teacher', 'superadmin')
  @ApiOperation({ summary: 'Mark attendance for students/staff' })
  async markAttendance(
    @Body() markAttendanceDto: MarkAttendanceDto,
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.markAttendance(markAttendanceDto, user.userId);
  }

  @Get('date/:date')
  @ApiOperation({ summary: 'Get attendance by date' })
  @ApiQuery({ name: 'user_type', required: false })
  @ApiQuery({ name: 'standard', required: false, type: Number })
  @ApiQuery({ name: 'section_id', required: false })
  async getAttendanceByDate(
    @CurrentUser() user: any,
    @Param('date') date: string,
    @Query('user_type') userType?: string,
    @Query('standard') standard?: number,
    @Query('section_id') sectionId?: string,
  ) {
    const attendance = await this.attendanceService.getAttendanceByDate(
      user.schoolId,
      new Date(date),
      userType,
      standard ? Number(standard) : undefined,
      sectionId,
    );

    return {
      success: true,
      data: attendance,
    };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get attendance by user' })
  @ApiQuery({ name: 'start_date', required: true })
  @ApiQuery({ name: 'end_date', required: true })
  async getAttendanceByUser(
    @Param('userId') userId: string,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ) {
    const attendance = await this.attendanceService.getAttendanceByUser(
      userId,
      new Date(startDate),
      new Date(endDate),
    );

    return {
      success: true,
      data: attendance,
    };
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get attendance summary' })
  @ApiQuery({ name: 'academic_year_id', required: true })
  @ApiQuery({ name: 'user_type', required: true })
  @ApiQuery({ name: 'user_id', required: false })
  async getAttendanceSummary(
    @CurrentUser() user: any,
    @Query('academic_year_id') academicYearId: string,
    @Query('user_type') userType: string,
    @Query('user_id') userId?: string,
  ) {
    const summary = await this.attendanceService.getAttendanceSummary(
      user.schoolId,
      academicYearId,
      userType,
      userId,
    );

    return {
      success: true,
      data: summary,
    };
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly attendance' })
  @ApiQuery({ name: 'academic_year_id', required: true })
  @ApiQuery({ name: 'month', required: true, type: Number })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'standard', required: false, type: Number })
  @ApiQuery({ name: 'section_id', required: false })
  async getMonthlyAttendance(
    @CurrentUser() user: any,
    @Query('academic_year_id') academicYearId: string,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('standard') standard?: number,
    @Query('section_id') sectionId?: string,
  ) {
    const attendance = await this.attendanceService.getMonthlyAttendance(
      user.schoolId,
      academicYearId,
      Number(month),
      Number(year),
      standard ? Number(standard) : undefined,
      sectionId,
    );

    return {
      success: true,
      data: attendance,
    };
  }
}
