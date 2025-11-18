import { Controller, Get, UseGuards } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('academic-years')
@UseGuards(JwtAuthGuard)
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    const academicYears = await this.academicService.findAll(user.schoolId);
    return { success: true, data: academicYears };
  }

  @Get('current')
  async findCurrent(@CurrentUser() user: any) {
    const currentYear = await this.academicService.findCurrent(user.schoolId);
    return { success: true, data: currentYear };
  }
}
