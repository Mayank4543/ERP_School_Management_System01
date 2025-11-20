'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { superAdminService } from '@/lib/api/super-admin.service';
import { toast } from 'sonner';
import MultiSchoolSelector from '@/components/shared/MultiSchoolSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  School, 
  TrendingUp, 
  Activity,
  Settings,
  Database,
  Shield,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface SystemStats {
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

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'teacher_added' | 'student_enrolled' | 'system_update';
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Mock data for demonstration
const mockStats: SystemStats = {
  totalUsers: 1250,
  totalStudents: 980,
  totalTeachers: 85,
  totalSchools: 12,
  activeUsers: 156,
  systemHealth: 'good',
  serverUptime: '15d 8h 42m',
  databaseSize: '2.4 GB',
  todayRegistrations: 8,
  pendingApprovals: 3,
};


export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SystemStats>(mockStats);
  
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch schools data
      const schoolsResponse = await superAdminService.getAllSchools({ limit: 100 });
      const schools = schoolsResponse.data?.schools || [];
      
      // Fetch users data
      const usersResponse = await superAdminService.getAllUsers({ limit: 100 });
      const users = usersResponse.data?.users || [];
      
      // Calculate dynamic stats
      const totalSchools = schools.length;
      const totalUsers = users.length;
      const activeUsers = users.filter((u: any) => u.is_activated).length;
      
      const totalStudents = users.filter((u: any) => 
        u.usergroup_id === 'student' || u.roles?.includes('student')
      ).length;
      
      const totalTeachers = users.filter((u: any) => 
        u.usergroup_id === 'teacher' || u.roles?.includes('teacher')
      ).length;
      
      const todayRegistrations = users.filter((u: any) => {
        const createdDate = new Date(u.createdAt);
        const today = new Date();
        return createdDate.toDateString() === today.toDateString();
      }).length;
      
      // Update stats with real data
      setStats({
        totalUsers,
        totalStudents,
        totalTeachers,
        totalSchools,
        activeUsers,
        systemHealth: 'good',
        serverUptime: '15d 8h 42m',
        databaseSize: '2.4 GB',
        todayRegistrations,
        pendingApprovals: 3,
      });
      
      // Generate recent activities from actual data
      const recentUserActivities = users
        .slice(0, 5)
        .map((user: any, index: number) => ({
          id: `activity-${index}`,
          type: 'user_registration' as const,
          message: `New ${user.usergroup_id || 'user'} registered: ${user.name}`,
          timestamp: formatTimestamp(user.createdAt),
          priority: 'medium' as const
        }));
      
   
      
      toast.success('Dashboard data updated');
    } catch (error: any) {
      console.error('Backend connection failed:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshKey]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Multi-School Selector */}
      {/* <MultiSchoolSelector 
       
        onSchoolChange={() => {
        
          setRefreshKey(prev => prev + 1);
          // Add small delay to ensure backend is updated
          setTimeout(() => {
            fetchDashboardData();
          }, 500);
        }}
        showCreateButton={true}
        showGlobalView={true}
      /> */}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, Admin!</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium">+{stats.activeUsers}</span> active today
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              Across {stats.totalSchools} schools
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Teachers</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium">+{stats.todayRegistrations}</span> registered today
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Schools</CardTitle>
            <School className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalSchools}</div>
            <p className="text-xs text-gray-500 mt-1">
              Active institutions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        

        {/* Pending Approvals */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <UserCheck className="h-5 w-5 text-purple-600" />
              Pending Approvals
              {stats.pendingApprovals > 0 && (
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-900">2 School Registrations</p>
                <p className="text-xs text-gray-500 mt-0.5">New institutions awaiting approval</p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-900">1 Admin Application</p>
                <p className="text-xs text-gray-500 mt-0.5">School admin role request</p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}