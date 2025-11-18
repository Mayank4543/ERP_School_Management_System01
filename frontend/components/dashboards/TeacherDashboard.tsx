'use client';

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
  Award
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TeacherDashboard() {
  const { user } = useAuth();

  // Personal Stats
  const teacherStats = [
    {
      title: 'My Classes',
      value: '5',
      change: '3 sections',
      trend: 'neutral',
      icon: BookOpen,
      color: 'blue',
      description: 'Classes assigned',
    },
    {
      title: 'Total Students',
      value: '150',
      change: 'Under supervision',
      trend: 'neutral',
      icon: Users,
      color: 'green',
      description: 'Across all classes',
    },
    {
      title: 'Today\'s Classes',
      value: '4',
      change: '6 hours',
      trend: 'neutral',
      icon: Clock,
      color: 'purple',
      description: 'Teaching hours today',
    },
    {
      title: 'Pending Grading',
      value: '28',
      change: '3 subjects',
      trend: 'down',
      icon: FileCheck,
      color: 'orange',
      description: 'Papers to grade',
    },
  ];

  // Today's Teaching Schedule
  const todaySchedule = [
    { time: '09:00 - 10:00', class: '10-A', subject: 'Mathematics', room: '101', students: 40, status: 'completed' },
    { time: '10:00 - 11:00', class: '10-B', subject: 'Mathematics', room: '102', students: 38, status: 'completed' },
    { time: '11:15 - 12:15', class: '11-A', subject: 'Advanced Math', room: '201', students: 35, status: 'ongoing' },
    { time: '02:00 - 03:00', class: '9-A', subject: 'Mathematics', room: '103', students: 42, status: 'upcoming' },
  ];

  // Upcoming Exams (to conduct)
  const upcomingExams = [
    { class: '10-A', subject: 'Mathematics', date: '2025-11-25', type: 'Mid-term', duration: '3 hours', totalMarks: 100 },
    { class: '11-A', subject: 'Advanced Math', date: '2025-11-28', type: 'Mid-term', duration: '3 hours', totalMarks: 100 },
    { class: '9-A', subject: 'Mathematics', date: '2025-12-02', type: 'Unit Test', duration: '1 hour', totalMarks: 50 },
  ];

  // Pending Grading Tasks
  const pendingGrading = [
    { class: '10-A', task: 'Algebra Test Papers', count: 12, subject: 'Mathematics', dueDate: '2025-11-20', priority: 'high' },
    { class: '10-B', task: 'Geometry Assignment', count: 8, subject: 'Mathematics', dueDate: '2025-11-22', priority: 'medium' },
    { class: '11-A', task: 'Calculus Quiz', count: 8, subject: 'Advanced Math', dueDate: '2025-11-24', priority: 'low' },
  ];

  // Class-wise Attendance Overview (Today)
  const attendanceOverview = [
    { class: '10-A', total: 40, present: 37, absent: 3, percentage: 92.5, status: 'good' },
    { class: '10-B', total: 38, present: 35, absent: 3, percentage: 92.1, status: 'good' },
    { class: '11-A', total: 35, present: 30, absent: 5, percentage: 85.7, status: 'average' },
    { class: '9-A', total: 42, present: 40, absent: 2, percentage: 95.2, status: 'excellent' },
  ];

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

  const attendanceStatusColors = {
    excellent: 'bg-green-100 text-green-700',
    good: 'bg-blue-100 text-blue-700',
    average: 'bg-yellow-100 text-yellow-700',
    poor: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.first_name}! 👨‍🏫
        </h1>
        <p className="text-green-100">
          Here's your teaching schedule and pending tasks for today
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

      {/* Two Column Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Today's Teaching Schedule */}
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
                      <p className="text-sm font-semibold">Class {classItem.class} - {classItem.subject}</p>
                      <Badge variant="outline" className={`text-xs ${statusColors[classItem.status as keyof typeof statusColors]}`}>
                        {classItem.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">Room {classItem.room} • {classItem.students} students</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Today's Attendance
            </CardTitle>
            <CardDescription>Class-wise attendance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceOverview.map((attendance, index) => (
                <div key={index} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">Class {attendance.class}</p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${attendanceStatusColors[attendance.status as keyof typeof attendanceStatusColors]}`}
                    >
                      {attendance.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Present: {attendance.present}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Absent: {attendance.absent}
                    </span>
                    <span className="text-gray-500">Total: {attendance.total}</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        attendance.percentage >= 95 ? 'bg-green-500' :
                        attendance.percentage >= 90 ? 'bg-blue-500' :
                        attendance.percentage >= 80 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${attendance.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout - Exams & Grading */}
      <div className="grid gap-4 md:grid-cols-2">
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
              {upcomingExams.map((exam, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold">Class {exam.class} - {exam.subject}</p>
                      <Badge variant="secondary" className="text-xs">{exam.totalMarks} Marks</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {exam.duration}
                      </span>
                      <Badge variant="outline" className="text-xs">{exam.type}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Grading */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award size={20} />
              Pending Grading
            </CardTitle>
            <CardDescription>Papers to evaluate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingGrading.map((grading, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold">Class {grading.class}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          grading.priority === 'high' ? 'border-red-500 text-red-500' :
                          grading.priority === 'medium' ? 'border-yellow-500 text-yellow-500' :
                          'border-green-500 text-green-500'
                        }`}
                      >
                        {grading.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{grading.task} • {grading.subject}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{grading.count} papers</span>
                      <span className="text-xs text-gray-500">
                        Due: {new Date(grading.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
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
