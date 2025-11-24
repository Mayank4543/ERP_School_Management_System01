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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Teachers')
@ApiBearerAuth()
@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) { }

  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create new teacher' })
  async create(@Body() createTeacherDto: CreateTeacherDto) {
    const teacher = await this.teachersService.create(createTeacherDto);
    return {
      success: true,
      message: 'Teacher created successfully',
      data: teacher,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all teachers' })
  @ApiQuery({ name: 'school_id', required: false })
  @ApiQuery({ name: 'department', required: false })
  @ApiQuery({ name: 'designation', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @CurrentUser() user: any,
    @Query('school_id') schoolId?: string,
    @Query('department') department?: string,
    @Query('designation') designation?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    // Use provided school_id or fallback to user's school
    const targetSchoolId = schoolId || user.school_id || user.schoolId;

    console.log('Teachers Controller - findAll:', {
      targetSchoolId,
      userSchoolId: user.school_id,
      userSchoolIdAlt: user.schoolId,
      providedSchoolId: schoolId,
      department,
      designation,
      status,
      search,
      page,
      limit
    });

    const result = await this.teachersService.findAll(
      targetSchoolId,
      department,
      designation,
      status,
      search,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );

    return {
      success: true,
      data: result.data,
      page: result.page,
      total: result.total,
      totalPages: result.totalPages,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get teacher by ID' })
  async findOne(@Param('id') id: string) {
    const teacher = await this.teachersService.findById(id);
    return {
      success: true,
      data: teacher,
    };
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get teacher by employee ID' })
  async findByEmployeeId(@Param('employeeId') employeeId: string) {
    const teacher = await this.teachersService.findByEmployeeId(employeeId);
    return {
      success: true,
      data: teacher,
    };
  }

  @Patch(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update teacher' })
  async update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.teachersService.update(id, updateTeacherDto);
    return {
      success: true,
      message: 'Teacher updated successfully',
      data: teacher,
    };
  }

  @Delete(':id')
  @Roles('admin', 'superadmin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete teacher' })
  async remove(@Param('id') id: string) {
    await this.teachersService.remove(id);
  }

  @Get('debug/:schoolId')
  @ApiOperation({ summary: 'Debug endpoint to check teachers data' })
  async debugTeachers(@Param('schoolId') schoolId: string) {
    // Simple query to check if teachers exist
    const teachersCount = await this.teachersService['teacherModel'].countDocuments({
      school_id: new (require('mongoose')).Types.ObjectId(schoolId)
    }).exec();

    const allTeachers = await this.teachersService['teacherModel'].find({
      school_id: new (require('mongoose')).Types.ObjectId(schoolId)
    }).limit(5).exec();

    return {
      success: true,
      data: {
        totalTeachers: teachersCount,
        sampleTeachers: allTeachers,
        schoolId: schoolId
      }
    };
  }

  @Get('subject/:subject')
  @ApiOperation({ summary: 'Get teachers by subject' })
  async getTeachersBySubject(
    @CurrentUser() user: any,
    @Param('subject') subject: string,
  ) {
    const teachers = await this.teachersService.getTeachersBySubject(user.schoolId, subject);
    return {
      success: true,
      data: teachers,
    };
  }
}
