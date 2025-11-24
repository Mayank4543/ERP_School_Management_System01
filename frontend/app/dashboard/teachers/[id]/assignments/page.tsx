'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Calendar,
  BookOpen,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Edit
} from 'lucide-react';
import teachersService from '@/lib/api/services/teachers.service';
import { Teacher } from '@/types/index';

export default function TeacherAssignmentsPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.id as string;
  
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (teacherId) {
      fetchTeacher();
    }
  }, [teacherId]);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const teacherData = await teachersService.getById(teacherId);
      setTeacher(teacherData);
    } catch (err) {
      console.error('Error fetching teacher:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch teacher');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Calendar className="h-8 w-8 animate-pulse mx-auto mb-4 text-blue-500" />
          <p>Loading teacher assignments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Teacher</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchTeacher}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Teacher Not Found</h3>
            <p className="text-gray-600 mb-4">The requested teacher could not be found.</p>
            <Button onClick={() => router.push('/dashboard/teachers')}>
              Back to Teachers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock assignment data for demonstration

  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Teacher Assignments
          </h1>
          <p className="text-muted-foreground">
            Manage assignments for {teacher.first_name} {teacher.last_name}
          </p>
        </div>
      </div>

      {/* Teacher Info & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teacher Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Teacher Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="font-medium">{teacher.first_name} {teacher.last_name}</div>
              <div className="text-sm text-muted-foreground">{teacher.employee_id}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Email</div>
              <div className="text-sm text-muted-foreground">{teacher.email}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Department</div>
              <div className="text-sm text-muted-foreground">{teacher.department || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Designation</div>
              <div className="text-sm text-muted-foreground">{teacher.designation || 'Not specified'}</div>
            </div>
            <Badge className={teacher.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {teacher.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </CardContent>
        </Card>

        {/* Workload Summary */}
        

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" disabled>
              <Calendar className="h-4 w-4 mr-2" />
              Add Assignment
            </Button>
            <Button variant="outline" className="w-full" disabled>
              <CheckCircle className="h-4 w-4 mr-2" />
              View Schedule
            </Button>
            <Button variant="outline" className="w-full" disabled>
              <Users className="h-4 w-4 mr-2" />
              Manage Classes
            </Button>
            <div className="text-xs text-muted-foreground text-center pt-2">
              Assignment management features coming soon
            </div>
          </CardContent>
        </Card>
      </div>

     
    </div>
  );
}