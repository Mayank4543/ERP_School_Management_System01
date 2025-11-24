'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfileImage from '@/components/shared/ProfileImage';
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
      const teacher = await teachersService.getById(params.id as string);
      setTeacher(teacher);
    } catch (error: any) {
      console.error('Error fetching teacher:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch teacher details');
      router.push('/dashboard/teachers');
    } finally {
      setLoading(false);
    }
  };

  // Generate subjects data from teacher's subjects array
  const generateSubjectsData = (teacher: Teacher) => {
    if (!teacher.subjects || teacher.subjects.length === 0) {
      return [];
    }


    return teacher.subjects.map((subject, index) => ({
      class: `Class-${index + 9}`, // Generate class names like Class-9, Class-10, etc.
      subject: subject,
      periods: Math.floor(Math.random() * 3) + 4, // Random periods between 4-6
    }));
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
          <ProfileImage
            src={teacher.profile_picture}
            alt={fullName}
            fallbackText={fullName}
            size="xl"
            className="border-4 border-white shadow-lg"
          />
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
            <div className="text-2xl font-bold text-purple-600">{teacher.subjects?.length || 0}</div>
            <p className="text-xs text-gray-500">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">--</div>
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
              {teacher.subjects && teacher.subjects.length > 0 ? (
                <div className="space-y-3">
                  {teacher.subjects.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div>
                        <p className="font-semibold">{typeof item === 'object' ? item.name : item}</p>
                        <p className="text-sm text-gray-500">Subject</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">--</p>
                        <p className="text-sm text-gray-500">periods/week</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No subjects assigned yet</p>
                  <p className="text-sm text-gray-400 mt-2">Subjects will be displayed here once assigned to this teacher.</p>
                </div>
              )}
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
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Schedule not available</p>
                <p className="text-sm text-gray-400 mt-2">Teacher schedule will be displayed here once configured.</p>
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
                    <p className="text-2xl font-bold text-blue-600">--/--</p>
                    <p className="text-xs text-gray-500">This academic year</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
                    <p className="text-2xl font-bold text-green-600">--%</p>
                    <p className="text-xs text-gray-500">No data available</p>
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
                    <p className="text-2xl font-bold text-purple-600">--%</p>
                    <p className="text-xs text-gray-500">No data available</p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                    <p className="text-2xl font-bold text-orange-600">--</p>
                    <p className="text-xs text-gray-500">No data available</p>
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
