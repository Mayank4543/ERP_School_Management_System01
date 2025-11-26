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
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Sections')
@ApiBearerAuth()
@Controller('sections')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) { }

  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create a new section' })
  @ApiResponse({ status: 201, description: 'Section created successfully' })
  async create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionsService.create(createSectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sections with pagination and filters' })
  @ApiQuery({ name: 'academicYearId', required: false })
  @ApiQuery({ name: 'standard', required: false, type: 'number' })
  @ApiQuery({ name: 'isActive', required: false, type: 'boolean' })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  async findAll(
    @CurrentUser() user: any,
    @Query('academicYearId') academicYearId?: string,
    @Query('standard') standard?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.sectionsService.findAll(
      user.schoolId || user.school_id,
      academicYearId,
      standard ? parseInt(standard) : undefined,
      isActive ? isActive === 'true' : undefined,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('standards')
  @ApiOperation({ summary: 'Get unique standards/classes for the school' })
  @ApiQuery({ name: 'academicYearId', required: false })
  async getUniqueStandards(
    @CurrentUser() user: any,
    @Query('academicYearId') academicYearId?: string,
  ) {
    return this.sectionsService.getUniqueStandards(
      user.schoolId || user.school_id,
      academicYearId,
    );
  }

  @Get('standard/:standard')
  @ApiOperation({ summary: 'Get sections by standard/class' })
  @ApiQuery({ name: 'academicYearId', required: false })
  async findByStandard(
    @CurrentUser() user: any,
    @Param('standard') standard: string,
    @Query('academicYearId') academicYearId?: string,
  ) {
    return this.sectionsService.findByStandard(
      user.schoolId || user.school_id,
      parseInt(standard),
      academicYearId,
    );
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Get sections assigned to a teacher as class teacher' })
  @ApiQuery({ name: 'academicYearId', required: false })
  async getSectionsByTeacher(
    @Param('teacherId') teacherId: string,
    @Query('academicYearId') academicYearId?: string,
  ) {
    return this.sectionsService.getSectionsByTeacher(teacherId, academicYearId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get section by ID' })
  async findOne(@Param('id') id: string) {
    return this.sectionsService.findById(id);
  }

  @Patch(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update section' })
  async update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionsService.update(id, updateSectionDto);
  }

  @Patch(':id/update-student-count')
  @Roles('admin', 'superadmin', 'teacher')
  @ApiOperation({ summary: 'Update student count for section' })
  async updateStudentCount(@Param('id') id: string) {
    return this.sectionsService.updateStudentCount(id);
  }

  @Delete(':id')
  @Roles('admin', 'superadmin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete section (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.sectionsService.remove(id);
  }
}