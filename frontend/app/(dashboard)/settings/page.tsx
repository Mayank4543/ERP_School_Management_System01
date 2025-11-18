'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, School, Calendar as CalendarIcon, GraduationCap, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    schoolName: 'St. Xavier High School',
    schoolCode: 'STXHS001',
    email: 'info@stxavierhigh.com',
    phone: '+91 11 1234 5678',
    address: '123 Education Lane, New Delhi',
    academicYearStart: '2024-04-01',
    academicYearEnd: '2025-03-31',
    enableSMS: true,
    enableEmail: true,
    autoBackup: true,
    attendanceTime: '09:30',
    lateMarkTime: '09:45',
  });

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Settings saved successfully');
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage school configuration and preferences</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                School Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={settings.schoolName}
                    onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolCode">School Code</Label>
                  <Input
                    id="schoolCode"
                    value={settings.schoolCode}
                    onChange={(e) => setSettings({ ...settings, schoolCode: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Settings */}
        <TabsContent value="academic" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Academic Year
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearStart">Academic Year Start</Label>
                  <Input
                    id="yearStart"
                    type="date"
                    value={settings.academicYearStart}
                    onChange={(e) => setSettings({ ...settings, academicYearStart: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearEnd">Academic Year End</Label>
                  <Input
                    id="yearEnd"
                    type="date"
                    value={settings.academicYearEnd}
                    onChange={(e) => setSettings({ ...settings, academicYearEnd: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attendanceTime">Attendance Time</Label>
                  <Input
                    id="attendanceTime"
                    type="time"
                    value={settings.attendanceTime}
                    onChange={(e) => setSettings({ ...settings, attendanceTime: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lateMarkTime">Late Mark Time</Label>
                  <Input
                    id="lateMarkTime"
                    type="time"
                    value={settings.lateMarkTime}
                    onChange={(e) => setSettings({ ...settings, lateMarkTime: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Grading System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">A+ Grade</p>
                    <p className="text-sm text-gray-500">90% and above</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">A Grade</p>
                    <p className="text-sm text-gray-500">80% - 89%</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">B+ Grade</p>
                    <p className="text-sm text-gray-500">70% - 79%</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableSMS">SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Send SMS for important updates</p>
                </div>
                <Switch
                  id="enableSMS"
                  checked={settings.enableSMS}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableSMS: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableEmail">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Send email notifications</p>
                </div>
                <Switch
                  id="enableEmail"
                  checked={settings.enableEmail}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableEmail: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoBackup">Automatic Backup</Label>
                  <p className="text-sm text-gray-500">Daily automatic database backup</p>
                </div>
                <Switch
                  id="autoBackup"
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                />
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Database</h4>
                <div className="flex gap-2">
                  <Button variant="outline">Backup Now</Button>
                  <Button variant="outline">Restore</Button>
                  <Button variant="outline">Export Data</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}
