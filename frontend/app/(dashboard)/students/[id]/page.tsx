'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import studentsService from '@/lib/api/services/students.service';
import { useAuth } from '@/contexts/AuthContext';

const studentSchema = z.object({
  admission_no: z.string().min(1, 'Admission number is required'),
  first_name: z.string().min(1, 'First name is required'),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, 'Last name is required'),
  gender: z.enum(['male', 'female', 'other']),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  blood_group: z.string().optional(),
  religion: z.string().optional(),
  caste: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  admission_date: z.string().min(1, 'Admission date is required'),
  standard: z.number().min(1).max(12),
  section: z.string().min(1, 'Section is required'),
});

type StudentFormData = z.infer<typeof studentSchema>;

export default function StudentFormPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const isEdit = params?.id !== 'new';
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEdit);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      country: 'India',
      standard: 1,
    },
  });

  useEffect(() => {
    if (isEdit && params?.id) {
      fetchStudentData(params.id as string);
    }
  }, [isEdit, params?.id]);

  const fetchStudentData = async (id: string) => {
    try {
      setFetchingData(true);
      const response = await studentsService.getById(id);
      
      if (response.success && response.data) {
        const student = response.data;
        Object.keys(student).forEach((key) => {
          const studentKey = key as keyof typeof student;
          const value = student[studentKey];
          if (key === 'date_of_birth' || key === 'admission_date') {
            setValue(key as any, (value as string).split('T')[0]);
          } else {
            setValue(key as any, value);
          }
        });
      }
    } catch (error: any) {
      toast.error('Failed to fetch student data');
      router.push('/dashboard/students');
    } finally {
      setFetchingData(false);
    }
  };

  const onSubmit = async (data: StudentFormData) => {
    try {
      setLoading(true);
      
      const payload = {
        ...data,
        school_id: user?.school_id,
        academic_year_id: '2024-25', // This should come from settings
      };

      if (isEdit && params?.id) {
        await studentsService.update(params.id as string, payload);
        toast.success('Student updated successfully');
      } else {
        await studentsService.create(payload);
        toast.success('Student created successfully');
      }
      
      router.push('/dashboard/students');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? 'Edit Student' : 'Add New Student'}
          </h1>
          <p className="text-gray-500">
            {isEdit ? 'Update student information' : 'Fill in the student details'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admission_no">Admission Number *</Label>
              <Input id="admission_no" {...register('admission_no')} />
              {errors.admission_no && (
                <p className="text-sm text-red-500">{errors.admission_no.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input id="first_name" {...register('first_name')} />
              {errors.first_name && (
                <p className="text-sm text-red-500">{errors.first_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="middle_name">Middle Name</Label>
              <Input id="middle_name" {...register('middle_name')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input id="last_name" {...register('last_name')} />
              {errors.last_name && (
                <p className="text-sm text-red-500">{errors.last_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select onValueChange={(value) => setValue('gender', value as any)} defaultValue={watch('gender')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <Input id="date_of_birth" type="date" {...register('date_of_birth')} />
              {errors.date_of_birth && (
                <p className="text-sm text-red-500">{errors.date_of_birth.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="blood_group">Blood Group</Label>
              <Select onValueChange={(value) => setValue('blood_group', value)} defaultValue={watch('blood_group')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="religion">Religion</Label>
              <Input id="religion" {...register('religion')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="caste">Caste</Label>
              <Input id="caste" {...register('caste')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register('phone')} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea id="address" {...register('address')} rows={3} />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" {...register('city')} />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input id="state" {...register('state')} />
              {errors.state && (
                <p className="text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input id="country" {...register('country')} />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input id="pincode" {...register('pincode')} />
              {errors.pincode && (
                <p className="text-sm text-red-500">{errors.pincode.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admission_date">Admission Date *</Label>
              <Input id="admission_date" type="date" {...register('admission_date')} />
              {errors.admission_date && (
                <p className="text-sm text-red-500">{errors.admission_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="standard">Class *</Label>
              <Select onValueChange={(value) => setValue('standard', Number(value))} defaultValue={watch('standard')?.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.standard && (
                <p className="text-sm text-red-500">{errors.standard.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section *</Label>
              <Select onValueChange={(value) => setValue('section', value)} defaultValue={watch('section')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {['A', 'B', 'C', 'D', 'E'].map((sec) => (
                    <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.section && (
                <p className="text-sm text-red-500">{errors.section.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? 'Update' : 'Create'} Student
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
