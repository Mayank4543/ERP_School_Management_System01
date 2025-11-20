'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  Clock, 
  BookOpen,
  FileCheck,
  AlertCircle,
  TrendingUp,
  ClipboardList,
  Award,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { dashboardService, type TeacherDashboardData } from '@/lib/api/services/dashboard.service';
import { toast } from 'sonner';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.ref_id]);

  const fetchDashboardData = async () => {
    // user.ref_id contains the teacher _id for teacher users
    if (!user?.ref_id) return;

    try {
      setLoading(true);
      const data = await dashboardService.getTeacherDashboard(user.ref_id);
      setDashboardData(data);
    } catch (error: any) {
      console.error('Failed to fetch teacher dashboard:', error);
      toast.error(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Failed to load dashboard data</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Personal Stats
  const teacherStats = [
    {
      title: 'My Classes',
      value: dashboardData.stats.my_classes.toString(),
      change: `${dashboardData.teacher_info.subjects.length} subjects`,
      trend: 'neutral',
      icon: BookOpen,
      color: 'blue',
      description: 'Classes assigned',
    },
    {
      title: 'Total Students',
      value: dashboardData.stats.total_students.toString(),
      change: 'Under supervision',
      trend: 'neutral',
      icon: Users,
      color: 'green',
      description: 'Across all classes',
    },
    {
      title: 'Today\'s Classes',
      value: dashboardData.stats.today_classes.toString(),
      change: `${dashboardData.stats.today_classes * 1} hours`,
      trend: 'neutral',
      icon: Clock,
      color: 'purple',
      description: 'Teaching hours today',
    },
    {
      title: 'Pending Grading',
      value: dashboardData.stats.pending_grading.toString(),
      change: `${dashboardData.teacher_info.subjects.length} subjects`,
      trend: 'down',
      icon: FileCheck,
      color: 'orange',
      description: 'Papers to grade',
    },
  ];

  // Today's attendance from backend
  const attendanceStats = {
    percentage: dashboardData.today_attendance.percentage,
    present: dashboardData.today_attendance.present,
    absent: dashboardData.today_attendance.absent,
    total: dashboardData.today_attendance.total,
  };

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
  };

  const attendanceStatusColor = 
    attendanceStats.percentage >= 95 ? 'bg-green-100 text-green-700' :
    attendanceStats.percentage >= 90 ? 'bg-blue-100 text-blue-700' :
    attendanceStats.percentage >= 80 ? 'bg-yellow-100 text-yellow-700' :
    'bg-red-100 text-red-700';

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {dashboardData.teacher_info.name}! 👨‍🏫
        </h1>
        <p className="text-green-100">
          Employee ID: {dashboardData.teacher_info.employee_id} • {dashboardData.teacher_info.email}
        </p>
        <p className="text-green-100 text-sm mt-1">
          Subjects: {dashboardData.teacher_info.subjects.join(', ') || 'Not assigned'}
        </p>
      </div>

      {/* Teacher Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {teacherStats.map((stat, index) => {
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
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {stat.trend === 'down' ? (
                    <AlertCircle size={14} className="text-orange-500 mr-1" />
                  ) : (
                    <TrendingUp size={14} className="text-green-500 mr-1" />
                  )}
                  <span className={stat.trend === 'down' ? 'text-orange-500' : 'text-gray-500'}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Attendance & Exams Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Today's Attendance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Today's Attendance Summary
            </CardTitle>
            <CardDescription>Overall attendance marked today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{attendanceStats.percentage.toFixed(1)}%</span>
                <Badge variant="secondary" className={`text-sm ${attendanceStatusColor}`}>
                  {attendanceStats.percentage >= 90 ? 'Excellent' : attendanceStats.percentage >= 80 ? 'Good' : 'Average'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{attendanceStats.total}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
                  <div className="text-xs text-gray-500">Present</div>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
                  <div className="text-xs text-gray-500">Absent</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all ${
                    attendanceStats.percentage >= 95 ? 'bg-green-500' :
                    attendanceStats.percentage >= 90 ? 'bg-blue-500' :
                    attendanceStats.percentage >= 80 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${attendanceStats.percentage}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList size={20} />
              Upcoming Exams
            </CardTitle>
            <CardDescription>Exams to conduct</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.upcoming_exams.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No upcoming exams scheduled</p>
                </div>
              ) : (
                dashboardData.upcoming_exams.map((exam, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold">{exam.name}</p>
                        <Badge variant="secondary" className="text-xs capitalize">{exam.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <Badge variant="outline" className="text-xs capitalize">{exam.exam_type}</Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award size={20} />
            Recent Activities
          </CardTitle>
          <CardDescription>Your recent teaching activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dashboardData.recent_activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="flex-1">
                  <p className="text-sm font-semibold">{activity.action}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
