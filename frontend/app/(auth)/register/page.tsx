'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';
import Cookies from 'js-cookie';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  usergroup_id: z.enum(['admin', 'teacher', 'student', 'parent', 'superadmin']),
  school_id: z.string().optional(),
  mobile_no: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch('usergroup_id');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        usergroup_id: data.usergroup_id,
        mobile_no: data.mobile_no || '',
      };

      console.log('Sending registration payload:', payload);

      const response = await apiClient.post('/auth/register', payload);

      if (response.data.success) {
        console.log('Registration response:', response.data);
        
        // Backend returns login data automatically after registration
        // Store the tokens and user data
        if (response.data.data?.access_token) {
          Cookies.set('access_token', response.data.data.access_token, { expires: 7 });
          
          // Transform and store user data
          const backendUser = response.data.data.user;
          const user = {
            _id: backendUser.id,
            id: backendUser.id,
            email: backendUser.email,
            name: backendUser.name,
            first_name: backendUser.name?.split(' ')[0] || '',
            last_name: backendUser.name?.split(' ').slice(1).join(' ') || '',
            role: backendUser.roles?.[0],
            roles: backendUser.roles,
            school_id: backendUser.school_id,
            usergroup_id: backendUser.usergroup_id,
          };
          
          Cookies.set('user', JSON.stringify(user), { expires: 7 });
          
          toast.success('Registration successful! Redirecting to dashboard...');
          // Redirect to dashboard instead of login
          router.push('/dashboard');
        } else {
          // Fallback: if no token, redirect to login
          toast.success('Registration successful! Please login.');
          router.push('/login');
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', error);
      console.error('Error details:', error.response?.data);
      
      // Show detailed validation errors if available
      if (error.response?.data?.error?.details) {
        console.error('Validation errors:', error.response.data.error.details);
        error.response.data.error.details.forEach((detail: any) => {
          toast.error(`${detail.field}: ${detail.message}`);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register('name')}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="usergroup_id">Role</Label>
              <Select
                onValueChange={(value) => setValue('usergroup_id', value as any)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">Super Admin</SelectItem>
                <SelectItem value="admin">School Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="librarian">Librarian</SelectItem>
                <SelectItem value="accountant">Accountant</SelectItem>
                <SelectItem value="receptionist">Receptionist</SelectItem>
              </SelectContent>
              </Select>
              {errors.usergroup_id && (
                <p className="text-sm text-red-500">{errors.usergroup_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile_no">Mobile Number (Optional)</Label>
              <Input
                id="mobile_no"
                type="tel"
                placeholder="+1234567890"
                {...register('mobile_no')}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <div className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
