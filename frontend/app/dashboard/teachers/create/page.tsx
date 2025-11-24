'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, X, Upload, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import teachersService from '@/lib/api/services/teachers.service';
import { Teacher } from '@/types';
import ProfileImage from '@/components/shared/ProfileImage';

export default function CreateTeacherPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    // Personal Information
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    
    // Professional Information
    employee_id: '',
    qualification: '',
    experience_years: '',
    department: '',
    designation: '',
    joining_date: '',
    subjects: [] as string[],
    
    // System
    is_active: true,
  });

  const [availableSubjects] = useState([
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 
    'Hindi', 'Social Studies', 'Computer Science', 'Physical Education',
    'Art', 'Music', 'Dance', 'Sanskrit', 'Geography', 'History'
  ]);

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, subject]
      });
    } else {
      setFormData({
        ...formData,
        subjects: formData.subjects.filter(s => s !== subject)
      });
    }
  };

  const generateEmployeeId = () => {
    const prefix = 'EMP';
    const timestamp = Date.now().toString().slice(-6);
    const employeeId = `${prefix}${timestamp}`;
    setFormData({ ...formData, employee_id: employeeId });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const teacherData: Partial<Teacher> & { profileImage?: File } = {
        ...formData,
        gender: formData.gender as 'male' | 'female' | 'other' | undefined,
        school_id: user?.school_id || '',
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
        profileImage: selectedFile || undefined,
      };

      const response = await teachersService.create(teacherData);
      toast.success('Teacher created successfully');
      router.push('/dashboard/teachers');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create teacher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Teacher</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create a new teacher profile</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="flex flex-col items-center space-y-4">
                  <ProfileImage
                    src={previewUrl}
                    alt={formData.first_name ? `${formData.first_name} ${formData.last_name}` : 'Profile'}
                    fallbackText={formData.first_name ? `${formData.first_name} ${formData.last_name}` : 'T'}
                    size="xl"
                  />
                  
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Camera className="h-4 w-4" />
                      <span>{selectedFile ? 'Change Photo' : 'Upload Photo'}</span>
                    </Button>
                    
                    {selectedFile && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveImage}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Upload a profile photo (JPG, PNG, or GIF, max 5MB)
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middle_name">Middle Name</Label>
                  <Input
                    id="middle_name"
                    value={formData.middle_name}
                    onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth *</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
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
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blood_group">Blood Group</Label>
                  <Select value={formData.blood_group} onValueChange={(value) => setFormData({ ...formData, blood_group: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
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

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  placeholder="Complete address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee_id">Employee ID *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="employee_id"
                      value={formData.employee_id}
                      onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                      required
                      placeholder="EMP001"
                    />
                    <Button type="button" variant="outline" onClick={generateEmployeeId}>
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joining_date">Joining Date *</Label>
                  <Input
                    id="joining_date"
                    type="date"
                    value={formData.joining_date}
                    onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification *</Label>
                  <Input
                    id="qualification"
                    placeholder="e.g., M.Sc. Mathematics, B.Ed."
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_years">Experience (Years)</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Social Studies">Social Studies</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Physical Education">Physical Education</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Select value={formData.designation} onValueChange={(value) => setFormData({ ...formData, designation: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Principal">Principal</SelectItem>
                      <SelectItem value="Vice Principal">Vice Principal</SelectItem>
                      <SelectItem value="Head Teacher">Head Teacher</SelectItem>
                      <SelectItem value="Senior Teacher">Senior Teacher</SelectItem>
                      <SelectItem value="Junior Teacher">Junior Teacher</SelectItem>
                      <SelectItem value="PGT">PGT (Post Graduate Teacher)</SelectItem>
                      <SelectItem value="TGT">TGT (Trained Graduate Teacher)</SelectItem>
                      <SelectItem value="PRT">PRT (Primary Teacher)</SelectItem>
                      <SelectItem value="Guest Teacher">Guest Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subjects */}
          <Card>
            <CardHeader>
              <CardTitle>Teaching Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {availableSubjects.map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox
                      id={subject}
                      checked={formData.subjects.includes(subject)}
                      onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                    />
                    <Label htmlFor={subject} className="text-sm font-normal">
                      {subject}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Creating...' : 'Create Teacher'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
