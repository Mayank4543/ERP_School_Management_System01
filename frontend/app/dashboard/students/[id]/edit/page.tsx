'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X, Loader2, ArrowLeft, Upload, Camera } from 'lucide-react';
import { toast } from 'sonner';
import studentsService from '@/lib/api/services/students.service';
import sectionsService from '@/lib/api/services/sections.service';
import { type Section } from '@/types/academic';
import usersService from '@/lib/api/services/users.service';
import apiClient from '@/lib/api/client';

interface StudentEditData {
  _id: string;
  user_id: any;
  section_id: any;
  admission_no: string;
  roll_no?: string;
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
  status?: 'active' | 'inactive' | 'transferred' | 'graduated';
}

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [studentData, setStudentData] = useState<StudentEditData | null>(null);
  const [profileImage, setProfileImage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    // Academic Information
    roll_no: '',
    standard: '',
    section: '',
    admission_date: '',
    status: 'active',

    // Personal Information
    first_name: '',
    last_name: '',
    email: '',
    mobile_no: '',
    gender: '',
    date_of_birth: '',
    blood_group: '',
    religion: '',
    caste: '',
    category: '',
    mother_tongue: '',
    nationality: '',
    previous_school: '',

    // Parent Information
    father_name: '',
    mother_name: '',
    parent_contact: '',
    parent_email: '',

    // Login Credentials (Read-only display)
    username: '',
    default_password: '',
  });

  useEffect(() => {
    if (params?.id) {
      fetchStudentData(params.id as string);
    }
  }, [params?.id]);

  useEffect(() => {
    if (formData.standard) {
      loadSections(parseInt(formData.standard));
    }
  }, [formData.standard]);

  const fetchStudentData = async (id: string) => {
    try {
      setFetching(true);
      const student = await studentsService.getById(id);
      console.log('Fetched student for edit:', student);

      setStudentData(student);

      // Set profile image
      const userProfileImage = (student.user_id && typeof student.user_id === 'object' && 'profile_picture' in student.user_id) ? (student.user_id as any).profile_picture : '';
      console.log('📸 Profile image URL:', userProfileImage);
      console.log('👤 Full student data:', student);
      console.log('👤 User data:', student.user_id);
      setProfileImage(userProfileImage || '');

      const sectionName = (student.section_id && typeof student.section_id === 'object' && 'name' in student.section_id) ? (student.section_id as any).name : '';

      // Get profile data from user.profile if available
      const userProfile = (student.user_id && typeof student.user_id === 'object' && 'profile' in student.user_id && (student.user_id as any).profile) ? (student.user_id as any).profile : null;
      const userData = (student.user_id && typeof student.user_id === 'object') ? (student.user_id as any) : null;

      setFormData({
        // Academic Information
        roll_no: student.roll_no,
        standard: student.standard.toString(),
        section: sectionName,
        admission_date: student.admission_date ? new Date(student.admission_date).toISOString().split('T')[0] : '',
        status: student.status || 'active',

        // Personal Information
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
        email: userData?.email || '',
        mobile_no: userData?.mobile_no || userData?.phone || '',
        gender: userProfile?.gender || '',
        date_of_birth: userProfile?.date_of_birth ? new Date(userProfile.date_of_birth).toISOString().split('T')[0] : '',
        blood_group: userProfile?.blood_group || student.blood_group || 'none',
        religion: userProfile?.religion || student.religion || '',
        caste: student.caste || '',
        category: student.category || '',
        mother_tongue: student.mother_tongue || '',
        nationality: userProfile?.nationality || student.nationality || '',
        previous_school: student.previous_school || '',

        // Parent Information
        father_name: (student as any).father_name || '',
        mother_name: (student as any).mother_name || '',
        parent_contact: (student as any).parent_contact || '',
        parent_email: (student as any).parent_email || '',

        // Login Credentials (Read-only)
        username: userData?.email || userData?.username || student.admission_no,
        default_password: `Student@${student.admission_no}`,
      });
    } catch (error: any) {
      console.error('Failed to fetch student:', error);
      toast.error('Failed to fetch student data');
      router.push('/dashboard/students');
    } finally {
      setFetching(false);
    }
  };

  const loadSections = async (standard: number) => {
    try {
      const sectionsData = await sectionsService.getByStandard(standard);
      setSections(sectionsData);
    } catch (error) {
      console.error('Failed to load sections:', error);
      setSections([]);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async () => {
    if (!selectedFile || !studentData) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Use the apiClient for proper authentication and base URL
      const response = await apiClient.post('/upload/image?type=profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return response.data.data.imageUrl;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Image upload error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload image';
      toast.error(errorMessage);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const updateProfileImageOnly = async () => {
    if (!selectedFile || !studentData || typeof studentData.user_id !== 'object') return;

    try {
      const imageUrl = await uploadProfileImage();
      if (!imageUrl) return;

      await usersService.update(studentData.user_id._id, {
        profile_picture: imageUrl
      });

      // Update the local state to show the new image immediately
      setStudentData(prev => prev ? ({
        ...prev,
        user_id: {
          ...prev.user_id as any,
          profile_picture: imageUrl
        }
      }) : null);

      // Clear the selected file and reset to show the updated image
      setSelectedFile(null);
      setProfileImage(imageUrl);

      toast.success('Profile image updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile image:', error);
      toast.error('Failed to update profile image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData) return;

    setLoading(true);
    try {
      const selectedSection = sections.find(s => s.name === formData.section);
      if (!selectedSection) {
        toast.error('Please select a valid section');
        return;
      }

      // Upload image if a new one is selected
      let imageUrl = null;
      if (selectedFile) {
        imageUrl = await uploadProfileImage();
        if (!imageUrl) {
          setLoading(false);
          return;
        }
      }

      // Update student academic data and parent information
      const studentUpdateData = {
        roll_no: formData.roll_no,
        standard: parseInt(formData.standard),
        section_id: selectedSection._id,
        admission_date: formData.admission_date, // Keep as string
        blood_group: formData.blood_group === 'none' ? undefined : formData.blood_group || undefined,
        religion: formData.religion || undefined,
        caste: formData.caste || undefined,
        category: formData.category || undefined,
        mother_tongue: formData.mother_tongue || undefined,
        nationality: formData.nationality || undefined,
        previous_school: formData.previous_school || undefined,
        status: formData.status as 'active' | 'inactive' | 'transferred' | 'graduated',
        // Parent Information
        father_name: formData.father_name || undefined,
        mother_name: formData.mother_name || undefined,
        parent_contact: formData.parent_contact || undefined,
        parent_email: formData.parent_email || undefined,
      };

      await studentsService.update(params.id as string, studentUpdateData);

      // Update user and user profile data
      if (typeof studentData.user_id === 'object' && studentData.user_id?._id) {
        try {
          const userUpdateData: any = {};

          // Update basic user information
          if (formData.first_name !== (studentData.user_id.first_name || '')) {
            userUpdateData.first_name = formData.first_name;
          }
          if (formData.last_name !== (studentData.user_id.last_name || '')) {
            userUpdateData.last_name = formData.last_name;
          }
          if (formData.email !== (studentData.user_id.email || '')) {
            userUpdateData.email = formData.email;
          }
          if (formData.mobile_no !== (studentData.user_id.mobile_no || studentData.user_id.phone || '')) {
            userUpdateData.mobile_no = formData.mobile_no;
          }

          // Add profile image if uploaded
          if (imageUrl) {
            userUpdateData.profile_picture = imageUrl;
          }

          // Add profile fields that should be stored in user profile
          const profileFieldsToUpdate: any = {};
          if (formData.gender) {
            profileFieldsToUpdate.gender = formData.gender;
          }
          if (formData.date_of_birth) {
            profileFieldsToUpdate.date_of_birth = new Date(formData.date_of_birth);
          }
          if (formData.blood_group && formData.blood_group !== 'none') {
            profileFieldsToUpdate.blood_group = formData.blood_group;
          }
          if (formData.religion) {
            profileFieldsToUpdate.religion = formData.religion;
          }
          if (formData.nationality) {
            profileFieldsToUpdate.nationality = formData.nationality;
          }

          // If there are profile fields to update, add them
          if (Object.keys(profileFieldsToUpdate).length > 0) {
            userUpdateData.profile = profileFieldsToUpdate;
          }

          // Only update if there's something to update
          if (Object.keys(userUpdateData).length > 0) {
            await usersService.update(studentData.user_id._id, userUpdateData);
          }

          // Update the local state to show the new image immediately
          if (imageUrl) {
            setStudentData(prev => ({
              ...prev!,
              user_id: {
                ...prev!.user_id as any,
                profile_picture: imageUrl
              }
            }));

            // Clear the selected file and reset to show the updated image
            setSelectedFile(null);
            setProfileImage(imageUrl);
          }

          toast.success('Student and profile updated successfully');
        } catch (userError) {
          console.error('Failed to update user profile:', userError);
          toast.success('Student updated successfully, but failed to update profile');
        }
      } else {
        toast.success('Student updated successfully');
      }

      router.push(`/dashboard/students/${params.id}`);
    } catch (error: any) {
      console.error('Failed to update student:', error);
      toast.error(error.response?.data?.message || 'Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!studentData) {
    return null;
  }

  const userName = typeof studentData.user_id === 'object' ? studentData.user_id?.name : 'Student';

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Student</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Editing: {userName} ({studentData.admission_no})
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-4 border-white shadow-lg">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={userName}
                      className="w-full h-full object-cover object-center"
                      style={{
                        width: '100%',
                        height: '100%',
                        aspectRatio: '1/1',
                        objectPosition: 'center center',
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }}
                      onError={(e) => {
                        console.warn('Failed to load profile image:', profileImage);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg"
                  title="Click to change profile image"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="text-center">
                <h3 className="font-medium text-gray-900 dark:text-white">{userName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Admission No: {studentData.admission_no}</p>
              </div>
              {selectedFile && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    New image selected: {selectedFile.name}
                  </p>
                  <Button
                    type="button"
                    onClick={updateProfileImageOnly}
                    disabled={uploadingImage}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Image...
                      </>
                    ) : (
                      'Update Image Only'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  value={formData.mobile_no}
                  onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number *</Label>
                <Input
                  id="rollNo"
                  value={formData.roll_no}
                  onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Select
                  value={formData.standard}
                  onValueChange={(value) => setFormData({ ...formData, standard: value, section: '' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((cls) => (
                      <SelectItem key={cls} value={cls.toString()}>Class {cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Section *</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => setFormData({ ...formData, section: value })}
                  disabled={!formData.standard}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.standard ? "Select section" : "Select class first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section._id} value={section.name}>
                        Section {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={formData.admission_date}
                  onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Student Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active (Can access dashboard)</SelectItem>
                    <SelectItem value="inactive">Inactive (Dashboard access disabled)</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select
                  value={formData.blood_group}
                  onValueChange={(value) => setFormData({ ...formData, blood_group: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="religion">Religion</Label>
                <Input
                  id="religion"
                  value={formData.religion}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="caste">Caste</Label>
                <Input
                  id="caste"
                  value={formData.caste}
                  onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., General, OBC, SC, ST"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motherTongue">Mother Tongue</Label>
                <Input
                  id="motherTongue"
                  value={formData.mother_tongue}
                  onChange={(e) => setFormData({ ...formData, mother_tongue: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousSchool">Previous School</Label>
                <Input
                  id="previousSchool"
                  value={formData.previous_school}
                  onChange={(e) => setFormData({ ...formData, previous_school: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parent Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Parent Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input
                  id="fatherName"
                  value={formData.father_name}
                  onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motherName">Mother's Name</Label>
                <Input
                  id="motherName"
                  value={formData.mother_name}
                  onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentContact">Parent Contact Number</Label>
                <Input
                  id="parentContact"
                  value={formData.parent_contact}
                  onChange={(e) => setFormData({ ...formData, parent_contact: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentEmail">Parent Email</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  value={formData.parent_email}
                  onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login Credentials */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Login Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username/Email (Read-only)</Label>
                <Input
                  id="username"
                  value={formData.username}
                  readOnly
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">Student uses email/admission number to login</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultPassword">Default Password (Read-only)</Label>
                <Input
                  id="defaultPassword"
                  type="text"
                  value={formData.default_password}
                  readOnly
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">Student may have changed this password</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex justify-end gap-3 pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploadingImage}>
                {loading || uploadingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploadingImage ? 'Uploading Image...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
