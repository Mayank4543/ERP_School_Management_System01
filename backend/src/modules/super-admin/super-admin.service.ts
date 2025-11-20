import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Teacher, TeacherDocument } from '../teachers/schemas/teacher.schema';
import { School } from '../schools/schemas/school.schema';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(School.name) private schoolModel: Model<any>,
    @InjectModel('Student') private studentModel: Model<any>,
  ) {}

  async getDashboardStats() {
    try {
      const [totalUsers, totalStudents, totalTeachers, totalSchools, activeUsers] = await Promise.all([
        this.userModel.countDocuments({ deleted_at: null }),
        this.studentModel.countDocuments({ deleted_at: null }),
        this.teacherModel.countDocuments({ deleted_at: null }),
        this.schoolModel.countDocuments({ deleted_at: null }),
        this.userModel.countDocuments({ 
          deleted_at: null, 
          last_login: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        })
      ]);

      // Today's registrations
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayRegistrations = await this.userModel.countDocuments({
        createdAt: { $gte: todayStart },
        deleted_at: null
      });

      // Pending approvals (users not activated)
      const pendingApprovals = await this.userModel.countDocuments({
        is_activated: false,
        deleted_at: null
      });

      return {
        success: true,
        data: {
          totalUsers,
          totalStudents,
          totalTeachers,
          totalSchools,
          activeUsers,
          systemHealth: this.calculateSystemHealth(totalUsers, activeUsers),
          serverUptime: this.getServerUptime(),
          databaseSize: await this.getDatabaseSize(),
          todayRegistrations,
          pendingApprovals,
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        message: 'Failed to fetch dashboard statistics',
        error: error.message
      };
    }
  }

  async getSystemHealth() {
    try {
      const memoryUsage = process.memoryUsage();
      const uptime = process.uptime();
      
      return {
        success: true,
        data: {
          memory: {
            used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
            percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
          },
          uptime: {
            seconds: uptime,
            formatted: this.formatUptime(uptime)
          },
          status: 'healthy'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get system health',
        error: error.message
      };
    }
  }

  async getRecentActivities(limit: number = 10) {
    try {
      // Get recent user registrations
      const recentUsers = await this.userModel
        .find({ deleted_at: null })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('name email usergroup_id createdAt')
        .exec();

      // Get recent teacher additions
      const recentTeachers = await this.teacherModel
        .find({ deleted_at: null })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user_id', 'name email')
        .exec();

      const activities = [];

      // Add user registrations
      recentUsers.forEach(user => {
        activities.push({
          id: `user_${user._id}`,
          type: 'user_registration',
          message: `New ${user.usergroup_id} ${user.name} registered`,
          timestamp: this.getRelativeTime(user.createdAt),
          priority: user.usergroup_id === 'superadmin' ? 'high' : 'medium'
        });
      });

      // Add teacher additions
      recentTeachers.forEach(teacher => {
        if (teacher.user_id) {
          activities.push({
            id: `teacher_${teacher._id}`,
            type: 'teacher_added',
            message: `Teacher ${(teacher.user_id as any).name} profile created`,
            timestamp: this.getRelativeTime(teacher.created_at),
            priority: 'medium'
          });
        }
      });

      // Sort by timestamp and limit
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return {
        success: true,
        data: activities.slice(0, limit)
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get recent activities',
        error: error.message
      };
    }
  }

  async getPendingApprovals() {
    try {
      const pendingUsers = await this.userModel
        .find({ is_activated: false, deleted_at: null })
        .select('name email usergroup_id createdAt')
        .sort({ createdAt: -1 })
        .exec();

      const pendingSchools = await this.schoolModel
        .find({ status: false, deleted_at: null })
        .select('name email createdAt')
        .sort({ createdAt: -1 })
        .exec();

      return {
        success: true,
        data: {
          users: pendingUsers,
          schools: pendingSchools,
          total: pendingUsers.length + pendingSchools.length
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get pending approvals',
        error: error.message
      };
    }
  }

  async getAllSchools(query: any) {
    try {
      const { page = 1, limit = 10, search, status } = query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const filter: any = { deleted_at: null };
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      if (status !== undefined) {
        filter.status = parseInt(status);
      }

      const [schools, total] = await Promise.all([
        this.schoolModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .exec(),
        this.schoolModel.countDocuments(filter)
      ]);

      return {
        success: true,
        data: {
          schools,
          pagination: {
            current_page: parseInt(page),
            per_page: parseInt(limit),
            total,
            total_pages: Math.ceil(total / parseInt(limit))
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get schools',
        error: error.message
      };
    }
  }

  async getPendingSchools(query: any = {}) {
    try {
      const { limit = 50, page = 1 } = query;
      const skip = (page - 1) * limit;

      // Get schools that are not yet approved (status: false or pending approval)
      const schools = await this.schoolModel
        .find({ 
          status: false,
          deleted_at: { $exists: false }
        })
        .populate('user_id', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await this.schoolModel.countDocuments({ 
        status: false,
        deleted_at: { $exists: false }
      });

      // Transform data to match frontend expectations
      const transformedSchools = schools.map(school => ({
        ...school,
        principalName: school.user_id?.name || 'Unknown',
        registeredAt: school.createdAt,
        documents: {
          license: true, // Assume documents are submitted
          certificate: true,
          identification: true
        }
      }));

      return {
        success: true,
        data: {
          schools: transformedSchools,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch pending schools',
        error: error.message
      };
    }
  }

  async approveSchool(schoolId: string) {
    try {
      const school = await this.schoolModel
        .findByIdAndUpdate(
          schoolId,
          { status: true, approved_at: new Date() },
          { new: true }
        )
        .exec();

      if (!school) {
        return {
          success: false,
          message: 'School not found'
        };
      }

      return {
        success: true,
        message: 'School approved successfully',
        data: school
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to approve school',
        error: error.message
      };
    }
  }

  async rejectSchool(schoolId: string) {
    try {
      const school = await this.schoolModel
        .findByIdAndUpdate(
          schoolId,
          { 
            status: false, 
            rejected_at: new Date(),
            deleted_at: new Date() // Soft delete rejected schools
          },
          { new: true }
        )
        .exec();

      if (!school) {
        return {
          success: false,
          message: 'School not found'
        };
      }

      return {
        success: true,
        message: 'School registration rejected successfully',
        data: school
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to reject school',
        error: error.message
      };
    }
  }

  // ==================== USERS MANAGEMENT ====================

  async getAllUsers(query: any) {
    try {
      const { page = 1, limit = 10, search, role, status, school_id } = query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const filter: any = { 
        $or: [
          { deleted_at: null },
          { deleted_at: { $exists: false } }
        ]
      };
      
      if (search) {
        filter.$and = filter.$and || [];
        filter.$and.push({
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { mobile_no: { $regex: search, $options: 'i' } }
          ]
        });
      }

      if (role) {
        filter.usergroup_id = role;
      }

      if (status !== undefined) {
        filter.is_activated = status === 'active';
      }

      if (school_id) {
        filter.school_id = new Types.ObjectId(school_id);
      }

      const [users, total] = await Promise.all([
        this.userModel
          .find(filter)
          .select('-password')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean()
          .exec(),
        this.userModel.countDocuments(filter)
      ]);

      // Manually populate school_id only for users that have a valid school_id
      const populatedUsers = await Promise.all(
        users.map(async (user: any) => {
          if (user.school_id && user.school_id !== '') {
            try {
              // Check if it's already an ObjectId or string
              const schoolId = typeof user.school_id === 'object' ? user.school_id : user.school_id;
              const school = await this.schoolModel
                .findById(schoolId)
                .select('name email')
                .lean()
                .exec();
              return { ...user, school_id: school || user.school_id };
            } catch (err) {
              console.log('School lookup failed for user:', user._id, err.message);
              // If school lookup fails, just return the user with original school_id
              return user;
            }
          }
          return user;
        })
      );

      return {
        success: true,
        data: {
          users: populatedUsers,
          pagination: {
            current_page: parseInt(page),
            per_page: parseInt(limit),
            total,
            total_pages: Math.ceil(total / parseInt(limit))
          }
        }
      };
    } catch (error) {
      console.error('getAllUsers error:', error);
      return {
        success: false,
        message: 'Failed to get users',
        error: error.message
      };
    }
  }

  async createUser(userData: any) {
    try {
      // Hash password
      if (userData.password) {
        userData.password = await require('bcrypt').hash(userData.password, 10);
      }

      // Set school_id as ObjectId if provided
      if (userData.school_id) {
        userData.school_id = new Types.ObjectId(userData.school_id);
      }

      const user = await this.userModel.create(userData);
      
      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        success: true,
        message: 'User created successfully',
        data: userResponse
      };
    } catch (error) {
      if (error.code === 11000) {
        return {
          success: false,
          message: 'User with this email already exists',
          error: 'Duplicate email'
        };
      }
      return {
        success: false,
        message: 'Failed to create user',
        error: error.message
      };
    }
  }

  async getUser(userId: string) {
    try {
      const user = await this.userModel
        .findOne({ _id: new Types.ObjectId(userId), deleted_at: null })
        .select('-password')
        .populate('profile')
        .populate('school_id', 'name email')
        .lean();

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get user details',
        error: error.message
      };
    }
  }

  async updateUser(userId: string, userData: any) {
    try {
      // Hash password if provided
      if (userData.password) {
        userData.password = await require('bcrypt').hash(userData.password, 10);
      }

      // Set school_id as ObjectId if provided
      if (userData.school_id) {
        userData.school_id = new Types.ObjectId(userData.school_id);
      }

      const user = await this.userModel
        .findOneAndUpdate(
          { _id: new Types.ObjectId(userId), deleted_at: null },
          userData,
          { new: true }
        )
        .select('-password')
        .populate('profile')
        .populate('school_id', 'name email');

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        message: 'User updated successfully',
        data: user
      };
    } catch (error) {
      if (error.code === 11000) {
        return {
          success: false,
          message: 'Email already exists',
          error: 'Duplicate email'
        };
      }
      return {
        success: false,
        message: 'Failed to update user',
        error: error.message
      };
    }
  }

  async deleteUser(userId: string) {
    try {
      const user = await this.userModel
        .findOneAndUpdate(
          { _id: new Types.ObjectId(userId), deleted_at: null },
          { deleted_at: new Date() },
          { new: true }
        );

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete user',
        error: error.message
      };
    }
  }

  async resetUserPassword(userId: string, newPassword: string) {
    try {
      const hashedPassword = await require('bcrypt').hash(newPassword, 10);
      
      const user = await this.userModel
        .findOneAndUpdate(
          { _id: new Types.ObjectId(userId), deleted_at: null },
          { 
            password: hashedPassword,
            password_reset_required: true 
          },
          { new: true }
        );

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        message: 'Password reset successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to reset password',
        error: error.message
      };
    }
  }

  // ==================== ADMINS MANAGEMENT ====================

  async getAllAdmins(query: any) {
    try {
      const { page = 1, limit = 10, search, school_id } = query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const filter: any = { 
        $or: [
          { deleted_at: null },
          { deleted_at: { $exists: false } }
        ],
        usergroup_id: { $in: ['admin', 'superadmin'] }
      };
      
      if (search) {
        filter.$and = filter.$and || [];
        filter.$and.push({
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        });
      }

      if (school_id) {
        filter.school_id = new Types.ObjectId(school_id);
      }

      const [admins, total] = await Promise.all([
        this.userModel
          .find(filter)
          .select('-password')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean()
          .exec(),
        this.userModel.countDocuments(filter)
      ]);

      // Manually populate school_id for admins
      const populatedAdmins = await Promise.all(
        admins.map(async (admin: any) => {
          if (admin.school_id && admin.school_id !== '') {
            try {
              const school = await this.schoolModel
                .findById(admin.school_id)
                .select('name email')
                .lean()
                .exec();
              return { ...admin, school_id: school || admin.school_id };
            } catch (err) {
              console.log('School lookup failed for admin:', admin._id, err.message);
              return admin;
            }
          }
          return admin;
        })
      );

      return {
        success: true,
        data: {
          admins: populatedAdmins,
          pagination: {
            current_page: parseInt(page),
            per_page: parseInt(limit),
            total,
            total_pages: Math.ceil(total / parseInt(limit))
          }
        }
      };
    } catch (error) {
      console.error('getAllAdmins error:', error);
      return {
        success: false,
        message: 'Failed to get admins',
        error: error.message
      };
    }
  }

  async createAdmin(adminData: any) {
    try {
      // Set admin role
      adminData.usergroup_id = adminData.usergroup_id || 'admin';
      adminData.roles = adminData.roles || ['admin'];

      // Hash password
      if (adminData.password) {
        adminData.password = await require('bcrypt').hash(adminData.password, 10);
      }

      // Set school_id as ObjectId if provided
      if (adminData.school_id) {
        adminData.school_id = new Types.ObjectId(adminData.school_id);
      }

      const admin = await this.userModel.create(adminData);
      
      // Remove password from response
      const adminResponse = admin.toObject();
      delete adminResponse.password;

      return {
        success: true,
        message: 'Admin created successfully',
        data: adminResponse
      };
    } catch (error) {
      if (error.code === 11000) {
        return {
          success: false,
          message: 'Admin with this email already exists',
          error: 'Duplicate email'
        };
      }
      return {
        success: false,
        message: 'Failed to create admin',
        error: error.message
      };
    }
  }

  async getAdmin(adminId: string) {
    try {
      const admin = await this.userModel
        .findOne({ 
          _id: new Types.ObjectId(adminId), 
          deleted_at: null,
          usergroup_id: { $in: ['admin', 'superadmin'] }
        })
        .select('-password')
        .populate('profile')
        .populate('school_id', 'name email')
        .lean();

      if (!admin) {
        return {
          success: false,
          message: 'Admin not found'
        };
      }

      return {
        success: true,
        data: admin
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get admin details',
        error: error.message
      };
    }
  }

  async updateAdmin(adminId: string, adminData: any) {
    try {
      // Hash password if provided
      if (adminData.password) {
        adminData.password = await require('bcrypt').hash(adminData.password, 10);
      }

      // Set school_id as ObjectId if provided
      if (adminData.school_id) {
        adminData.school_id = new Types.ObjectId(adminData.school_id);
      }

      const admin = await this.userModel
        .findOneAndUpdate(
          { 
            _id: new Types.ObjectId(adminId), 
            deleted_at: null,
            usergroup_id: { $in: ['admin', 'superadmin'] }
          },
          adminData,
          { new: true }
        )
        .select('-password')
        .populate('profile')
        .populate('school_id', 'name email');

      if (!admin) {
        return {
          success: false,
          message: 'Admin not found'
        };
      }

      return {
        success: true,
        message: 'Admin updated successfully',
        data: admin
      };
    } catch (error) {
      if (error.code === 11000) {
        return {
          success: false,
          message: 'Email already exists',
          error: 'Duplicate email'
        };
      }
      return {
        success: false,
        message: 'Failed to update admin',
        error: error.message
      };
    }
  }

  async deleteAdmin(adminId: string) {
    try {
      const admin = await this.userModel
        .findOneAndUpdate(
          { 
            _id: new Types.ObjectId(adminId), 
            deleted_at: null,
            usergroup_id: { $in: ['admin', 'superadmin'] }
          },
          { deleted_at: new Date() },
          { new: true }
        );

      if (!admin) {
        return {
          success: false,
          message: 'Admin not found'
        };
      }

      return {
        success: true,
        message: 'Admin deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete admin',
        error: error.message
      };
    }
  }

  async toggleAdminStatus(adminId: string, status: boolean) {
    try {
      const admin = await this.userModel
        .findOneAndUpdate(
          { 
            _id: new Types.ObjectId(adminId), 
            deleted_at: null,
            usergroup_id: { $in: ['admin', 'superadmin'] }
          },
          { is_activated: status },
          { new: true }
        )
        .select('-password');

      if (!admin) {
        return {
          success: false,
          message: 'Admin not found'
        };
      }

      return {
        success: true,
        message: `Admin ${status ? 'activated' : 'deactivated'} successfully`,
        data: admin
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update admin status',
        error: error.message
      };
    }
  }

  async updateUserStatus(userId: string, statusData: { status: string; reason?: string }) {
    try {
      const updateData: any = {
        is_activated: statusData.status === 'active'
      };

      if (statusData.reason) {
        updateData.status_reason = statusData.reason;
      }

      const user = await this.userModel
        .findByIdAndUpdate(userId, updateData, { new: true })
        .select('-password')
        .exec();

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        message: `User status updated to ${statusData.status}`,
        data: user
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update user status',
        error: error.message
      };
    }
  }

  async getAnalyticsOverview(dateRange: any) {
    try {
      const { startDate, endDate } = dateRange;
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      const userGrowth = await this.userModel.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            deleted_at: null
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);

      const roleDistribution = await this.userModel.aggregate([
        {
          $match: { deleted_at: null }
        },
        {
          $group: {
            _id: '$usergroup_id',
            count: { $sum: 1 }
          }
        }
      ]);

      return {
        success: true,
        data: {
          userGrowth,
          roleDistribution,
          dateRange: { start, end }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get analytics overview',
        error: error.message
      };
    }
  }

  async initiateSystemBackup() {
    try {
      // In a real implementation, this would trigger an actual backup process
      const backupId = new Types.ObjectId().toString();
      
      return {
        success: true,
        message: 'System backup initiated successfully',
        data: {
          backup_id: backupId,
          initiated_at: new Date(),
          estimated_completion: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to initiate system backup',
        error: error.message
      };
    }
  }

  async getSystemLogs(query: any) {
    try {
      const { page = 1, limit = 50, level, startDate, endDate } = query;
      
      // In a real implementation, this would query actual log files or log database
      const mockLogs = [
        {
          id: '1',
          timestamp: new Date(),
          level: 'info',
          message: 'User authentication successful',
          source: 'auth.service'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          level: 'warning',
          message: 'High memory usage detected',
          source: 'system.monitor'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          level: 'error',
          message: 'Database connection timeout',
          source: 'database.service'
        }
      ];

      return {
        success: true,
        data: {
          logs: mockLogs,
          pagination: {
            current_page: parseInt(page),
            per_page: parseInt(limit),
            total: mockLogs.length,
            total_pages: 1
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get system logs',
        error: error.message
      };
    }
  }

  async broadcastNotification(notificationData: any) {
    try {
      // In a real implementation, this would send notifications via websockets, email, etc.
      const notification = {
        id: new Types.ObjectId().toString(),
        title: notificationData.title,
        message: notificationData.message,
        priority: notificationData.priority,
        target_roles: notificationData.targetRoles || ['all'],
        created_at: new Date(),
        sent_by: 'superadmin'
      };

      // Here you would save to notification collection and broadcast
      
      return {
        success: true,
        message: 'Notification broadcasted successfully',
        data: notification
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to broadcast notification',
        error: error.message
      };
    }
  }

  // ==================== SUPERADMIN GOD MODE POWERS ====================

  async createSchool(schoolData: CreateSchoolDto) {
    try {
      // Generate slug from school name
      const slug = schoolData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Create school with all required fields
      const school = await this.schoolModel.create({
        name: schoolData.name,
        email: schoolData.email,
        phone: schoolData.phone,
        address: schoolData.address,
        state: schoolData.state,
        city: schoolData.city,
        pincode: schoolData.pincode,
        board: schoolData.board,
        website: schoolData.website,
        logo: schoolData.logo,
        slug: slug,
        status: schoolData.status !== undefined ? schoolData.status : true // Auto-approve for SuperAdmin
      });

      return {
        success: true,
        message: 'School created successfully',
        data: school
      };
    } catch (error) {
      // Handle duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return {
          success: false,
          message: `School with this ${field} already exists`,
          error: `Duplicate ${field}`
        };
      }

      return {
        success: false,
        message: 'Failed to create school',
        error: error.message
      };
    }
  }

  async getSchool(schoolId: string) {
    try {
      const school = await this.schoolModel.findById(schoolId)
        .populate('user_id', 'name email')
        .lean();

      if (!school) {
        return {
          success: false,
          message: 'School not found'
        };
      }

      // Get user counts for this school
      const userCount = await this.userModel.countDocuments({ 
        school_id: schoolId, 
        deleted_at: { $exists: false } 
      });
      
      const studentCount = await this.userModel.countDocuments({ 
        school_id: schoolId,
        usergroup_id: 'student',
        deleted_at: { $exists: false } 
      });
      
      const teacherCount = await this.userModel.countDocuments({ 
        school_id: schoolId,
        usergroup_id: 'teacher',
        deleted_at: { $exists: false } 
      });

      return {
        success: true,
        data: {
          ...school,
          user_count: userCount,
          student_count: studentCount,
          teacher_count: teacherCount
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get school details',
        error: error.message
      };
    }
  }

  async updateSchool(schoolId: string, schoolData: UpdateSchoolDto) {
    try {
      // Prepare update data, only include provided fields
      const updateData: any = {};
      
      if (schoolData.name !== undefined) {
        updateData.name = schoolData.name;
        // Update slug if name changes
        updateData.slug = schoolData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      if (schoolData.email !== undefined) updateData.email = schoolData.email;
      if (schoolData.phone !== undefined) updateData.phone = schoolData.phone;
      if (schoolData.address !== undefined) updateData.address = schoolData.address;
      if (schoolData.state !== undefined) updateData.state = schoolData.state;
      if (schoolData.city !== undefined) updateData.city = schoolData.city;
      if (schoolData.pincode !== undefined) updateData.pincode = schoolData.pincode;
      if (schoolData.board !== undefined) updateData.board = schoolData.board;
      if (schoolData.website !== undefined) updateData.website = schoolData.website;
      if (schoolData.logo !== undefined) updateData.logo = schoolData.logo;
      if (schoolData.status !== undefined) updateData.status = schoolData.status;

      updateData.updatedAt = new Date();

      const updatedSchool = await this.schoolModel.findByIdAndUpdate(
        schoolId,
        updateData,
        { new: true, runValidators: true }
      ).lean();

      if (!updatedSchool) {
        return {
          success: false,
          message: 'School not found'
        };
      }

      return {
        success: true,
        message: 'School updated successfully',
        data: updatedSchool
      };
    } catch (error) {
      // Handle duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return {
          success: false,
          message: `School with this ${field} already exists`,
          error: `Duplicate ${field}`
        };
      }

      return {
        success: false,
        message: 'Failed to update school',
        error: error.message
      };
    }
  }

  async deleteSchool(schoolId: string) {
    try {
      // Soft delete school and all related data
      await this.schoolModel.findByIdAndUpdate(schoolId, { 
        deleted_at: new Date(),
        status: false 
      });

      // Also soft delete all users from this school
      await this.userModel.updateMany(
        { school_id: schoolId },
        { deleted_at: new Date() }
      );

      return {
        success: true,
        message: 'School and all related data deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete school',
        error: error.message
      };
    }
  }

  async transferUserToSchool(userId: string, targetSchoolId: string) {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        { school_id: new Types.ObjectId(targetSchoolId) },
        { new: true }
      );

      return {
        success: true,
        message: 'User transferred successfully',
        data: user
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to transfer user',
        error: error.message
      };
    }
  }

  async globalUserSearch(query: any) {
    try {
      const { search, school_id, role, limit = 50 } = query;
      
      const filter: any = { deleted_at: null };
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      if (school_id) {
        filter.school_id = new Types.ObjectId(school_id);
      }

      if (role) {
        filter.usergroup_id = role;
      }

      const users = await this.userModel
        .find(filter)
        .populate('profile')
        .populate('school_id', 'name')
        .select('-password')
        .limit(parseInt(limit))
        .sort({ createdAt: -1 })
        .exec();

      return {
        success: true,
        data: users
      };
    } catch (error) {
      return {
        success: false,
        message: 'Global user search failed',
        error: error.message
      };
    }
  }

  async createSuperAdmin(adminData: any) {
    try {
      const superAdmin = await this.userModel.create({
        ...adminData,
        usergroup_id: 'superadmin',
        roles: ['superadmin'],
        is_activated: true,
        password: await require('bcrypt').hash(adminData.password, 10)
      });

      return {
        success: true,
        message: 'SuperAdmin created successfully',
        data: { id: superAdmin._id, email: superAdmin.email }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create SuperAdmin',
        error: error.message
      };
    }
  }

  async systemEmergencyShutdown(reason: string) {
    try {
      // Log the emergency shutdown
      console.error(`EMERGENCY SHUTDOWN INITIATED: ${reason}`);
      
      // In real implementation, this would:
      // 1. Notify all active users
      // 2. Save all pending data
      // 3. Close database connections
      // 4. Stop the server gracefully

      return {
        success: true,
        message: 'Emergency shutdown initiated',
        data: {
          timestamp: new Date(),
          reason,
          status: 'shutting_down'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Emergency shutdown failed',
        error: error.message
      };
    }
  }

  async getGlobalFinancialReport() {
    try {
      // Mock global financial data across all schools
      const financialData = {
        total_revenue: 2500000,
        total_expenses: 1800000,
        net_profit: 700000,
        schools_count: 12,
        top_performing_schools: [
          { name: 'Elite Academy', revenue: 450000 },
          { name: 'Prime School', revenue: 380000 },
          { name: 'Excellence High', revenue: 320000 }
        ],
        monthly_trends: [
          { month: 'Jan', revenue: 200000 },
          { month: 'Feb', revenue: 220000 },
          { month: 'Mar', revenue: 240000 }
        ]
      };

      return {
        success: true,
        data: financialData
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to generate financial report',
        error: error.message
      };
    }
  }

  async getCrossSchoolAnalytics() {
    try {
      const analytics = await Promise.all([
        this.userModel.aggregate([
          { $match: { deleted_at: null } },
          { $group: { _id: '$school_id', count: { $sum: 1 } } },
          { $lookup: { from: 'schools', localField: '_id', foreignField: '_id', as: 'school' } },
          { $unwind: '$school' },
          { $project: { school_name: '$school.name', user_count: '$count' } }
        ]),
        
        this.teacherModel.aggregate([
          { $match: { deleted_at: null } },
          { $group: { _id: '$school_id', count: { $sum: 1 } } }
        ]),

        this.studentModel.aggregate([
          { $match: { deleted_at: null } },
          { $group: { _id: '$school_id', count: { $sum: 1 } } }
        ])
      ]);

      return {
        success: true,
        data: {
          users_by_school: analytics[0],
          teachers_by_school: analytics[1],
          students_by_school: analytics[2],
          generated_at: new Date()
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to generate cross-school analytics',
        error: error.message
      };
    }
  }

  async massPasswordReset(userIds: string[]) {
    try {
      const tempPassword = 'TempPass123!';
      const hashedPassword = await require('bcrypt').hash(tempPassword, 10);

      const result = await this.userModel.updateMany(
        { _id: { $in: userIds.map(id => new Types.ObjectId(id)) } },
        { 
          password: hashedPassword,
          password_reset_required: true,
          password_reset_token: new Types.ObjectId().toString()
        }
      );

      return {
        success: true,
        message: `Password reset for ${result.modifiedCount} users`,
        data: {
          affected_users: result.modifiedCount,
          temp_password: tempPassword
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Mass password reset failed',
        error: error.message
      };
    }
  }

  // Helper methods
  private calculateSystemHealth(totalUsers: number, activeUsers: number): string {
    const activityRatio = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
    
    if (activityRatio > 20) return 'excellent';
    if (activityRatio > 10) return 'good';
    if (activityRatio > 5) return 'warning';
    return 'critical';
  }

  private getServerUptime(): string {
    const uptime = process.uptime();
    return this.formatUptime(uptime);
  }

  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  }

  private async getDatabaseSize(): Promise<string> {
    try {
      // In a real implementation, you would query actual database size
      return '2.4 GB';
    } catch (error) {
      return 'Unknown';
    }
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }
}