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
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Timetable')
@ApiBearerAuth()
@Controller('timetable')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create timetable for a class' })
  @ApiResponse({ status: 201, description: 'Timetable created successfully' })
  async create(@Body() createTimetableDto: CreateTimetableDto) {
    const timetable = await this.timetableService.create(createTimetableDto);
    return {
      success: true,
      message: 'Timetable created successfully',
      data: timetable,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all timetables' })
  @ApiQuery({ name: 'academic_year_id', required: false })
  @ApiQuery({ name: 'standard', required: false, type: Number })
  @ApiQuery({ name: 'section_id', required: false })
  @ApiQuery({ name: 'day', required: false })
  async findAll(
    @CurrentUser() user: any,
    @Query('academic_year_id') academicYearId?: string,
    @Query('standard') standard?: number,
    @Query('section_id') sectionId?: string,
    @Query('day') day?: string,
  ) {
    const timetables = await this.timetableService.findAll(
      user.schoolId,
      academicYearId,
      standard ? Number(standard) : undefined,
      sectionId,
      day,
    );

    return {
      success: true,
      data: timetables,
    };
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get student timetable' })
  @ApiResponse({ status: 200, description: 'Student timetable retrieved' })
  async findStudentTimetable(@Param('studentId') studentId: string) {
    const timetable = await this.timetableService.findStudentTimetable(studentId);
    return {
      success: true,
      data: timetable,
    };
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Get teacher timetable' })
  @ApiResponse({ status: 200, description: 'Teacher timetable retrieved' })
  async findTeacherTimetable(
    @CurrentUser() user: any,
    @Param('teacherId') teacherId: string,
    @Query('academic_year_id') academicYearId?: string,
  ) {
    const timetable = await this.timetableService.findTeacherTimetable(
      user.schoolId,
      academicYearId,
      teacherId,
    );
    return {
      success: true,
      data: timetable,
    };
  }

  @Get('class/:standard/:sectionId')
  @ApiOperation({ summary: 'Get class timetable' })
  async findClassTimetable(
    @CurrentUser() user: any,
    @Param('standard') standard: number,
    @Param('sectionId') sectionId: string,
    @Query('academic_year_id') academicYearId?: string,
  ) {
    const timetables = await this.timetableService.findByClass(
      user.schoolId,
      academicYearId,
      Number(standard),
      sectionId,
    );

    return {
      success: true,
      data: timetables,
    };
  }

  @Get('today/:standard/:sectionId')
  @ApiOperation({ summary: "Get today's timetable for a class" })
  async getTodayTimetable(
    @CurrentUser() user: any,
    @Param('standard') standard: number,
    @Param('sectionId') sectionId: string,
    @Query('academic_year_id') academicYearId?: string,
  ) {
    const timetable = await this.timetableService.getTodayTimetable(
      user.schoolId,
      academicYearId,
      Number(standard),
      sectionId,
    );

    return {
      success: true,
      data: timetable,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get timetable by ID' })
  @ApiResponse({ status: 200, description: 'Timetable found' })
  @ApiResponse({ status: 404, description: 'Timetable not found' })
  async findOne(@Param('id') id: string) {
    const timetable = await this.timetableService.findById(id);
    return {
      success: true,
      data: timetable,
    };
  }

  @Patch(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update timetable' })
  @ApiResponse({ status: 200, description: 'Timetable updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateTimetableDto: UpdateTimetableDto,
  ) {
    const timetable = await this.timetableService.update(id, updateTimetableDto);
    return {
      success: true,
      message: 'Timetable updated successfully',
      data: timetable,
    };
  }

  @Delete(':id')
  @Roles('admin', 'superadmin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete timetable (soft delete)' })
  @ApiResponse({ status: 204, description: 'Timetable deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.timetableService.remove(id);
  }
}
