import apiClient from '../../client';

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
export const superAdminDashboardService = {
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
}    