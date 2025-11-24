'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, Calendar, DollarSign, Activity, TrendingUp, TrendingDown, Loader2, AlertCircle } from 'lucide-react';
import { dashboardService, AdminDashboardData } from '@/lib/api/services/dashboard.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.school_id]);

  const fetchDashboardData = async () => {
   
    
    if (!user?.school_id) {
      console.error('No school_id found for admin user');
      toast.error('School ID not found. Please contact administrator.');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      const data = await dashboardService.getAdminDashboard(user.school_id);
    
      setDashboardData(data);
    } catch (error: any) {
      console.error('Failed to fetch admin dashboard:', error);
      toast.error(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-600 mb-4" />
          <p className="text-gray-600 mb-4">Failed to load dashboard data</p>
          <Button onClick={fetchDashboardData}>Retry</Button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Students',
      value: dashboardData.overview.total_students.toString(),
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Total Teachers',
      value: dashboardData.overview.total_teachers.toString(),
      icon: GraduationCap,
      color: 'green',
    },
    {
      title: 'Total Staff',
      value: dashboardData.overview.total_staff.toString(),
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Total Users',
      value: dashboardData.overview.total_users.toString(),
      icon: Activity,
      color: 'orange',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.first_name}! 👋
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your school today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Today's Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Today's Attendance
            </CardTitle>
            <CardDescription>Overall attendance summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Attendance Percentage</span>
                <Badge variant="secondary" className="text-lg font-bold">
                  {dashboardData.today_attendance.percentage.toFixed(1)}%
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {dashboardData.today_attendance.total}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-100 dark:bg-green-900">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {dashboardData.today_attendance.present}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Present</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-100 dark:bg-red-900">
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {dashboardData.today_attendance.absent}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Absent</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${dashboardData.today_attendance.percentage}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee Collection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign size={20} />
              Fee Collection Summary
            </CardTitle>
            <CardDescription>Monthly collection overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Collected</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    ₹{(dashboardData.fee_collection?.total_collected || 0).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="text-green-500" size={32} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Amount</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    ₹{(dashboardData.fee_collection?.pending || 0).toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="text-orange-500" size={32} />
              </div>
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Defaulters Count</span>
                  <Badge variant="destructive">{dashboardData.fee_collection?.defaulters || 0}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Class-wise Distribution</CardTitle>
          <CardDescription>Student count by class</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(dashboardData.class_distribution || []).map((classData, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="font-bold text-blue-600 dark:text-blue-300">{classData.class}</span>
                  </div>
                  <div>
                    <p className="font-medium">Class {classData.class}</p>
                    <p className="text-xs text-gray-500">{classData.students} students</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ 
                        width: `${dashboardData.class_distribution && dashboardData.class_distribution.length > 0 ? (classData.students / Math.max(...dashboardData.class_distribution.map(c => c.students || 0))) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{classData.students || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity size={20} />
            Recent Activities
          </CardTitle>
          <CardDescription>Latest updates from your school</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(dashboardData.recent_activities || []).map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
