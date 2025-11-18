'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Award,
  FileText,
  AlertCircle,
  CheckCircle,
  DollarSign,
  GraduationCap,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { dashboardService, type StudentDashboardData } from '@/lib/api/services/dashboard.service';
import { toast } from 'sonner';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      // Pass user.id (which is user_id), backend will fetch student record
      const data = await dashboardService.getStudentDashboard(user.id);
      setDashboardData(data);
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
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
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Personal Stats
  const personalStats = [
    {
      title: 'My Attendance',
      value: `${dashboardData.personalStats.attendance}%`,
      change: '+2.1%',
      trend: 'up',
      icon: Calendar,
      color: 'blue',
      description: `Present ${Math.round((dashboardData.personalStats.attendance / 100) * 90)} of 90 days`,
    },
    {
      title: 'Average Score',
      value: `${dashboardData.personalStats.averageScore}%`,
      change: '+5.2%',
      trend: 'up',
      icon: Award,
      color: 'green',
      description: 'Excellent performance',
    },
    {
      title: 'Class Rank',
      value: `#${dashboardData.personalStats.classRank}`,
      change: `of ${dashboardData.personalStats.totalStudents}`,
      trend: 'up',
      icon: TrendingUp,
      color: 'purple',
      description: `Top ${Math.round((dashboardData.personalStats.classRank / dashboardData.personalStats.totalStudents) * 100)}% in class`,
    },
    {
      title: 'Pending Fees',
      value: `₹${dashboardData.personalStats.pendingFees.toLocaleString()}`,
      change: dashboardData.personalStats.pendingFees === 0 ? 'Paid' : 'Due: Dec 1',
      trend: dashboardData.personalStats.pendingFees === 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'orange',
      description: dashboardData.personalStats.pendingFees === 0 ? 'All clear' : 'Nov month fee',
    },
  ];

  // Today's Schedule (from backend)
  const todaySchedule = dashboardData.todaySchedule;

  // Upcoming Exams (from backend)
  const upcomingExams = dashboardData.upcomingExams;

  // Pending Assignments (from backend)
  const pendingAssignments = dashboardData.pendingAssignments;

  // Recent Grades (from backend)
  const recentGrades = dashboardData.recentGrades;

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-700 border-green-200',
    ongoing: 'bg-blue-100 text-blue-700 border-blue-200',
    upcoming: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.first_name}! 🎓
        </h1>
        <p className="text-purple-100">
          Here's your academic progress and today's schedule
        </p>
      </div>

      {/* Personal Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {personalStats.map((stat, index) => {
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
                  {stat.trend === 'up' ? (
                    <TrendingUp size={14} className="text-green-500 mr-1" />
                  ) : (
                    <AlertCircle size={14} className="text-orange-500 mr-1" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-500' : 'text-orange-500'}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Today's Schedule */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} />
              My Classes Today
            </CardTitle>
            <CardDescription>Monday, November 17, 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((classItem, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{classItem.time.split(' - ')[0]}</div>
                    <div className="text-xs text-gray-500">{classItem.time.split(' - ')[1]}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{classItem.subject}</p>
                      <Badge variant="outline" className={`text-xs ${statusColors[classItem.status as keyof typeof statusColors]}`}>
                        {classItem.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{classItem.teacher} • Room {classItem.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap size={20} />
              Upcoming Exams
            </CardTitle>
            <CardDescription>Next 15 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingExams.map((exam, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold">{exam.subject}</p>
                      <Badge variant="secondary" className="text-xs">{exam.marks} Marks</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{exam.syllabus}</p>
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-gray-500" />
                      <span className="text-xs text-gray-500">{new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <Badge variant="outline" className="text-xs ml-auto">{exam.type}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout - Assignments & Grades */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pending Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Pending Assignments
            </CardTitle>
            <CardDescription>Complete before deadline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingAssignments.map((assignment, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold">{assignment.subject}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          assignment.priority === 'high' ? 'border-red-500 text-red-500' :
                          assignment.priority === 'medium' ? 'border-yellow-500 text-yellow-500' :
                          'border-green-500 text-green-500'
                        }`}
                      >
                        {assignment.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{assignment.title}</p>
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-gray-500" />
                      <span className="text-xs text-gray-500">
                        Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-xs text-orange-500 ml-auto">{assignment.daysLeft} days left</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award size={20} />
              Recent Grades
            </CardTitle>
            <CardDescription>Last 4 assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentGrades.map((grade, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold">{grade.subject}</p>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          grade.percentage >= 90 ? 'bg-green-100 text-green-700' :
                          grade.percentage >= 75 ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {grade.grade}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{grade.topic}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{grade.marks}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(grade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className={`h-1.5 rounded-full ${
                          grade.percentage >= 90 ? 'bg-green-500' :
                          grade.percentage >= 75 ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${grade.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
