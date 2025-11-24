import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { CreateAcademicYearDto, UpdateAcademicYearDto } from './dto/academic-year.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('academic-years')
@UseGuards(JwtAuthGuard)
export class AcademicController {
  constructor(private readonly academicService: AcademicService) { }

  @Get()
  async findAll(@CurrentUser() user: any) {
    const academicYears = await this.academicService.findAll(user.schoolId || user.school_id);
    return { success: true, data: academicYears };
  }

  @Get('current')
  async findCurrent(@CurrentUser() user: any) {
    const currentYear = await this.academicService.findCurrent(user.schoolId || user.school_id);
    if (!currentYear) {
      throw new HttpException('No current academic year found for your school. Please contact administrator to set up academic year.', HttpStatus.NOT_FOUND);
    }
    return { success: true, data: currentYear };
  }

  @Post()
  async create(@CurrentUser() user: any, @Body() createAcademicYearDto: CreateAcademicYearDto) {
    const academicYear = await this.academicService.create(user.schoolId || user.school_id, createAcademicYearDto);
    return { success: true, data: academicYear };
  }

  @Put(':id')
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateAcademicYearDto: UpdateAcademicYearDto
  ) {
    const academicYear = await this.academicService.update(user.schoolId || user.school_id, id, updateAcademicYearDto);
    return { success: true, data: academicYear };
  }

  @Delete(':id')
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    await this.academicService.remove(user.schoolId || user.school_id, id);
    return { success: true, message: 'Academic year deleted successfully' };
  }

  @Patch(':id/set-current')
  async setCurrent(@CurrentUser() user: any, @Param('id') id: string) {
    const academicYear = await this.academicService.setCurrent(user.schoolId || user.school_id, id);
    return { success: true, data: academicYear };
  }
}
