'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Edit, Trash2, Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import studentsService from '@/lib/api/services/students.service';
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

      // If section_id is just a string, fetch section data separately
      if (typeof student.section_id === 'string' && student.section_id) {
        try {
          const sectionsService = (await import('@/lib/api/services/sections.service')).default;
          const section = await sectionsService.getById(student.section_id);
          console.log('Fetched section:', section);
          // Replace section_id with populated section object
          student.section_id = section as any;
        } catch (sectionError) {
          console.warn('Failed to fetch section data:', sectionError);
        }
      }

      setStudentData(student);
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

  // Enhanced name extraction logic (matching the working listing page logic)
  let userName = 'N/A';
  let userEmail = 'N/A';
  let userMobile = 'N/A';
  let userProfilePicture = null;

  if (typeof studentData.user_id === 'object' && studentData.user_id) {
    const firstName = studentData.user_id.first_name || '';
    const lastName = studentData.user_id.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();

    // Fallback to email username or name field if full name is not available
    userName = fullName || studentData.user_id.name ||
      (studentData.user_id.email ? studentData.user_id.email.split('@')[0] :
        studentData.admission_no || 'Student');
    userEmail = studentData.user_id.email || 'N/A';
    userMobile = studentData.user_id.mobile_no || studentData.user_id.phone || 'N/A';
    userProfilePicture = studentData.user_id.profile_picture;
  }

  // Get profile information from user.profile
  const userProfile = typeof studentData.user_id === 'object' && studentData.user_id?.profile ? studentData.user_id.profile : null;
  const userGender = userProfile?.gender || 'N/A';
  const userDOB = userProfile?.date_of_birth || null;
  const bloodGroup = userProfile?.blood_group || studentData.blood_group || 'N/A';
  const nationality = userProfile?.nationality || studentData.nationality || 'N/A';
  const religion = userProfile?.religion || studentData.religion || 'N/A';

  const sectionName = typeof studentData.section_id === 'object' ? studentData.section_id?.name : 'Unknown';
  const academicYear = typeof studentData.academic_year_id === 'object' ? studentData.academic_year_id?.year_name : 'N/A';

  // Parent information
  const parents = Array.isArray(studentData.parent_ids) ? studentData.parent_ids : [];
  const fatherName = studentData.father_name || (parents.find((p: any) => p.profile?.gender === 'male') ? `${parents.find((p: any) => p.profile?.gender === 'male')?.first_name} ${parents.find((p: any) => p.profile?.gender === 'male')?.last_name}`.trim() : 'N/A');
  const motherName = studentData.mother_name || (parents.find((p: any) => p.profile?.gender === 'female') ? `${parents.find((p: any) => p.profile?.gender === 'female')?.first_name} ${parents.find((p: any) => p.profile?.gender === 'female')?.last_name}`.trim() : 'N/A');
  const parentContact = studentData.parent_contact || (parents[0]?.phone) || 'N/A';
  const parentEmail = studentData.parent_email || (parents[0]?.email) || 'N/A';

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
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage
                  src={userProfilePicture ?
                    (userProfilePicture.startsWith('http') ? userProfilePicture :
                      userProfilePicture.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${userProfilePicture}` :
                        userProfilePicture) : ''}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{userName}</h2>
              <p className="text-gray-500">{userEmail}</p>
              <div className="flex flex-col items-center gap-2">
                <Badge className="mt-2" variant={studentData.status === 'active' ? 'default' : 'destructive'}>
                  {studentData.status === 'active' ? 'Active' : studentData.status === 'inactive' ? 'Inactive' : (studentData.status || 'Unknown')}
                </Badge>
                <p className="text-xs text-gray-500 text-center">
                  {studentData.status === 'active'
                    ? 'Can access student dashboard'
                    : 'Dashboard access disabled'}
                </p>
              </div>
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
                  <p className="font-semibold">{userName || 'N/A'}</p>
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
                  <p className="font-semibold">{bloodGroup}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Religion</p>
                  <p className="font-semibold">{religion}</p>
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
                  <p className="font-semibold">{nationality}</p>
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

          {/* Parent Information */}
          <Card>
            <CardHeader>
              <CardTitle>Parent Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Father's Name</p>
                  <p className="font-semibold">{fatherName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mother's Name</p>
                  <p className="font-semibold">{motherName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Parent Contact</p>
                  <p className="font-semibold">{parentContact}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Parent Email</p>
                  <p className="font-semibold">{parentEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
