import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto, SubmitAssignmentDto, GradeAssignmentDto } from './dto/assignment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Assignments')
@ApiBearerAuth()
@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Create assignment' })
  async create(@Body() createDto: CreateAssignmentDto) {
    const assignment = await this.assignmentsService.create(createDto);
    return {
      success: true,
      message: 'Assignment created successfully',
      data: assignment,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments' })
  async findAll(
    @CurrentUser() user: any,
    @Query('academic_year_id') academicYearId?: string,
    @Query('standard') standard?: number,
  ) {
    const assignments = await this.assignmentsService.findAll(
      user.schoolId,
      academicYearId,
      standard ? Number(standard) : undefined,
    );
    return {
      success: true,
      data: assignments,
    };
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get student assignments' })
  async findStudentAssignments(
    @Param('studentId') studentId: string,
    @Query('status') status?: string,
  ) {
    const assignments = await this.assignmentsService.findStudentAssignments(studentId, status);
    return {
      success: true,
      data: assignments,
    };
  }

  @Post(':id/submit')
  @Roles('student')
  @ApiOperation({ summary: 'Submit assignment' })
  async submitAssignment(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() submitDto: SubmitAssignmentDto,
  ) {
    const submission = await this.assignmentsService.submitAssignment(id, user._id, submitDto);
    return {
      success: true,
      message: 'Assignment submitted successfully',
      data: submission,
    };
  }

  @Patch('submissions/:id/grade')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Grade assignment submission' })
  async gradeSubmission(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() gradeDto: GradeAssignmentDto,
  ) {
    const submission = await this.assignmentsService.gradeSubmission(id, user._id, gradeDto);
    return {
      success: true,
      message: 'Assignment graded successfully',
      data: submission,
    };
  }

  @Get(':id/submissions')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Get assignment submissions' })
  async getSubmissions(@Param('id') id: string) {
    const submissions = await this.assignmentsService.getSubmissions(id);
    return {
      success: true,
      data: submissions,
    };
  }
}
