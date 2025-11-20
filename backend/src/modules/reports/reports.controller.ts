import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { AttendanceReportDto, FeeReportDto, AcademicReportDto, ExportReportDto } from './dto/report.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('attendance')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Generate attendance report' })
  @ApiResponse({ status: 200, description: 'Attendance report generated successfully' })
  async getAttendanceReport(@Query() dto: AttendanceReportDto) {
    const report = await this.reportsService.generateAttendanceReport(dto);
    return {
      success: true,
      data: report,
    };
  }

  @Get('fees')
  @Roles('admin', 'accountant')
  @ApiOperation({ summary: 'Generate fee collection report' })
  @ApiResponse({ status: 200, description: 'Fee report generated successfully' })
  async getFeeReport(@Query() dto: FeeReportDto) {
    const report = await this.reportsService.generateFeeReport(dto);
    return {
      success: true,
      data: report,
    };
  }

  @Get('academic/:studentId')
  @Roles('admin', 'teacher', 'student', 'parent')
  @ApiOperation({ summary: 'Generate academic progress report' })
  @ApiQuery({ name: 'academic_year_id', required: true })
  @ApiQuery({ name: 'include_details', required: false })
  @ApiResponse({ status: 200, description: 'Academic report generated successfully' })
  async getAcademicReport(
    @Param('studentId') studentId: string,
    @Query('academic_year_id') academicYearId: string,
    @Query('include_details') includeDetails?: boolean,
  ) {
    const dto: AcademicReportDto = {
      student_id: studentId,
      academic_year_id: academicYearId,
      include_details: includeDetails,
    };
    const report = await this.reportsService.generateAcademicReport(dto);
    return {
      success: true,
      data: report,
    };
  }

  @Get('defaulters/:schoolId')
  @Roles('admin', 'accountant')
  @ApiOperation({ summary: 'Get fee defaulters list' })
  @ApiResponse({ status: 200, description: 'Defaulters list retrieved successfully' })
  async getDefaulters(@Param('schoolId') schoolId: string) {
    const defaulters = await this.reportsService.getDefaultersList(schoolId);
    return {
      success: true,
      data: defaulters,
      total: defaulters.length,
    };
  }

  @Post('export')
  @Roles('admin', 'teacher', 'accountant')
  @ApiOperation({ summary: 'Export report to PDF/Excel/CSV' })
  @ApiResponse({ status: 200, description: 'Report exported successfully' })
  async exportReport(@Body() dto: ExportReportDto, @Res() res: Response) {
    // This is a placeholder - will be implemented with actual PDF/Excel generation
    // For now, return JSON
    const data = JSON.parse(dto.data);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=report.${dto.format}`);
    return res.send({
      success: true,
      message: `Report export to ${dto.format} - Coming soon`,
      data,
    });
  }
}
