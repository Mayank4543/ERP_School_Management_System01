import { Controller, Get, Post, Body, Param, Query, UseGuards, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Exams')
@ApiBearerAuth()
@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) { }

  @Post()
  @ApiOperation({ summary: 'Create new exam' })
  async createExam(@Body() createExamDto: any, @CurrentUser() user: any) {
    const exam = await this.examsService.createExam({
      ...createExamDto,
      school_id: user.schoolId,
    });
    return { success: true, data: exam };
  }

  @Get()
  @ApiOperation({ summary: 'Get all exams' })
  async findAll(
    @CurrentUser() user: any,
    @Query('academic_year_id') academicYearId?: string,
    @Query('school_id') schoolId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1') || 1;
    const limitNum = parseInt(limit || '20') || 20;
    const targetSchoolId = schoolId || user.schoolId;

    const { exams, total } = await this.examsService.findAllExams(
      targetSchoolId,
      academicYearId,
      pageNum,
      limitNum
    );
    return {
      success: true,
      data: exams,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam by ID' })
  async findOne(@Param('id') id: string) {
    const exam = await this.examsService.findExamById(id);
    return { success: true, data: exam };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update exam' })
  async updateExam(@Param('id') id: string, @Body() updateExamDto: any, @CurrentUser() user: any) {
    const exam = await this.examsService.updateExam(id, updateExamDto);
    return { success: true, data: exam };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete exam' })
  async deleteExam(@Param('id') id: string, @CurrentUser() user: any) {
    await this.examsService.deleteExam(id);
    return { success: true, message: 'Exam deleted successfully' };
  }

  @Post('marks')
  @ApiOperation({ summary: 'Enter student marks' })
  async enterMarks(@Body() markDto: any, @CurrentUser() user: any) {
    const mark = await this.examsService.enterMarks({
      ...markDto,
      school_id: user.schoolId,
      entered_by: user.userId,
    });
    return { success: true, message: 'Marks entered successfully', data: mark };
  }

  @Get('student/:studentId/exam/:examId')
  @ApiOperation({ summary: 'Get student marks for specific exam' })
  async getStudentMarks(@Param('studentId') studentId: string, @Param('examId') examId: string) {
    const marks = await this.examsService.getStudentMarks(studentId, examId);
    return { success: true, data: marks };
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Get exam results' })
  async getExamResults(
    @Param('id') examId: string,
    @Query('standard') standard?: string,
    @Query('section') section?: string
  ) {
    const results = await this.examsService.getExamResults(examId, standard, section);
    return { success: true, data: results };
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish exam results' })
  async publishResults(@Param('id') examId: string, @CurrentUser() user: any) {
    await this.examsService.publishResults(examId);
    return { success: true, message: 'Results published successfully' };
  }

  @Get(':id/export')
  @ApiOperation({ summary: 'Export exam results' })
  async exportResults(@Param('id') examId: string) {
    const exportData = await this.examsService.exportResults(examId);
    return { success: true, data: exportData };
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Get exam schedule' })
  async getExamSchedule(@Param('id') examId: string, @Query('standard') standard?: string) {
    const schedule = await this.examsService.getExamSchedule(examId, standard);
    return { success: true, data: schedule };
  }
}
