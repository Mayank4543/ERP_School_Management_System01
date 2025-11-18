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
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto, MarkCompleteDto, UpdateHomeworkDto } from './dto/homework.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Homework')
@ApiBearerAuth()
@Controller('homework')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post()
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Create homework' })
  @ApiResponse({ status: 201, description: 'Homework created successfully' })
  async create(@Body() createDto: CreateHomeworkDto) {
    const homework = await this.homeworkService.create(createDto);
    return {
      success: true,
      message: 'Homework created successfully',
      data: homework,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all homework' })
  @ApiQuery({ name: 'academic_year_id', required: false })
  @ApiQuery({ name: 'standard', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  async findAll(
    @CurrentUser() user: any,
    @Query('academic_year_id') academicYearId?: string,
    @Query('standard') standard?: number,
    @Query('status') status?: string,
  ) {
    const homework = await this.homeworkService.findAll(
      user.schoolId,
      academicYearId,
      standard ? Number(standard) : undefined,
      status,
    );

    return {
      success: true,
      data: homework,
    };
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get student homework' })
  @ApiResponse({ status: 200, description: 'Student homework retrieved' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'completed', 'overdue'] })
  async findStudentHomework(
    @Param('studentId') studentId: string,
    @Query('status') status?: string,
  ) {
    const homework = await this.homeworkService.findStudentHomework(studentId, status);
    return {
      success: true,
      data: homework,
    };
  }

  @Get('today/:standard/:sectionId')
  @ApiOperation({ summary: "Get today's homework for a class" })
  async getTodayHomework(
    @CurrentUser() user: any,
    @Param('standard') standard: number,
    @Param('sectionId') sectionId: string,
    @Query('academic_year_id') academicYearId?: string,
  ) {
    const homework = await this.homeworkService.getTodayHomework(
      user.schoolId,
      academicYearId,
      Number(standard),
      sectionId,
    );

    return {
      success: true,
      data: homework,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get homework by ID' })
  @ApiResponse({ status: 200, description: 'Homework found' })
  @ApiResponse({ status: 404, description: 'Homework not found' })
  async findOne(@Param('id') id: string) {
    const homework = await this.homeworkService.findById(id);
    return {
      success: true,
      data: homework,
    };
  }

  @Get(':id/stats')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Get homework submission statistics' })
  async getStats(@Param('id') id: string) {
    const stats = await this.homeworkService.getSubmissionStats(id);
    return {
      success: true,
      data: stats,
    };
  }

  @Post(':id/submit')
  @Roles('student')
  @ApiOperation({ summary: 'Mark homework as complete/incomplete' })
  @ApiResponse({ status: 200, description: 'Homework status updated' })
  async markComplete(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() markCompleteDto: MarkCompleteDto,
  ) {
    const submission = await this.homeworkService.markComplete(id, user._id, markCompleteDto);
    return {
      success: true,
      message: markCompleteDto.completed 
        ? 'Homework marked as complete' 
        : 'Homework marked as incomplete',
      data: submission,
    };
  }

  @Patch(':id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Update homework' })
  @ApiResponse({ status: 200, description: 'Homework updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateHomeworkDto,
  ) {
    const homework = await this.homeworkService.update(id, updateDto);
    return {
      success: true,
      message: 'Homework updated successfully',
      data: homework,
    };
  }

  @Delete(':id')
  @Roles('admin', 'teacher')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete homework (soft delete)' })
  @ApiResponse({ status: 204, description: 'Homework deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.homeworkService.remove(id);
  }
}
