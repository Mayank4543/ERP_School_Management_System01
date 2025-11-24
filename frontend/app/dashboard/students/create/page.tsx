'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X, Upload, Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import studentsService from '@/lib/api/services/students.service';
import usersService from '@/lib/api/services/users.service';
import apiClient from '@/lib/api/client';
import academicService from '@/lib/api/services/academic.service';
import sectionsService from '@/lib/api/services/sections.service';
import { type Section } from '@/types/academic';
import { useAuth } from '@/contexts/AuthContext';

interface CreateStudentData {
  user_id: string;
  school_id: string;
  academic_year_id: string;
  standard: number;
  section_id: string;
  roll_no: string;
  admission_no: string;
  admission_date: Date;
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
}

export default function CreateStudentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentAcademicYear, setCurrentAcademicYear] = useState<any>(null);
  
  // Profile image states
  const [profileImage, setProfileImage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    // User information (for display only, not sent to student API)
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',

    // Student specific (these will be sent to API)
    class: '',
    section: '',
    rollNo: '',
    admissionNo: '',
    admissionDate: '',
    bloodGroup: '',

    // Additional student fields
    religion: '',
    caste: '',
    category: '',
    motherTongue: '',
    nationality: 'Indian',
    previousSchool: '',

    // Parent information
    fatherName: '',
    motherName: '',
    parentPhone: '',
    parentEmail: '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (formData.class) {
      loadSections(parseInt(formData.class));
    }
  }, [formData.class]);

  const loadInitialData = async () => {
    try {
      console.log('🔍 [DEBUG] Loading academic year for user:', user);
      console.log('🔍 [DEBUG] User school_id:', user?.school_id);
      
      if (!user?.school_id) {
        throw new Error('No school ID found in user profile. Please contact administrator.');
      }

      const academicYear = await academicService.getCurrent();
      
      if (academicYear && academicYear._id) {
        setCurrentAcademicYear(academicYear);
        console.log('✅ Loaded academic year from API:', {
          id: academicYear._id,
          name: academicYear.name,
          school_id: academicYear.school_id,
          is_current: academicYear.is_current
        });
      } else {
        throw new Error('No current academic year found for your school. Please contact administrator to set up academic year.');
      }
    } catch (error: any) {
      console.error('❌ Failed to load academic year:', error);
      
      let errorMessage = 'Failed to load academic year information.';
      if (error.response?.status === 401) {
        errorMessage = 'Please login again to access student creation.';
      } else if (error.response?.status === 404) {
        errorMessage = 'No academic year found. Please contact administrator.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setCurrentAcademicYear(null);
    }
  };

  const loadSections = async (standard: number) => {
    try {
      console.log('🔍 [DEBUG] Starting loadSections for standard:', standard);
      console.log('🔍 [DEBUG] Current academic year:', currentAcademicYear);
      console.log('🔍 [DEBUG] Academic year ID:', currentAcademicYear?._id);
      console.log('🔍 [DEBUG] User info:', user);
      console.log('🔍 [DEBUG] User school ID:', user?.school_id);
      
      if (!currentAcademicYear?._id) {
        console.warn('⚠️ [WARNING] No academic year ID available, API call may fail');
      }
      
      console.log('📡 [API] Calling sectionsService.getByStandard with params:', {
        standard,
        academicYearId: currentAcademicYear?._id
      });
      
      const sectionsData = await sectionsService.getByStandard(standard, currentAcademicYear?._id);
      
      console.log('📦 [API RESPONSE] Raw sections data:', sectionsData);
      console.log('📦 [API RESPONSE] Data type:', typeof sectionsData);
      console.log('📦 [API RESPONSE] Is array:', Array.isArray(sectionsData));
      console.log('📦 [API RESPONSE] Data length:', sectionsData?.length);
      
      if (Array.isArray(sectionsData) && sectionsData.length > 0) {
        console.log('✅ [SUCCESS] Sections loaded successfully:', sectionsData.map(s => ({ id: s._id, name: s.name, standard: s.standard })));
      } else if (Array.isArray(sectionsData) && sectionsData.length === 0) {
        console.warn('⚠️ [WARNING] API returned empty sections array for standard:', standard);
        console.warn('⚠️ [WARNING] This might indicate:');
        console.warn('  - No sections exist for this class');
        console.warn('  - Academic year filter is excluding results');
        console.warn('  - Backend API issue');
      } else {
        console.error('❌ [ERROR] Unexpected response format:', sectionsData);
      }
      
      const sectionsArray = Array.isArray(sectionsData) ? sectionsData : [];
      setSections(sectionsArray);
      
      // Reset section selection when class changes
      if (formData.section && !sectionsData.find(s => s.name === formData.section)) {
        console.log('🔄 [INFO] Resetting section selection - previous section not found in new data');
        setFormData(prev => ({ ...prev, section: '' }));
      }
      
      console.log('🎯 [FINAL] Sections state updated:', sectionsArray);
      
    } catch (error: any) {
      console.error('❌ [ERROR] Failed to load sections:', error);
      console.error('❌ [ERROR] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
        params: error.config?.params
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      toast.error(`Failed to load sections: ${errorMessage}`);
      setSections([]);
      setFormData(prev => ({ ...prev, section: '' }));
    }
  };

  const generateAdmissionNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ADM${year}${random}`;
  };

  const isValidObjectId = (id: string) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
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
    if (!selectedFile) return null;
    
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let studentData: CreateStudentData | null = null;

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.dateOfBirth ||
        !formData.gender || !formData.class || !formData.section || !formData.rollNo) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (!formData.rollNo.trim()) {
        toast.error('Roll number is required');
        return;
      }

      if (!currentAcademicYear) {
        toast.error('Academic year not loaded. Please refresh and try again.');
        return;
      }

      if (!user?.school_id) {
        toast.error('School information not available. Please refresh and try again.');
        return;
      }

      // Validate ObjectIds
      if (!isValidObjectId(user.school_id)) {
        throw new Error('Invalid school ID format');
      }

      if (!isValidObjectId(currentAcademicYear._id)) {
        throw new Error('Invalid academic year ID format');
      }

      // Step 1: Create Student
      const selectedSection = sections.find(s => s.name === formData.section);
      if (!selectedSection) {
        throw new Error(`Selected section '${formData.section}' not found`);
      }

      if (!isValidObjectId(selectedSection._id)) {
        throw new Error('Invalid section ID format');
      }

      // For now, let's create a student with a placeholder user_id
      // In a complete implementation, you would create the user first
      const placeholderUserId = '507f1f77bcf86cd799439011'; // Valid ObjectId format

      // Generate admission number if not provided
      const admissionNo = (formData.admissionNo.trim() || generateAdmissionNumber()).toUpperCase();

      // Validate admission number format
      if (!/^[A-Z0-9]+$/.test(admissionNo)) {
        throw new Error('Admission number must contain only uppercase letters and numbers');
      }

      // Create the student data object with ONLY the fields the backend expects
      const studentPayload: CreateStudentData = {
        user_id: placeholderUserId,
        school_id: user.school_id,
        academic_year_id: currentAcademicYear._id,
        standard: parseInt(formData.class),
        section_id: selectedSection._id,
        roll_no: formData.rollNo.trim(),
        admission_no: admissionNo,
        admission_date: new Date(formData.admissionDate || new Date())
      };

      // Add optional fields only if they have values
      if (formData.bloodGroup && formData.bloodGroup !== 'none') {
        studentPayload.blood_group = formData.bloodGroup;
      }
      if (formData.religion.trim()) {
        studentPayload.religion = formData.religion.trim();
      }
      if (formData.caste.trim()) {
        studentPayload.caste = formData.caste.trim();
      }
      if (formData.category.trim()) {
        studentPayload.category = formData.category.trim();
      }
      if (formData.motherTongue.trim()) {
        studentPayload.mother_tongue = formData.motherTongue.trim();
      }
      if (formData.nationality.trim()) {
        studentPayload.nationality = formData.nationality.trim();
      }
      if (formData.previousSchool.trim()) {
        studentPayload.previous_school = formData.previousSchool.trim();
      }

      studentData = studentPayload;

      
      const requiredFields: (keyof CreateStudentData)[] = ['user_id', 'school_id', 'academic_year_id', 'section_id', 'roll_no'];
      const missingFields = requiredFields.filter(field => !studentData![field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Step 1: First create User
      // Generate unique email using roll number to avoid duplicates
      const generatedEmail = formData.email.trim() ||
        `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}.${formData.rollNo.toLowerCase()}@school.edu`;

      // Generate default password using admission number for easy reference
      const defaultPassword = `Student@${admissionNo}`;

      const userData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: generatedEmail,
        password: defaultPassword,
        mobile_no: formData.phone.trim(),
        usergroup_id: 'student',
        school_id: user.school_id,
        is_activated: true,
        roles: ['student']
      };

     
      const newUser = await usersService.create(userData as any);
      
      if (!newUser?._id) {
        throw new Error('Failed to create user account');
      }
      
      // Upload profile image if selected
      let profileImageUrl = null;
      if (selectedFile) {
        profileImageUrl = await uploadProfileImage();
        if (profileImageUrl) {
          // Update user with profile image
          await usersService.update(newUser._id, {
            profile_picture: profileImageUrl
          });
        }
      }
    
      // Step 2: Create User Profile
      try {
        const profileData = {
          school_id: user.school_id,
          firstname: formData.firstName.trim(),
          lastname: formData.lastName.trim(),
          gender: formData.gender ? formData.gender.toLowerCase() : undefined,
          date_of_birth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
          blood_group: formData.bloodGroup === 'none' ? undefined : formData.bloodGroup || undefined,
          nationality: formData.nationality.trim() || 'Indian',
          religion: formData.religion.trim() || undefined,
          caste: formData.caste.trim() || undefined,
          address: formData.address.trim() || undefined,
          pincode: formData.pincode.trim() || undefined,
          status: 'active'
        };

        // Remove undefined fields
        Object.keys(profileData).forEach((key) => {
          if ((profileData as any)[key] === undefined) {
            delete (profileData as any)[key];
          }
        });

       
        await apiClient.post(`/users/${newUser._id}/profile`, profileData);
     
      } catch (profileError: any) {
        console.warn(' Profile creation failed (non-critical):', profileError.message);
        // Continue even if profile fails
      }

      // Step 3: Now create Student record with the NEW user_id
      studentData = {
        user_id: newUser._id,  // Use the newly created user's ID
        school_id: user.school_id,
        academic_year_id: currentAcademicYear._id,
        standard: parseInt(formData.class),
        section_id: selectedSection._id,
        roll_no: formData.rollNo.trim(),
        admission_no: admissionNo,
        admission_date: new Date(formData.admissionDate || new Date())
      };

      // Add optional fields
      if (formData.bloodGroup && formData.bloodGroup !== 'none') studentData.blood_group = formData.bloodGroup;
      if (formData.religion.trim()) studentData.religion = formData.religion.trim();
      if (formData.caste.trim()) studentData.caste = formData.caste.trim();
      if (formData.category.trim()) studentData.category = formData.category.trim();
      if (formData.motherTongue.trim()) studentData.mother_tongue = formData.motherTongue.trim();
      if (formData.nationality.trim()) studentData.nationality = formData.nationality.trim();
      if (formData.previousSchool.trim()) studentData.previous_school = formData.previousSchool.trim();
      
      // Add parent information
      if (formData.fatherName.trim()) studentData.father_name = formData.fatherName.trim();
      if (formData.motherName.trim()) studentData.mother_name = formData.motherName.trim();
      if (formData.parentPhone.trim()) studentData.parent_contact = formData.parentPhone.trim();
      if (formData.parentEmail.trim()) studentData.parent_email = formData.parentEmail.trim();

     
      const student = await studentsService.create(studentData);
     

      
      router.push('/dashboard/students');
    } catch (error: any) {
      console.error(' Student creation failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error config:', error.config);

      let errorMessage = 'Failed to create student';

      // Check if it's a user creation error
      if (error.response?.config?.url?.includes('/users')) {
        errorMessage = 'Failed to create user account: ';
      } else if (error.response?.config?.url?.includes('/students')) {
        errorMessage = 'Failed to create student record: ';
      }

      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          errorMessage += error.response.data.message.join(', ');
        } else {
          errorMessage += error.response.data.message;
        }
      } else if (error.response?.data?.error?.message) {
        if (Array.isArray(error.response.data.error.message)) {
          errorMessage += error.response.data.error.message.join(', ');
        } else {
          errorMessage += error.response.data.error.message;
        }
      } else if (error.message) {
        errorMessage += error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Student</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create a new student profile</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4 mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-4 border-white shadow-lg">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile Preview"
                        className="w-full h-full object-cover object-center"
                        style={{ 
                          aspectRatio: '1/1',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
                        <Upload className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg"
                    title="Click to upload profile image"
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
                {selectedFile && (
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Leave empty to auto-generate"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select value={formData.bloodGroup} onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}>
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

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    placeholder="e.g., Indian"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select 
                    value={formData.class} 
                    onValueChange={(value) => {
                      console.log('Class selected:', value);
                      setFormData({ ...formData, class: value, section: '' });
                    }}
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
                    onValueChange={(value) => {
                      console.log('Section selected:', value);
                      // Only update if it's a valid section (not disabled values)
                      if (value !== "no-class" && value !== "loading") {
                        setFormData({ ...formData, section: value });
                      }
                    }}
                    disabled={!formData.class}
                  >
                    <SelectTrigger id="section">
                      <SelectValue placeholder={formData.class ? "Select section" : "Select class first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {!formData.class && (
                        <SelectItem value="no-class" disabled>
                          Select class first
                        </SelectItem>
                      )}
                      {formData.class && sections.length === 0 && (
                        <SelectItem value="loading" disabled>
                          Loading sections...
                        </SelectItem>
                      )}
                      {formData.class && sections.length > 0 && sections.map((section) => (
                        <SelectItem key={section._id || section.name} value={section.name}>
                          Section {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.class && (
                    <p className="text-sm text-gray-500">
                      Available sections: {sections.length > 0 ? sections.map(s => s.name).join(', ') : 'Loading...'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rollNo">Roll Number *</Label>
                  <Input
                    id="rollNo"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admissionNo">Admission Number</Label>
                  <Input
                    id="admissionNo"
                    value={formData.admissionNo}
                    onChange={(e) => {
                      // Only allow alphanumeric characters and automatically convert to uppercase
                      const value = e.target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
                      setFormData({ ...formData, admissionNo: value });
                    }}
                    placeholder="Leave empty to auto-generate (e.g., ADM20241234)"
                  />
                </div>                <div className="space-y-2">
                  <Label htmlFor="admissionDate">Admission Date</Label>
                  <Input
                    id="admissionDate"
                    type="date"
                    value={formData.admissionDate}
                    onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousSchool">Previous School</Label>
                  <Input
                    id="previousSchool"
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                  />
                </div>

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
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="OBC">OBC</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="ST">ST</SelectItem>
                      <SelectItem value="EWS">EWS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motherTongue">Mother Tongue</Label>
                  <Input
                    id="motherTongue"
                    value={formData.motherTongue}
                    onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })}
                    placeholder="e.g., Hindi, English, Tamil"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parent Information */}
          <Card>
            <CardHeader>
              <CardTitle>Parent/Guardian Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Name</Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motherName">Mother's Name</Label>
                  <Input
                    id="motherName"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Parent Contact</Label>
                  <Input
                    id="parentPhone"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Parent Email</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploadingImage}>
              {loading || uploadingImage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploadingImage ? 'Uploading Image...' : 'Creating Student...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Student
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
