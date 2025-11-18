import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('schools')
@UseGuards(JwtAuthGuard)
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  async findAll() {
    const schools = await this.schoolsService.findAll();
    return { success: true, data: schools };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const school = await this.schoolsService.findById(id);
    return { success: true, data: school };
  }
}
