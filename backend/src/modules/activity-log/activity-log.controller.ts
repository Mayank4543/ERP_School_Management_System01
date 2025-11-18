import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ActivityLogService } from './activity-log.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Activity Logs')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('activity-logs')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get('my-activity')
  @ApiOperation({ summary: 'Get current user activity logs' })
  async getMyActivity(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return await this.activityLogService.getUserActivity(user.sub, page, limit);
  }

  @Get('school')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Get school activity logs' })
  async getSchoolActivity(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return await this.activityLogService.getSchoolActivity(user.schoolId, page, limit);
  }

  @Get('module')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Get module activity logs' })
  async getModuleActivity(
    @Query('module') module: string,
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return await this.activityLogService.getModuleActivity(
      module,
      user.schoolId,
      page,
      limit,
    );
  }

  @Get('entity')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Get entity activity logs' })
  async getEntityActivity(
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
  ) {
    return await this.activityLogService.getEntityActivity(entityType, entityId);
  }

  @Get('recent')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Get recent activities' })
  async getRecentActivities(
    @CurrentUser() user: any,
    @Query('limit') limit: number = 20,
  ) {
    return await this.activityLogService.getRecentActivities(user.schoolId, limit);
  }
}
