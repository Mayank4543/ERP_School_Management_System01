'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { User, Mail, Phone, Lock, Bell, Shield, Save, Upload, X, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { getDefaultAvatar } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api/client';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profile_picture || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    name: user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || '',
    avatar: user?.profile_picture || profileImageUrl || getDefaultAvatar(user?.role || '')
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load saved profile image on component mount
  useEffect(() => {
    const savedImageUrl = localStorage.getItem('profileImageUrl');
    if (savedImageUrl) {
      setProfileImageUrl(savedImageUrl);
      setProfile(prev => ({ ...prev, avatar: savedImageUrl }));
    }
  }, []);

  
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('http://localhost:8080/api/v1/upload/image?type=profile', {
        method: 'POST',
        body: formData,
        
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Upload failed');
      }
      
      return result.data.imageUrl;
    } catch (error) {
      console.error('Upload Error:', error);
      
      if (error instanceof Error) {
        toast.error(`Upload failed: ${error.message}`);
      } else {
        toast.error('Upload failed. Please try again.');
      }
      
      throw error;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

 
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const imageUrl = await uploadImage(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      console.log('Upload successful, received image URL:', imageUrl);
      setProfileImageUrl(imageUrl);
      setProfile(prev => ({ ...prev, avatar: imageUrl }));
      
      // Update user in AuthContext
      updateUser({ profile_picture: imageUrl });
      
      // Store in localStorage for persistence
      localStorage.setItem('profileImageUrl', imageUrl);
      
      toast.success('Profile photo updated successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemovePhoto = () => {
    setProfileImageUrl('');
    setProfile(prev => ({ ...prev, avatar: getDefaultAvatar(prev.role) }));
    toast.success('Profile photo removed');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await apiClient.patch('/auth/profile', {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone
      });
      
      if (response.data.success) {
        // Update AuthContext with new data
        updateUser({
          first_name: profile.first_name,
          last_name: profile.last_name,
          name: `${profile.first_name} ${profile.last_name}`.trim(),
          phone: profile.phone
        });
        
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      console.error('Profile update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/password/change', {
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      });
      
      if (response.data.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success('Password changed successfully');
      }
    } catch (error: any) {
      console.error('Password change failed:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-4xl mx-auto px-2 sm:px-4">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>

    
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-xl sm:text-2xl">{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="text-white text-xs font-medium">{uploadProgress}%</div>
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold">{profile.name}</h2>
              <p className="text-gray-500 text-sm sm:text-base">{profile.role}</p>
              
              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-xs text-gray-500 mt-1">Uploading...</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={triggerFileInput} disabled={isUploading}>
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRemovePhoto}
                  disabled={isUploading || !profileImageUrl}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
          
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <User className="h-5 w-5 text-purple-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.first_name}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value, name: `${e.target.value} ${profile.last_name}`.trim() })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.last_name}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value, name: `${profile.first_name} ${e.target.value}`.trim() })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={profile.role} disabled />
            </div>
          </div>

          <div className="flex justify-center sm:justify-end pt-4">
            <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Lock className="h-5 w-5 text-purple-600" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">Current Password</Label>
            <Input 
              id="current" 
              type="password" 
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <Input 
                id="new" 
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input 
                id="confirm" 
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-center sm:justify-end pt-4">
            <Button 
              onClick={handlePasswordChange}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Bell className="h-5 w-5 text-purple-600" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium text-sm sm:text-base">Email Notifications</p>
              <p className="text-xs sm:text-sm text-gray-500">Receive email updates about important events</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">Enabled</Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <p className="font-medium text-sm sm:text-base">SMS Notifications</p>
              <p className="text-xs sm:text-sm text-gray-500">Get SMS alerts for critical updates</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">Disabled</Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <p className="font-medium text-sm sm:text-base">Push Notifications</p>
              <p className="text-xs sm:text-sm text-gray-500">Browser push notifications</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">Enabled</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Shield className="h-5 w-5 text-purple-600" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <p className="font-medium text-sm sm:text-base">Two-Factor Authentication</p>
              <p className="text-xs sm:text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">Enable</Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <p className="font-medium text-sm sm:text-base">Active Sessions</p>
              <p className="text-xs sm:text-sm text-gray-500">Manage your active login sessions</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">View</Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <p className="font-medium text-sm sm:text-base">Login History</p>
              <p className="text-xs sm:text-sm text-gray-500">Review recent login activity</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">View</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
