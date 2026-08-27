import apiClient from './client';


export const superAdminService = {
  
  
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