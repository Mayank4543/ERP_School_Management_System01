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
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Subjects')
@ApiBearerAuth()
@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create a new subject' })
  @ApiResponse({ status: 201, description: 'Subject created successfully' })
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subjects with pagination and filters' })
  @ApiQuery({ name: 'academicYearId', required: false })
  @ApiQuery({ name: 'standard', required: false, type: 'number' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'archived'] })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  async findAll(
    @CurrentUser() user: any,
    @Query('academicYearId') academicYearId?: string,
    @Query('standard') standard?: string,
    @Query('type') type?: string,
    @Query('status') status: string = 'active',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.subjectsService.findAll(
      user.school_id,
      academicYearId,
      standard ? parseInt(standard) : undefined,
      type,
      status,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('standard/:standard')
  @ApiOperation({ summary: 'Get subjects by standard/class' })
  @ApiQuery({ name: 'academicYearId', required: false })
  async findByStandard(
    @CurrentUser() user: any,
    @Param('standard') standard: string,
    @Query('academicYearId') academicYearId?: string,
  ) {
    return this.subjectsService.findByStandard(
      user.school_id,
      parseInt(standard),
      academicYearId,
    );
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get subjects by type' })
  @ApiQuery({ name: 'academicYearId', required: false })
  async findByType(
    @CurrentUser() user: any,
    @Param('type') type: string,
    @Query('academicYearId') academicYearId?: string,
  ) {
    return this.subjectsService.getSubjectsByType(
      user.school_id,
      type,
      academicYearId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subject by ID' })
  async findOne(@Param('id') id: string) {
    return this.subjectsService.findById(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get subject by code' })
  async findByCode(@Param('code') code: string) {
    return this.subjectsService.findByCode(code);
  }

  @Patch(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update subject' })
  async update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @Roles('admin', 'superadmin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete subject (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.subjectsService.remove(id);
  }
}