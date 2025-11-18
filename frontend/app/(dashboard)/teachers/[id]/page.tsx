'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, GraduationCap, Edit } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const teacher = {
    id: params.id,
    name: 'Mr. Rajesh Sharma',
    employeeId: 'EMP001',
    department: 'Science',
    designation: 'Senior Teacher',
    email: 'rajesh.sharma@school.com',
    phone: '+91 98765 43210',
    address: '456 Park Avenue, New Delhi, 110002',
    dateOfJoining: '2015-06-01',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    qualification: 'M.Sc. Physics, B.Ed.',
    experience: '10 years',
    status: 'Active',
    avatar: '/avatars/teacher.jpg',
  };

  const subjects = [
    { class: '10-A', subject: 'Physics', periods: 6 },
    { class: '10-B', subject: 'Physics', periods: 6 },
    { class: '9-A', subject: 'Physics', periods: 5 },
  ];

  const schedule = [
    { day: 'Monday', periods: ['10-A Physics', 'Free', '10-B Physics', '9-A Physics', 'Free', 'Lab'] },
    { day: 'Tuesday', periods: ['10-A Physics', '10-B Physics', 'Free', '9-A Physics', 'Lab', 'Free'] },
  ];

  const performance = {
    totalClasses: 156,
    conducted: 152,
    percentage: 97.4,
    avgStudentScore: 78.5,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={teacher.avatar} />
            <AvatarFallback className="text-2xl">{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{teacher.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-600 dark:text-gray-400">
              <span>ID: <strong>{teacher.employeeId}</strong></span>
              <span>•</span>
              <span>{teacher.designation}</span>
              <span>•</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded text-sm">
                {teacher.status}
              </span>
            </div>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/teachers/${teacher.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Taught</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{subjects.length}</div>
            <p className="text-xs text-gray-500">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{performance.percentage}%</div>
            <p className="text-xs text-gray-500">{performance.conducted}/{performance.totalClasses} classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Student Score</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{performance.avgStudentScore}%</div>
            <p className="text-xs text-gray-500">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
            <User className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{teacher.experience.split(' ')[0]}</div>
            <p className="text-xs text-gray-500">years of teaching</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">Subjects & Classes</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Employee ID</p>
                    <p className="font-medium">{teacher.employeeId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{new Date(teacher.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{teacher.gender}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Qualification</p>
                    <p className="font-medium">{teacher.qualification}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{teacher.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{teacher.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{teacher.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{teacher.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Designation</p>
                  <p className="font-medium">{teacher.designation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Joining</p>
                  <p className="font-medium">{new Date(teacher.dateOfJoining).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">{teacher.experience}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Subjects & Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subjects.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{item.subject}</p>
                      <p className="text-sm text-gray-500">Class {item.class}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{item.periods}</p>
                      <p className="text-sm text-gray-500">periods/week</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedule.map((day, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold mb-2">{day.day}</h4>
                    <div className="grid grid-cols-6 gap-2">
                      {day.periods.map((period, pidx) => (
                        <div key={pidx} className={`p-2 rounded text-center text-sm ${
                          period === 'Free' ? 'bg-gray-100 dark:bg-gray-800 text-gray-500' : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                        }`}>
                          {period}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Classes Conducted</p>
                  <p className="text-2xl font-bold text-blue-600">{performance.conducted}/{performance.totalClasses}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
                  <p className="text-2xl font-bold text-green-600">{performance.percentage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
