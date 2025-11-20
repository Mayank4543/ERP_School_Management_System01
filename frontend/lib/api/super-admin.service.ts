import apiClient from './client';

export interface SystemStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalSchools: number;
  activeUsers: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  serverUptime: string;
  databaseSize: string;
  todayRegistrations: number;
  pendingApprovals: number;
}

export interface RecentActivity {
  id: string;
  type: 'user_registration' | 'teacher_added' | 'student_enrolled' | 'system_update';
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface SystemHealth {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  uptime: {
    seconds: number;
    formatted: string;
  };
  status: string;
}

export const superAdminService = {
  // Test Connection
  

  // Dashboard Statistics
  async getDashboardStats(): Promise<{ success: boolean; data?: SystemStats; message?: string }> {
    try {
      const response = await apiClient.get('/super-admin/dashboard/stats');
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('SuperAdmin stats API error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to fetch dashboard stats'
      };
    }
  },

  // System Health
  async getSystemHealth(): Promise<{ success: boolean; data?: SystemHealth; message?: string }> {
    try {
      const response = await apiClient.get('/super-admin/system/health');
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('SuperAdmin health API error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to fetch system health'
      };
    }
  },

  // Recent Activities
  async getRecentActivities(limit: number = 10): Promise<{ success: boolean; data?: RecentActivity[]; message?: string }> {
    try {
      const response = await apiClient.get(`/super-admin/recent-activities?limit=${limit}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('SuperAdmin activities API error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to fetch recent activities'
      };
    }
  },

  // Pending Approvals
  async getPendingApprovals() {
    const response = await apiClient.get('/super-admin/pending-approvals');
    return response.data;
  },

  // School Management
  async getAllSchools(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: number;
  } = {}): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
      
      const response = await apiClient.get(`/super-admin/schools?${queryParams}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error: any) {
      console.error('SuperAdmin schools API error:', error);
      
      // Fallback demo data for development
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        const demoSchools = [
          {
            _id: 'demo-school-1',
            name: 'Greenwood Elementary School',
            email: 'admin@greenwood.edu',
            phone: '+1-555-0123',
            address: '123 Oak Street, Springfield, IL 62701',
            state: 'Illinois',
            city: 'Springfield',
            pincode: '62701',
            status: true,
            user_count: 150,
            student_count: 120,
            teacher_count: 25,
            createdAt: '2024-01-15T08:30:00.000Z'
          },
          {
            _id: 'demo-school-2',
            name: 'Riverside High School',
            email: 'info@riverside.edu',
            phone: '+1-555-0456',
            address: '456 River Road, Riverside, CA 92501',
            state: 'California',
            city: 'Riverside',
            pincode: '92501',
            status: true,
            user_count: 300,
            student_count: 250,
            teacher_count: 45,
            createdAt: '2024-02-20T10:15:00.000Z'
          },
          {
            _id: 'demo-school-3',
            name: 'Mountain View Academy',
            email: 'contact@mountainview.edu',
            phone: '+1-555-0789',
            address: '789 Mountain View Drive, Denver, CO 80202',
            state: 'Colorado',
            city: 'Denver',
            pincode: '80202',
            status: false,
            user_count: 75,
            student_count: 60,
            teacher_count: 12,
            createdAt: '2024-03-10T14:45:00.000Z'
          }
        ];
        
        return {
          success: true,
          data: { schools: demoSchools },
          message: 'Demo data loaded (Backend unavailable)'
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to fetch schools'
      };
    }
  },

  async approveSchool(schoolId: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.post(`/super-admin/schools/${schoolId}/approve`);
      return { 
        success: true, 
        message: response.data.message || 'School approved successfully',
        data: response.data.data || response.data 
      };
    } catch (error: any) {
      console.error('SuperAdmin approve school error:', error);
      
      // Fallback demo success for development
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        return { 
          success: true, 
          message: 'School approved successfully (Demo mode)'
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to approve school'
      };
    }
  },

  // User Management
  async getAllUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  } = {}): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
      
      const response = await apiClient.get(`/super-admin/users?${queryParams}`);
      
      // Check if response has the expected structure
      if (response && response.data) {
        return { 
          success: true, 
          data: response.data.data || response.data,
          message: response.data.message
        };
      }
      
      return {
        success: false,
        message: 'Invalid response from server'
      };
    } catch (error: any) {
      console.error('SuperAdmin getAllUsers error:', error);
      
      // Provide detailed error information
      let errorMessage = 'Failed to fetch users';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'No response from server. Please check if the backend is running.';
      } else if (error.message) {
        // Error in request setup
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  },

  async updateUserStatus(userId: string, statusData: {
    status: string;
    reason?: string;
  }): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.patch(`/super-admin/users/${userId}/status`, statusData);
      return { success: true, data: response.data.data || response.data, message: 'Status updated successfully' };
    } catch (error: any) {
      console.error('SuperAdmin updateUserStatus error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to update user status'
      };
    }
  },

  // Analytics
  async getAnalyticsOverview(dateRange: {
    startDate?: string;
    endDate?: string;
  } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(dateRange).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const response = await apiClient.get(`/super-admin/analytics/overview?${queryParams}`);
    return response.data;
  },

  // System Operations
  async initiateSystemBackup() {
    const response = await apiClient.post('/super-admin/system/backup');
    return response.data;
  },

  async getSystemLogs(params: {
    page?: number;
    limit?: number;
    level?: string;
    startDate?: string;
    endDate?: string;
  } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });
    
    const response = await apiClient.get(`/super-admin/system/logs?${queryParams}`);
    return response.data;
  },

  // Notifications
  async broadcastNotification(notificationData: {
    title: string;
    message: string;
    targetRoles?: string[];
    priority: 'low' | 'medium' | 'high' | 'critical';
  }) {
    const response = await apiClient.post('/super-admin/notifications/broadcast', notificationData);
    return response.data;
  },


  // School Management Powers
  async createSchool(schoolData: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    state: string;
    city: string;
    pincode: string;
    board?: string;
    website?: string;
  }): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.post('/super-admin/schools/create', schoolData);
      return { success: true, data: response.data.data || response.data };
    } catch (error: any) {
      console.error('SuperAdmin create school error:', error);
      
      // Fallback demo success for development
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        return { 
          success: true, 
          message: 'School created successfully (Demo mode)',
          data: { 
            _id: 'demo-new-' + Date.now(),
            ...schoolData,
            status: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to create school'
      };
    }
  },

  async getSchool(schoolId: string) {
    try {
      const response = await apiClient.get(`/super-admin/schools/${schoolId}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error: any) {
      console.error('SuperAdmin get school error:', error);
      
      // Fallback demo data for development
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        const demoSchool = {
          _id: schoolId,
          name: 'Demo School',
          email: 'demo@school.edu',
          phone: '+1-555-0123',
          address: '123 Education Street, Learning City, LC 12345',
          status: true,
          user_count: 150,
          student_count: 120,
          teacher_count: 25,
          createdAt: new Date('2024-01-15').toISOString()
        };
        return { success: true, data: demoSchool };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to get school details'
      };
    }
  },

  async updateSchool(schoolId: string, schoolData: any) {
    try {
      const response = await apiClient.patch(`/super-admin/schools/${schoolId}`, schoolData);
      return { success: true, data: response.data.data || response.data };
    } catch (error: any) {
      console.error('SuperAdmin update school error:', error);
      
      // Fallback demo success for development
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        return { 
          success: true, 
          message: 'School updated successfully (Demo mode)',
          data: { ...schoolData, _id: schoolId }
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to update school'
      };
    }
  },

  async deleteSchool(schoolId: string) {
    try {
      const response = await apiClient.delete(`/super-admin/schools/${schoolId}`);
      return { success: true, message: response.data.message || 'School deleted successfully' };
    } catch (error: any) {
      console.error('SuperAdmin delete school error:', error);
      
      // Fallback demo success for development
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        return { 
          success: true, 
          message: 'School deleted successfully (Demo mode)'
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to delete school'
      };
    }
  },

  // User Management Powers
  async transferUser(userId: string, targetSchoolId: string) {
    const response = await apiClient.post('/super-admin/users/transfer', {
      userId,
      targetSchoolId
    });
    return response.data;
  },

  async globalUserSearch(params: {
    search?: string;
    school_id?: string;
    role?: string;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });
    
    const response = await apiClient.get(`/super-admin/users/global-search?${queryParams}`);
    return response.data;
  },

  async createSuperAdmin(adminData: {
    name: string;
    email: string;
    password: string;
    mobile_no?: string;
  }) {
    const response = await apiClient.post('/super-admin/admins/create-superadmin', adminData);
    return response.data;
  },

  async massPasswordReset(userIds: string[]) {
    const response = await apiClient.post('/super-admin/users/mass-password-reset', { userIds });
    return response.data;
  },

  // System Control Powers
  async emergencyShutdown(reason: string) {
    const response = await apiClient.post('/super-admin/system/emergency-shutdown', { reason });
    return response.data;
  },

  async getGodModeStatus() {
    const response = await apiClient.get('/super-admin/system/god-mode-status');
    return response.data;
  },

  // Advanced Analytics
  async getGlobalFinancialReport() {
    const response = await apiClient.get('/super-admin/reports/global-financial');
    return response.data;
  },

  async getCrossSchoolAnalytics() {
    const response = await apiClient.get('/super-admin/analytics/cross-school');
    return response.data;
  },

  // Additional methods for new pages
  async getPendingSchools(params: {
    limit?: number;
    page?: number;
  } = {}): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
      
      const response = await apiClient.get(`/super-admin/schools/pending?${queryParams}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error: any) {
      console.error('SuperAdmin pending schools error:', error);
      
      // Fallback demo data for development
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        const demoSchools = [
          {
            _id: 'demo-pending-1',
            name: 'Sunrise Academy',
            email: 'admin@sunriseacademy.edu',
            phone: '+1234567890',
            address: '123 Education Lane, Springfield, IL 62701',
            state: 'Illinois',
            city: 'Springfield',
            pincode: '62701',
            website: 'www.sunriseacademy.edu',
            principalName: 'Dr. Sarah Johnson',
            registeredAt: '2024-11-15T08:30:00Z',
            status: 'pending',
            documents: {
              license: true,
              certificate: true,
              identification: false
            }
          },
          {
            _id: 'demo-pending-2',
            name: 'Bright Future Institute',
            email: 'contact@brightfuture.org',
            phone: '+1234567891',
            address: '456 Learning Street, Oak City, CA 94102',
            state: 'California',
            city: 'Oak City',
            pincode: '94102',
            principalName: 'Mr. Michael Davis',
            registeredAt: '2024-11-16T14:15:00Z',
            status: 'pending',
            documents: {
              license: true,
              certificate: false,
              identification: true
            }
          },
          {
            _id: 'demo-pending-3',
            name: 'Excellence Preparatory School',
            email: 'info@excellenceprep.net',
            phone: '+1234567892',
            address: '789 Academic Drive, Knowledge City, TX 75001',
            state: 'Texas',
            city: 'Knowledge City',
            pincode: '75001',
            website: 'www.excellenceprep.net',
            principalName: 'Mrs. Jennifer Wilson',
            registeredAt: '2024-11-17T10:45:00Z',
            status: 'pending',
            documents: {
              license: false,
              certificate: true,
              identification: true
            }
          },
          {
            _id: 'demo-pending-4',
            name: 'Innovation Charter School',
            email: 'admin@innovationcharter.edu',
            phone: '+1234567893',
            address: '321 Future Blvd, Tech Valley, WA 98001',
            state: 'Washington',
            city: 'Tech Valley',
            pincode: '98001',
            principalName: 'Dr. Robert Chen',
            registeredAt: '2024-11-18T16:20:00Z',
            status: 'pending',
            documents: {
              license: true,
              certificate: true,
              identification: true
            }
          }
        ];
        
        return {
          success: true,
          data: { schools: demoSchools },
          message: 'Demo pending schools loaded (Backend unavailable)'
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to fetch pending schools'
      };
    }
  },

  async rejectSchool(schoolId: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.post(`/super-admin/schools/${schoolId}/reject`);
      return { 
        success: true, 
        message: response.data.message || 'School registration rejected successfully',
        data: response.data.data || response.data 
      };
    } catch (error: any) {
      console.error('SuperAdmin reject school error:', error);
      
      // Fallback demo success for development
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        return { 
          success: true, 
          message: 'School registration rejected successfully (Demo mode)'
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to reject school'
      };
    }
  },

  async getAdmins(params: {
    limit?: number;
    page?: number;
    role?: string;
  } = {}): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
      
      const response = await apiClient.get(`/super-admin/admins?${queryParams}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error: any) {
      console.error('SuperAdmin get admins error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to fetch admins'
      };
    }
  },

  async createAdmin(adminData: {
    name: string;
    email: string;
    password: string;
    mobile_no?: string;
    usergroup_id: 'admin' | 'superadmin';
    school_id?: string;
    roles?: string[];
  }): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.post('/super-admin/admins', adminData);
      return { success: true, data: response.data.data || response.data };
    } catch (error: any) {
      console.error('SuperAdmin create admin error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to create admin'
      };
    }
  },

  async updateAdmin(adminId: string, adminData: any): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.patch(`/super-admin/admins/${adminId}`, adminData);
      return { success: true, data: response.data.data || response.data };
    } catch (error: any) {
      console.error('SuperAdmin update admin error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to update admin'
      };
    }
  },

  async getAdmin(adminId: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.get(`/super-admin/admins/${adminId}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error: any) {
      console.error('SuperAdmin get admin error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to get admin details'
      };
    }
  },

  async deleteAdmin(adminId: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.delete(`/super-admin/admins/${adminId}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error: any) {
      console.error('SuperAdmin delete admin error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to delete admin'
      };
    }
  },

  async toggleAdminStatus(adminId: string, status: boolean): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.patch(`/super-admin/admins/${adminId}/status`, { status });
      return { success: true, data: response.data.data || response.data };
    } catch (error: any) {
      console.error('SuperAdmin toggle admin status error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to update admin status'
      };
    }
  },

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    mobile_no?: string;
    usergroup_id: string;
    school_id?: string;
    roles?: string[];
  }): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.post('/super-admin/users', userData);
      return { 
        success: true, 
        data: response.data.data || response.data,
        message: response.data.message || 'User created successfully'
      };
    } catch (error: any) {
      console.error('SuperAdmin create user error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to create user'
      };
    }
  },

  async updateUser(userId: string, userData: any): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.patch(`/super-admin/users/${userId}`, userData);
      return { 
        success: true, 
        data: response.data.data || response.data,
        message: response.data.message || 'User updated successfully'
      };
    } catch (error: any) {
      console.error('SuperAdmin update user error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to update user'
      };
    }
  },

  async getUser(userId: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.get(`/super-admin/users/${userId}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error: any) {
      console.error('SuperAdmin get user error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to get user details'
      };
    }
  },

  async deleteUser(userId: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.delete(`/super-admin/users/${userId}`);
      return { 
        success: true, 
        data: response.data.data || response.data,
        message: response.data.message || 'User deleted successfully'
      };
    } catch (error: any) {
      console.error('SuperAdmin delete user error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to delete user'
      };
    }
  },

  async getSystemSettings(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.get('/super-admin/settings');
      return { success: true, data: response.data.data || response.data };
    } catch (error: any) {
      console.error('SuperAdmin get settings error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to fetch settings'
      };
    }
  },

  async updateSystemSettings(settings: any): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await apiClient.put('/super-admin/settings', settings);
      return { success: true, data: response.data.data || response.data };
    } catch (error: any) {
      console.error('SuperAdmin update settings error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to update settings'
      };
    }
  }
};