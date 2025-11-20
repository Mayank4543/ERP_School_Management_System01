import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { SuperAdminService } from './super-admin.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('test')
  async test() {
    return {
      success: true,
      message: 'SuperAdmin API is working',
      timestamp: new Date()
    };
  }

  @Get('dashboard/stats')
  async getDashboardStats(@GetUser() user: any) {
    return this.superAdminService.getDashboardStats();
  }

  @Get('system/health')
  async getSystemHealth(@GetUser() user: any) {
    return this.superAdminService.getSystemHealth();
  }

  @Get('recent-activities')
  async getRecentActivities(@GetUser() user: any, @Query('limit') limit?: number) {
    return this.superAdminService.getRecentActivities(limit || 10);
  }

  @Get('pending-approvals')
  async getPendingApprovals(@GetUser() user: any) {
    return this.superAdminService.getPendingApprovals();
  }

  @Get('schools')
  async getAllSchools(@GetUser() user: any, @Query() query: any) {
    return this.superAdminService.getAllSchools(query);
  }

  @Get('schools/pending')
  async getPendingSchools(@GetUser() user: any, @Query() query: any) {
    return this.superAdminService.getPendingSchools(query);
  }

  @Post('schools/:schoolId/approve')
  async approveSchool(@GetUser() user: any, @Param('schoolId') schoolId: string) {
    return this.superAdminService.approveSchool(schoolId);
  }

  @Post('schools/:schoolId/reject')
  async rejectSchool(@GetUser() user: any, @Param('schoolId') schoolId: string) {
    return this.superAdminService.rejectSchool(schoolId);
  }

  // ==================== USERS MANAGEMENT ====================
  
  @Get('users')
  async getAllUsers(@GetUser() user: any, @Query() query: any) {
    return this.superAdminService.getAllUsers(query);
  }

  @Post('users')
  async createUser(@GetUser() user: any, @Body() userData: any) {
    return this.superAdminService.createUser(userData);
  }

  @Get('users/:userId')
  async getUser(@GetUser() user: any, @Param('userId') userId: string) {
    return this.superAdminService.getUser(userId);
  }

  @Patch('users/:userId')
  async updateUser(
    @GetUser() user: any,
    @Param('userId') userId: string,
    @Body() userData: any
  ) {
    return this.superAdminService.updateUser(userId, userData);
  }

  @Delete('users/:userId')
  async deleteUser(@GetUser() user: any, @Param('userId') userId: string) {
    return this.superAdminService.deleteUser(userId);
  }

  @Patch('users/:userId/status')
  async updateUserStatus(
    @GetUser() user: any,
    @Param('userId') userId: string,
    @Body() statusData: { status: string; reason?: string }
  ) {
    return this.superAdminService.updateUserStatus(userId, statusData);
  }

  @Post('users/:userId/reset-password')
  async resetUserPassword(
    @GetUser() user: any,
    @Param('userId') userId: string,
    @Body() passwordData: { password: string }
  ) {
    return this.superAdminService.resetUserPassword(userId, passwordData.password);
  }

  // ==================== ADMINS MANAGEMENT ====================

  @Get('admins')
  async getAllAdmins(@GetUser() user: any, @Query() query: any) {
    return this.superAdminService.getAllAdmins(query);
  }

  @Post('admins')
  async createAdmin(@GetUser() user: any, @Body() adminData: any) {
    return this.superAdminService.createAdmin(adminData);
  }

  @Get('admins/:adminId')
  async getAdmin(@GetUser() user: any, @Param('adminId') adminId: string) {
    return this.superAdminService.getAdmin(adminId);
  }

  @Patch('admins/:adminId')
  async updateAdmin(
    @GetUser() user: any,
    @Param('adminId') adminId: string,
    @Body() adminData: any
  ) {
    return this.superAdminService.updateAdmin(adminId, adminData);
  }

  @Delete('admins/:adminId')
  async deleteAdmin(@GetUser() user: any, @Param('adminId') adminId: string) {
    return this.superAdminService.deleteAdmin(adminId);
  }

  @Patch('admins/:adminId/status')
  async toggleAdminStatus(
    @GetUser() user: any,
    @Param('adminId') adminId: string,
    @Body() statusData: { status: boolean }
  ) {
    return this.superAdminService.toggleAdminStatus(adminId, statusData.status);
  }

  @Get('analytics/overview')
  async getAnalyticsOverview(@GetUser() user: any, @Query() dateRange: any) {
    return this.superAdminService.getAnalyticsOverview(dateRange);
  }

  @Post('system/backup')
  async initiateSystemBackup(@GetUser() user: any) {
    return this.superAdminService.initiateSystemBackup();
  }

  @Get('system/logs')
  async getSystemLogs(@GetUser() user: any, @Query() query: any) {
    return this.superAdminService.getSystemLogs(query);
  }

  @Post('notifications/broadcast')
  async broadcastNotification(
    @GetUser() user: any,
    @Body() notificationData: {
      title: string;
      message: string;
      targetRoles?: string[];
      priority: 'low' | 'medium' | 'high' | 'critical';
    }
  ) {
    return this.superAdminService.broadcastNotification(notificationData);
  }

  // ==================== SUPERADMIN GOD MODE ENDPOINTS ====================

  @Post('schools/create')
  async createSchool(@GetUser() user: any, @Body() schoolData: CreateSchoolDto) {
    return this.superAdminService.createSchool(schoolData);
  }

  @Get('schools/:schoolId')
  async getSchool(@GetUser() user: any, @Param('schoolId') schoolId: string) {
    return this.superAdminService.getSchool(schoolId);
  }

  @Patch('schools/:schoolId')
  async updateSchool(
    @GetUser() user: any, 
    @Param('schoolId') schoolId: string,
    @Body() schoolData: UpdateSchoolDto
  ) {
    return this.superAdminService.updateSchool(schoolId, schoolData);
  }

  @Delete('schools/:schoolId')
  async deleteSchool(@GetUser() user: any, @Param('schoolId') schoolId: string) {
    return this.superAdminService.deleteSchool(schoolId);
  }

  @Post('users/transfer')
  async transferUser(
    @GetUser() user: any,
    @Body() transferData: { userId: string; targetSchoolId: string }
  ) {
    return this.superAdminService.transferUserToSchool(
      transferData.userId,
      transferData.targetSchoolId
    );
  }

  @Get('users/global-search')
  async globalUserSearch(@GetUser() user: any, @Query() query: any) {
    return this.superAdminService.globalUserSearch(query);
  }

  @Post('admins/create-superadmin')
  async createSuperAdmin(@GetUser() user: any, @Body() adminData: any) {
    return this.superAdminService.createSuperAdmin(adminData);
  }

  @Post('system/emergency-shutdown')
  async emergencyShutdown(
    @GetUser() user: any,
    @Body() shutdownData: { reason: string }
  ) {
    return this.superAdminService.systemEmergencyShutdown(shutdownData.reason);
  }

  @Get('reports/global-financial')
  async getGlobalFinancialReport(@GetUser() user: any) {
    return this.superAdminService.getGlobalFinancialReport();
  }

  @Get('analytics/cross-school')
  async getCrossSchoolAnalytics(@GetUser() user: any) {
    return this.superAdminService.getCrossSchoolAnalytics();
  }

  @Post('users/mass-password-reset')
  async massPasswordReset(
    @GetUser() user: any,
    @Body() resetData: { userIds: string[] }
  ) {
    return this.superAdminService.massPasswordReset(resetData.userIds);
  }

  @Get('system/god-mode-status')
  async getGodModeStatus(@GetUser() user: any) {
    return {
      success: true,
      data: {
        user_id: user.id,
        role: 'superadmin',
        permissions: 'UNLIMITED',
        access_level: 'GOD_MODE',
        system_authority: 'ABSOLUTE',
        can_create_schools: true,
        can_delete_schools: true,
        can_access_all_data: true,
        can_emergency_shutdown: true,
        can_create_superadmins: true,
        cross_school_access: true,
        database_direct_access: true,
        server_control: true
      }
    };
  }
}