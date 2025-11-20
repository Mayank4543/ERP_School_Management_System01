'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  TrendingUp,
  Award,
  Loader2,
  AlertCircle,
  BookOpen,
  FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dashboardService, ParentChild, ChildDashboardData } from '@/lib/api/services/dashboard.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [selectedChild, setSelectedChild] = useState<ParentChild | null>(null);
  const [childDashboard, setChildDashboard] = useState<ChildDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingChild, setLoadingChild] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, [user?.ref_id]);

  useEffect(() => {
    if (selectedChild) {
      fetchChildDashboard(selectedChild.id);
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    if (!user?.ref_id) return;
    
    try {
      setLoading(true);
      const data = await dashboardService.getParentChildren(user.ref_id);
      setChildren(data);
      if (data.length > 0) {
        setSelectedChild(data[0]);
      }
    } catch (error: any) {
      console.error('Failed to fetch children:', error);
      toast.error(error.response?.data?.message || 'Failed to load children data');
    } finally {
      setLoading(false);
    }
  };

  const fetchChildDashboard = async (childId: string) => {
    if (!user?.ref_id) return;
    
    try {
      setLoadingChild(true);
      const data = await dashboardService.getChildDashboard(user.ref_id, childId);
      setChildDashboard(data);
    } catch (error: any) {
      console.error('Failed to fetch child dashboard:', error);
      toast.error(error.response?.data?.message || 'Failed to load child dashboard');
    } finally {
      setLoadingChild(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-orange-600 mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-orange-600 mb-4" />
          <p className="text-gray-600 mb-4">No children found</p>
          <Button onClick={fetchChildren}>Retry</Button>
        </div>
      </div>
    );
  }

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.first_name}! 👪
        </h1>
        <p className="text-orange-100">
          Monitor your children's academic progress and activities
        </p>
      </div>

      {/* Children Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Your Children
          </CardTitle>
          <CardDescription>Select a child to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {children.map((child) => (
              <div
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedChild?.id === child.id
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Avatar className="h-16 w-16">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="bg-orange-600 text-white text-lg">
                    {child.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{child.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Class {child.class} {child.section} • Roll No: {child.roll_no}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={child.status === 'active' ? 'secondary' : 'outline'} 
                      className={child.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                    >
                      {child.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Child Dashboard Data */}
      {loadingChild ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : childDashboard ? (
        <>
          {/* Student Info */}
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Student Name</p>
                  <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                    {childDashboard.student_info.name}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Class</p>
                  <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                    {childDashboard.student_info.class} {childDashboard.student_info.section}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Roll Number</p>
                  <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                    {childDashboard.student_info.roll_no}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Admission No</p>
                  <p className="text-lg font-semibold text-orange-700 dark:text-orange-300">
                    {childDashboard.student_info.admission_no}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                <div className={`p-2 rounded-lg ${colorClasses.blue}`}>
                  <Calendar size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{childDashboard.stats.attendance_percentage.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-1">Current month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
                <div className={`p-2 rounded-lg ${colorClasses.orange}`}>
                  <FileText size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{childDashboard.stats.pending_assignments}</div>
                <p className="text-xs text-muted-foreground mt-1">To be submitted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Homework</CardTitle>
                <div className={`p-2 rounded-lg ${colorClasses.purple}`}>
                  <BookOpen size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{childDashboard.stats.pending_homework}</div>
                <p className="text-xs text-muted-foreground mt-1">To be completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} />
                Attendance Summary
              </CardTitle>
              <CardDescription>Current month attendance record</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {childDashboard.attendance_summary.total_days}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Total Days</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-100 dark:bg-green-900">
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {childDashboard.attendance_summary.present}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Present</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-red-100 dark:bg-red-900">
                  <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                    {childDashboard.attendance_summary.absent}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Absent</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-6">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${childDashboard.stats.attendance_percentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Select a child to view details</p>
        </div>
      )}
    </div>
  );
}
