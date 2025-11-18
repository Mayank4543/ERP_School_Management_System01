'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  TrendingUp,
  Award,
  DollarSign,
  Bell,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ParentDashboard() {
  const { user } = useAuth();

  // Parent's Children List
  const children = [
    {
      id: '1',
      name: 'Raj Kumar',
      class: '10-A',
      rollNo: '15',
      photo: null,
      attendance: 94.5,
      avgScore: 87.5,
      rank: 5,
      pendingFees: 10000,
      status: 'active',
    },
    {
      id: '2',
      name: 'Priya Kumar',
      class: '8-B',
      rollNo: '22',
      photo: null,
      attendance: 96.2,
      avgScore: 92.3,
      rank: 2,
      pendingFees: 0,
      status: 'active',
    },
  ];

  const [selectedChild, setSelectedChild] = useState(children[0]);

  // Selected Child's Stats
  const childStats = [
    {
      title: 'Attendance',
      value: `${selectedChild.attendance}%`,
      change: '+2.1%',
      trend: 'up',
      icon: Calendar,
      color: 'blue',
      description: 'Last 30 days',
    },
    {
      title: 'Average Score',
      value: `${selectedChild.avgScore}%`,
      change: '+5.2%',
      trend: 'up',
      icon: Award,
      color: 'green',
      description: 'Overall performance',
    },
    {
      title: 'Class Rank',
      value: `#${selectedChild.rank}`,
      change: 'of 45',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple',
      description: 'Current standing',
    },
    {
      title: 'Pending Fees',
      value: `₹${selectedChild.pendingFees.toLocaleString()}`,
      change: selectedChild.pendingFees === 0 ? 'Paid' : 'Due soon',
      trend: selectedChild.pendingFees === 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'orange',
      description: selectedChild.pendingFees === 0 ? 'All clear' : 'Pay before Dec 1',
    },
  ];

  // Today's Schedule for Selected Child
  const todaySchedule = [
    { time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Mr. Sharma', room: '101' },
    { time: '10:00 - 11:00', subject: 'English', teacher: 'Ms. Gupta', room: '102' },
    { time: '11:15 - 12:15', subject: 'Physics', teacher: 'Dr. Kumar', room: '201' },
    { time: '12:15 - 01:15', subject: 'Chemistry', teacher: 'Ms. Patel', room: '202' },
  ];

  // Recent Grades
  const recentGrades = [
    { subject: 'Mathematics', topic: 'Algebra Test', marks: '85/100', grade: 'A', date: '2025-11-10', percentage: 85 },
    { subject: 'English', topic: 'Grammar Quiz', marks: '92/100', grade: 'A+', date: '2025-11-08', percentage: 92 },
    { subject: 'Physics', topic: 'Mechanics Test', marks: '78/100', grade: 'B+', date: '2025-11-05', percentage: 78 },
    { subject: 'Chemistry', topic: 'Lab Report', marks: '88/100', grade: 'A', date: '2025-11-03', percentage: 88 },
  ];

  // Attendance Details (Last 7 days)
  const attendanceDetails = [
    { date: '2025-11-17', day: 'Mon', status: 'present' },
    { date: '2025-11-16', day: 'Sun', status: 'holiday' },
    { date: '2025-11-15', day: 'Sat', status: 'holiday' },
    { date: '2025-11-14', day: 'Fri', status: 'present' },
    { date: '2025-11-13', day: 'Thu', status: 'present' },
    { date: '2025-11-12', day: 'Wed', status: 'absent' },
    { date: '2025-11-11', day: 'Tue', status: 'present' },
  ];

  // Fee Details
  const feeDetails = [
    { month: 'November 2025', amount: 10000, status: 'pending', dueDate: '2025-12-01' },
    { month: 'October 2025', amount: 10000, status: 'paid', paidDate: '2025-10-05' },
    { month: 'September 2025', amount: 10000, status: 'paid', paidDate: '2025-09-03' },
  ];

  // Notifications
  const notifications = [
    { type: 'event', title: 'Parent-Teacher Meeting', message: 'Scheduled for November 20, 2025 at 10:00 AM', time: '2 hours ago', priority: 'high' },
    { type: 'fee', title: 'Fee Reminder', message: 'November month fee due on December 1st', time: '1 day ago', priority: 'medium' },
    { type: 'exam', title: 'Mid-term Exams', message: 'Starting from November 25, 2025', time: '2 days ago', priority: 'high' },
    { type: 'grade', title: 'New Grades Published', message: 'Mathematics test results available', time: '3 days ago', priority: 'low' },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
  };

  const attendanceStatusColors = {
    present: 'bg-green-500',
    absent: 'bg-red-500',
    late: 'bg-yellow-500',
    holiday: 'bg-gray-300',
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.first_name}! 👪
        </h1>
        <p className="text-orange-100">
          Monitor your children's academic progress and activities
        </p>
      </div>

      {/* Children Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Your Children
          </CardTitle>
          <CardDescription>Select a child to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {children.map((child) => (
              <div
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedChild.id === child.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Avatar className="h-16 w-16">
                  <AvatarImage src={child.photo || undefined} />
                  <AvatarFallback className="bg-blue-600 text-white text-lg">
                    {child.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{child.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Class {child.class} • Roll No: {child.rollNo}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      Attendance: {child.attendance}%
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Rank: #{child.rank}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Child Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {childStats.map((stat, index) => {
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
                  ) : stat.trend === 'down' ? (
                    <AlertCircle size={14} className="text-orange-500 mr-1" />
                  ) : null}
                  <span className={stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-orange-500' : 'text-gray-500'}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs for Detailed Information */}
      <Tabs defaultValue="academic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Academic Tab */}
        <TabsContent value="academic" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen size={20} />
                  Today's Schedule
                </CardTitle>
                <CardDescription>Class {selectedChild.class} timetable</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaySchedule.map((classItem, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="flex-shrink-0">
                        <div className="text-sm font-medium">{classItem.time.split(' - ')[0]}</div>
                        <div className="text-xs text-gray-500">{classItem.time.split(' - ')[1]}</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{classItem.subject}</p>
                        <p className="text-xs text-gray-500">{classItem.teacher} • Room {classItem.room}</p>
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
                <CardDescription>Latest 4 assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentGrades.map((grade, index) => (
                    <div key={index} className="p-3 rounded-lg border">
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
                        <span className="text-sm font-medium">{grade.marks}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(grade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} />
                Attendance Record
              </CardTitle>
              <CardDescription>Last 7 days attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {attendanceDetails.map((attendance, index) => (
                  <div key={index} className="flex flex-col items-center p-3 rounded-lg border">
                    <div className="text-xs text-gray-500 mb-2">{attendance.day}</div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      attendanceStatusColors[attendance.status as keyof typeof attendanceStatusColors]
                    }`}>
                      {attendance.status === 'present' && <span className="text-white text-xl">✓</span>}
                      {attendance.status === 'absent' && <span className="text-white text-xl">✗</span>}
                      {attendance.status === 'holiday' && <span className="text-white text-xl">-</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(attendance.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-6 mt-6 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <span className="text-sm">Holiday</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fees Tab */}
        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign size={20} />
                Fee Details
              </CardTitle>
              <CardDescription>Payment history and pending fees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {feeDetails.map((fee, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{fee.month}</p>
                      <p className="text-xs text-gray-500">
                        {fee.status === 'paid' 
                          ? `Paid on ${new Date(fee.paidDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                          : `Due on ${new Date(fee.dueDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold">₹{fee.amount.toLocaleString()}</span>
                      <Badge 
                        variant={fee.status === 'paid' ? 'secondary' : 'destructive'}
                        className={fee.status === 'paid' ? 'bg-green-100 text-green-700' : ''}
                      >
                        {fee.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} />
                Notifications
              </CardTitle>
              <CardDescription>Important updates and announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold">{notification.title}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            notification.priority === 'high' ? 'border-red-500 text-red-500' :
                            notification.priority === 'medium' ? 'border-yellow-500 text-yellow-500' :
                            'border-green-500 text-green-500'
                          }`}
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{notification.message}</p>
                      <span className="text-xs text-gray-500 mt-1 inline-block">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
