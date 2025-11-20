'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfileImage from '@/components/shared/ProfileImage';
import { ArrowLeft, Edit, Trash2, Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import studentsService from '@/lib/api/services/students.service';
import sectionsService from '@/lib/api/services/sections.service';
import { useAuth } from '@/contexts/AuthContext';

interface StudentData {
  _id: string;
  user_id: any;
  section_id: any;
  academic_year_id: any;
  admission_no: string;
  roll_no: string;
  standard: number;
  admission_date: string;
  blood_group?: string;
  religion?: string;
  caste?: string;
  category?: string;
  mother_tongue?: string;
  nationality?: string;
  previous_school?: string;
  father_name?: string;
  mother_name?: string;
  parent_contact?: string;
  parent_email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function StudentViewPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [sectionName, setSectionName] = useState<string>('Unknown');

  useEffect(() => {
    if (params?.id) {
      fetchStudentData(params.id as string);
    }
  }, [params?.id]);

  const fetchStudentData = async (id: string) => {
    try {
      setLoading(true);
      const student = await studentsService.getById(id);
      console.log('Fetched student:', student);
      setStudentData(student);
      
      // Get section name from frontend service since sections are mock data
      if (student.section_id) {
        try {
          const section = await sectionsService.getById(student.section_id as string);
          setSectionName(section?.name || 'Unknown');
        } catch (error) {
          console.warn('Failed to fetch section name:', error);
          setSectionName('Unknown');
        }
      }
    } catch (error: any) {
      console.error('Failed to fetch student:', error);
      toast.error('Failed to fetch student data');
      router.push('/dashboard/students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await studentsService.delete(params.id as string);
      toast.success('Student deleted successfully');
      router.push('/dashboard/students');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete student');
    }
  };

  const copyPassword = async () => {
    if (!studentData) return;
    
    const password = `Student@${studentData.admission_no}`;
    try {
      await navigator.clipboard.writeText(password);
      setPasswordCopied(true);
      toast.success('Password copied to clipboard!');
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy password');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!studentData) {
    return null;
  }

  const userName = typeof studentData.user_id === 'object' ? studentData.user_id?.name : 'N/A';
  const userEmail = typeof studentData.user_id === 'object' ? studentData.user_id?.email : 'N/A';
  const userMobile = typeof studentData.user_id === 'object' ? studentData.user_id?.mobile_no : 'N/A';
  
  // Get data from user profile
  const userProfile = typeof studentData.user_id === 'object' ? studentData.user_id?.profile : null;
  const userGender = userProfile?.gender || 'N/A';
  const userDOB = userProfile?.date_of_birth || null;
  
  const academicYear = typeof studentData.academic_year_id === 'object' ? studentData.academic_year_id?.name : 'N/A';
  
  const initials = userName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'ST';
  const defaultPassword = `Student@${studentData.admission_no}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Student Details</h1>
            <p className="text-gray-500">View student information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/students/${params.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <ProfileImage
                src={typeof studentData.user_id === 'object' ? studentData.user_id?.profile_picture : null}
                alt={userName}
                fallbackText={userName}
                size="xl"
                className="mb-4"
              />
              <h2 className="text-2xl font-bold">{userName}</h2>
              <p className="text-gray-500">{userEmail}</p>
              <Badge className="mt-2" variant={studentData.is_active ? 'default' : 'secondary'}>
                {studentData.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Admission Number</p>
                <p className="font-semibold">{studentData.admission_no}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Roll Number</p>
                <p className="font-semibold">{studentData.roll_no}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-semibold">Class {studentData.standard} - {sectionName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Academic Year</p>
                <p className="font-semibold">{academicYear}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Login Credentials */}
          <Card>
            <CardHeader>
              <CardTitle>Login Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Default Password</p>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                      {defaultPassword}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyPassword}
                      className="h-8"
                    >
                      {passwordCopied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Note: This is the default password format. The student may have changed it.
              </p>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-semibold">{userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-semibold capitalize">{userGender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-semibold">
                    {userDOB ? new Date(userDOB).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood Group</p>
                  <p className="font-semibold">{studentData.blood_group || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Religion</p>
                  <p className="font-semibold">{studentData.religion || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Caste</p>
                  <p className="font-semibold">{studentData.caste || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold">{studentData.category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mother Tongue</p>
                  <p className="font-semibold">{studentData.mother_tongue || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nationality</p>
                  <p className="font-semibold">{studentData.nationality || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile Number</p>
                  <p className="font-semibold">{userMobile}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Admission Date</p>
                  <p className="font-semibold">
                    {new Date(studentData.admission_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Previous School</p>
                  <p className="font-semibold">{studentData.previous_school || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parent/Guardian Information */}
          <Card>
            <CardHeader>
              <CardTitle>Parent/Guardian Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Father Name</p>
                  <p className="font-semibold">{studentData.father_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mother Name</p>
                  <p className="font-semibold">{studentData.mother_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Parent Contact</p>
                  <p className="font-semibold">{studentData.parent_contact || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Parent Email</p>
                  <p className="font-semibold">{studentData.parent_email || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
