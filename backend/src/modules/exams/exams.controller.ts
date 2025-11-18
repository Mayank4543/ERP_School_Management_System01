import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Exams')
@ApiBearerAuth()
@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

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
  async findAll(@CurrentUser() user: any, @Query('academic_year_id') academicYearId?: string) {
    const exams = await this.examsService.findAllExams(user.schoolId, academicYearId);
    return { success: true, data: exams };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam by ID' })
  async findOne(@Param('id') id: string) {
    const exam = await this.examsService.findExamById(id);
    return { success: true, data: exam };
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
  async getExamResults(@Param('id') examId: string) {
    const results = await this.examsService.getExamResults(examId);
    return { success: true, data: results };
  }
}
