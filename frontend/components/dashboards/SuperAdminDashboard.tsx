'use client';
import { useEffect, useState, useCallback } from 'react';
import { superAdminDashboardService, type SystemStats } from '@/lib/api/services/super-admin/dashboard.service';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, GraduationCap, UserCheck, School, RefreshCw, CheckCircle, XCircle, Activity } from 'lucide-react';
import {Tabs,TabsContent,TabsList,TabsTrigger} from "@/components/ui/tabs"
export default function SuperAdminDashboard() {

  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalSchools: 0,
    activeUsers: 0,
    systemHealth: 'good',
    serverUptime: '0d 0h 0m',
    databaseSize: '0 GB',
    todayRegistrations: 0,
    pendingApprovals: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {

      const response = await superAdminDashboardService.getDashboardStats();

      if (!response.data) {
        return ({
          success: false,
          message: response.data || 'Failed to fetch dashboard stats'
        })
      }
      const school = response.data;
      setStats({
        totalUsers: school.totalUsers,
        totalStudents: school.totalStudents,
        totalTeachers: school.totalTeachers,
        totalSchools: school.totalSchools,
        activeUsers: school.activeUsers,
        systemHealth: 'good',
        serverUptime: '15d 8h 42m',
        databaseSize: '2.4 GB',
        todayRegistrations: school.todayRegistrations,
        pendingApprovals: 3,
      });

      toast.success('Dashboard data updated');
    } catch (error: any) {
      console.error('Backend connection failed:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);
  const recentActivity = useCallback(async () => {
    try {
      const response = await superAdminDashboardService.getRecentActivities();
      console.log('Recent Activity Response:', response.data);
      if (!response.data) {
        return ({
          success: false,
          message: response.data || 'Failed to fetch recent activity'
        })
      }
    } catch (error: any) {
      console.error('Error fetching recent activity:', error);
    }
  }, []);

  useEffect(() => {
    recentActivity();
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
        {/* Recent Activity */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <Activity className="h-5 w-5 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">No recent activity</p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}