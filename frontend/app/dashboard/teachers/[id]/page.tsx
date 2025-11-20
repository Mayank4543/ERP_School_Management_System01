'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, GraduationCap, Edit, ArrowLeft, Building2, Clock, Award } from 'lucide-react';
import Link from 'next/link';
import { Teacher } from '@/types';
import teachersService from '@/lib/api/services/teachers.service';
import { toast } from 'sonner';

export default function TeacherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchTeacher();
  }, [params.id]);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      const response = await teachersService.getById(params.id as string);
      setTeacher(response);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch teacher details');
      router.push('/dashboard/teachers');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for features not yet implemented
  const mockData = {
    subjects: [
      { class: '10-A', subject: 'Physics', periods: 6 },
      { class: '10-B', subject: 'Physics', periods: 6 },
      { class: '9-A', subject: 'Physics', periods: 5 },
    ],
    schedule: [
      { day: 'Monday', periods: ['10-A Physics', 'Free', '10-B Physics', '9-A Physics', 'Free', 'Lab'] },
      { day: 'Tuesday', periods: ['10-A Physics', '10-B Physics', 'Free', '9-A Physics', 'Lab', 'Free'] },
      { day: 'Wednesday', periods: ['Free', '10-A Physics', '10-B Physics', 'Free', '9-A Physics', 'Lab'] },
      { day: 'Thursday', periods: ['10-B Physics', 'Free', '10-A Physics', '9-A Physics', 'Free', 'Free'] },
      { day: 'Friday', periods: ['Lab', '10-A Physics', 'Free', '10-B Physics', '9-A Physics', 'Free'] },
    ],
    performance: {
      totalClasses: 156,
      conducted: 152,
      percentage: 97.4,
      avgStudentScore: 78.5,
      studentsCount: 120,
    },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Teacher not found</p>
      </div>
    );
  }

  const fullName = `${teacher.first_name} ${teacher.middle_name ? teacher.middle_name + ' ' : ''}${teacher.last_name}`;
  const initials = `${teacher.first_name[0]}${teacher.last_name[0]}`;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Teachers
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={teacher.profile_picture} />
            <AvatarFallback className="text-2xl bg-blue-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{fullName}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-600 dark:text-gray-400">
              <span>ID: <strong>{teacher.employee_id}</strong></span>
              <span>•</span>
              <span>{teacher.designation || 'Teacher'}</span>
              <span>•</span>
              <Badge variant={teacher.is_active ? 'default' : 'secondary'} 
                     className={teacher.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {teacher.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {teacher.department || 'Not Assigned'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Joined {teacher.joining_date ? new Date(teacher.joining_date).toLocaleDateString('en-IN') : 'N/A'}
              </span>
            </div>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/teachers/${teacher._id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{teacher.subjects?.length || 0}</div>
            <p className="text-xs text-gray-500">Teaching subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{teacher.experience_years || 0}</div>
            <p className="text-xs text-gray-500">years of teaching</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{mockData.subjects.length}</div>
            <p className="text-xs text-gray-500">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{mockData.performance.percentage}%</div>
            <p className="text-xs text-gray-500">attendance rate</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Employee ID</p>
                    <p className="font-medium">{teacher.employee_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">
                      {teacher.date_of_birth ? new Date(teacher.date_of_birth).toLocaleDateString('en-IN') : 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium capitalize">{teacher.gender || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <p className="font-medium">{teacher.blood_group || 'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {teacher.address && (
                        <>
                          {teacher.address}<br />
                          {teacher.city && `${teacher.city}, `}
                          {teacher.state && `${teacher.state} `}
                          {teacher.pincode && `- ${teacher.pincode}`}<br />
                          {teacher.country}
                        </>
                      ) || 'Not provided'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{teacher.department || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Designation</p>
                  <p className="font-medium">{teacher.designation || 'Teacher'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Qualification</p>
                  <p className="font-medium">{teacher.qualification || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">{teacher.experience_years ? `${teacher.experience_years} years` : 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Joining</p>
                  <p className="font-medium">
                    {teacher.joining_date ? new Date(teacher.joining_date).toLocaleDateString('en-IN') : 'Not provided'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subjects taught */}
          {teacher.subjects && teacher.subjects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Subjects Taught</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects.map((subject, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-800">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Subjects & Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockData.subjects.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
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
                {mockData.schedule.map((day, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold mb-3 text-lg">{day.day}</h4>
                    <div className="grid grid-cols-6 gap-2">
                      {day.periods.map((period, pidx) => (
                        <div key={pidx} className={`p-3 rounded-lg text-center text-sm font-medium transition-colors ${
                          period === 'Free' 
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-500' 
                            : period === 'Lab'
                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200'
                            : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Teaching Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Classes Conducted</p>
                    <p className="text-2xl font-bold text-blue-600">{mockData.performance.conducted}/{mockData.performance.totalClasses}</p>
                    <p className="text-xs text-gray-500">This academic year</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
                    <p className="text-2xl font-bold text-green-600">{mockData.performance.percentage}%</p>
                    <p className="text-xs text-gray-500">Excellent attendance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Student Score</p>
                    <p className="text-2xl font-bold text-purple-600">{mockData.performance.avgStudentScore}%</p>
                    <p className="text-xs text-gray-500">Across all subjects</p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                    <p className="text-2xl font-bold text-orange-600">{mockData.performance.studentsCount}</p>
                    <p className="text-xs text-gray-500">Under supervision</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
