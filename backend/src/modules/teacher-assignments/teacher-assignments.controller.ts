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
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery
} from '@nestjs/swagger';
import { TeacherAssignmentsService } from './teacher-assignments.service';
import { CreateTeacherAssignmentDto } from './dto/create-teacher-assignment.dto';
import { UpdateTeacherAssignmentDto } from './dto/update-teacher-assignment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Teacher Assignments')
@ApiBearerAuth()
@Controller('teacher-assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeacherAssignmentsController {
  constructor(private readonly assignmentsService: TeacherAssignmentsService) {}

  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create a new teacher assignment' })
  @ApiResponse({ status: 201, description: 'Teacher assignment created successfully' })
  async create(@Body() createAssignmentDto: CreateTeacherAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teacher assignments with pagination and filters' })
  @ApiQuery({ name: 'academicYearId', required: false })
  @ApiQuery({ name: 'teacherId', required: false })
  @ApiQuery({ name: 'subjectId', required: false })
  @ApiQuery({ name: 'standard', required: false, type: 'number' })
  @ApiQuery({ name: 'sectionId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'completed'] })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  async findAll(
    @CurrentUser() user: any,
    @Query('academicYearId') academicYearId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('subjectId') subjectId?: string,
    @Query('standard') standard?: string,
    @Query('sectionId') sectionId?: string,
    @Query('status') status: string = 'active',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.assignmentsService.findAll(
      user.school_id,
      academicYearId,
      teacherId,
      subjectId,
      standard ? parseInt(standard) : undefined,
      sectionId,
      status,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('teacher/:teacherId/workload')
  @ApiOperation({ summary: 'Get teacher workload summary' })
  @ApiQuery({ name: 'academicYearId', required: true })
  async getTeacherWorkload(
    @Param('teacherId') teacherId: string,
    @Query('academicYearId') academicYearId: string,
  ) {
    return this.assignmentsService.getTeacherWorkload(teacherId, academicYearId);
  }

  @Get('class-teacher/:standard/:sectionId')
  @ApiOperation({ summary: 'Get class teacher for a specific class-section' })
  @ApiQuery({ name: 'academicYearId', required: true })
  async getClassTeacher(
    @CurrentUser() user: any,
    @Param('standard') standard: string,
    @Param('sectionId') sectionId: string,
    @Query('academicYearId') academicYearId: string,
  ) {
    return this.assignmentsService.getClassTeacher(
      user.school_id,
      academicYearId,
      parseInt(standard),
      sectionId,
    );
  }

  @Get('subject/:subjectId/teachers')
  @ApiOperation({ summary: 'Get all teachers assigned to a subject' })
  @ApiQuery({ name: 'academicYearId', required: true })
  @ApiQuery({ name: 'standard', required: false, type: 'number' })
  async getSubjectTeachers(
    @CurrentUser() user: any,
    @Param('subjectId') subjectId: string,
    @Query('academicYearId') academicYearId: string,
    @Query('standard') standard?: string,
  ) {
    return this.assignmentsService.getSubjectTeachers(
      user.school_id,
      academicYearId,
      subjectId,
      standard ? parseInt(standard) : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get teacher assignment by ID' })
  async findOne(@Param('id') id: string) {
    return this.assignmentsService.findById(id);
  }

  @Patch(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update teacher assignment' })
  async update(@Param('id') id: string, @Body() updateAssignmentDto: UpdateTeacherAssignmentDto) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  @Roles('admin', 'superadmin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete teacher assignment (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }
}