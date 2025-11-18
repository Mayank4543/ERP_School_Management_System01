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
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Students')
@ApiBearerAuth()
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create new student' })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createStudentDto: CreateStudentDto) {
    const student = await this.studentsService.create(createStudentDto);
    return {
      success: true,
      message: 'Student created successfully',
      data: student,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  @ApiQuery({ name: 'academic_year_id', required: false })
  @ApiQuery({ name: 'standard', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async findAll(
    @CurrentUser() user: any,
    @Query('academic_year_id') academicYearId?: string,
    @Query('standard') standard?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.studentsService.findAll(
      user.schoolId,
      academicYearId,
      standard ? Number(standard) : undefined,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );

    return {
      success: true,
      data: result.data,
      meta: {
        page: result.page,
        limit: limit ? Number(limit) : 20,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  @Get('admission/:admissionNo')
  @ApiOperation({ summary: 'Get student by admission number' })
  async findByAdmissionNo(@Param('admissionNo') admissionNo: string) {
    const student = await this.studentsService.findByAdmissionNo(admissionNo);
    return {
      success: true,
      data: student,
    };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get student by user ID' })
  @ApiResponse({ status: 200, description: 'Student found' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findByUserId(@Param('userId') userId: string) {
    const student = await this.studentsService.findByUserId(userId);
    return {
      success: true,
      data: student,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiResponse({ status: 200, description: 'Student found' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findOne(@Param('id') id: string) {
    const student = await this.studentsService.findById(id);
    return {
      success: true,
      data: student,
    };
  }

  @Patch(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update student' })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    const student = await this.studentsService.update(id, updateStudentDto);
    return {
      success: true,
      message: 'Student updated successfully',
      data: student,
    };
  }

  @Delete(':id')
  @Roles('admin', 'superadmin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete student (soft delete)' })
  @ApiResponse({ status: 204, description: 'Student deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.studentsService.remove(id);
  }

  @Get('class/:standard/:sectionId')
  @ApiOperation({ summary: 'Get students by class and section' })
  async getStudentsByClass(
    @CurrentUser() user: any,
    @Param('standard') standard: number,
    @Param('sectionId') sectionId: string,
    @Query('academic_year_id') academicYearId?: string,
  ) {
    const students = await this.studentsService.getStudentsByClass(
      user.schoolId,
      academicYearId,
      Number(standard),
      sectionId,
    );

    return {
      success: true,
      data: students,
    };
  }
}
