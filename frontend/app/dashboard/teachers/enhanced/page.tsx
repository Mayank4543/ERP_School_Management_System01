'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Users, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit
} from 'lucide-react';
import teachersService from '@/lib/api/services/teachers.service';
import { Teacher } from '@/types/index';
import { toast } from 'sonner';

interface TeacherWithStats extends Teacher {
  total_periods?: number;
  subjects_count?: number;
  sections_count?: number;
  workload_percentage?: number;
  is_overloaded?: boolean;
}

export default function EnhancedTeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<TeacherWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user data to get school_id
      const userStr = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='))
        ?.split('=')[1];
      
      if (!userStr) {
        throw new Error('User not found');
      }
      
      const user = JSON.parse(decodeURIComponent(userStr));
      const schoolId = user.school_id;
      
      if (!schoolId) {
        throw new Error('School ID not found');
      }

      const response = await teachersService.getAll({ 
        schoolId, 
        page: 1, 
        limit: 100,
        search: searchTerm || undefined,
        department: filterDepartment || undefined,
        status: (filterStatus as 'active' | 'inactive') || undefined
      });

      // Add mock workload stats for demonstration
      const enhancedTeachers: TeacherWithStats[] = response.data.map((teacher: Teacher) => ({
        ...teacher,
        total_periods: Math.floor(Math.random() * 40) + 10,
        subjects_count: Math.floor(Math.random() * 5) + 1,
        sections_count: Math.floor(Math.random() * 6) + 1,
        workload_percentage: Math.floor(Math.random() * 100) + 20,
        is_overloaded: Math.random() > 0.8
      }));

      setTeachers(enhancedTeachers);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch teachers');
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTeachers();
  };

  const handleFilterChange = (type: string, value: string) => {
    if (type === 'department') setFilterDepartment(value);
    if (type === 'status') setFilterStatus(value);
    fetchTeachers();
  };

  const getWorkloadBadge = (percentage?: number, isOverloaded?: boolean) => {
    if (!percentage) return null;
    
    if (isOverloaded || percentage > 90) {
      return <Badge className="bg-red-100 text-red-800">Overloaded</Badge>;
    } else if (percentage > 70) {
      return <Badge className="bg-yellow-100 text-yellow-800">High</Badge>;
    } else if (percentage > 40) {
      return <Badge className="bg-green-100 text-green-800">Optimal</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-800">Light</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Users className="h-8 w-8 animate-pulse mx-auto mb-4 text-blue-500" />
          <p>Loading teachers...</p>
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
            <h3 className="text-lg font-semibold mb-2">Error Loading Teachers</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchTeachers}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    total: teachers.length,
    active: teachers.filter(t => t.is_active).length,
    overloaded: teachers.filter(t => t.is_overloaded).length,
    avgWorkload: teachers.reduce((sum, t) => sum + (t.workload_percentage || 0), 0) / teachers.length || 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enhanced Teacher Management</h1>
          <p className="text-muted-foreground">
            Advanced teacher management with workload analysis and assignment tracking
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/teachers/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Workload</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.avgWorkload)}%</div>
            <p className="text-xs text-muted-foreground">
              Capacity utilization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overloaded</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overloaded}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Overall rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <Select value={filterDepartment} onValueChange={(value) => handleFilterChange('department', value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Social Studies">Social Studies</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Teachers List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teachers.map((teacher) => (
              <div key={teacher._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {teacher.first_name} {teacher.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {teacher.email} • {teacher.employee_id}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {teacher.department} • {teacher.designation}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium">{teacher.total_periods || 0}</div>
                    <div className="text-xs text-muted-foreground">Periods</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{teacher.subjects_count || 0}</div>
                    <div className="text-xs text-muted-foreground">Subjects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{teacher.sections_count || 0}</div>
                    <div className="text-xs text-muted-foreground">Classes</div>
                  </div>
                  {getWorkloadBadge(teacher.workload_percentage, teacher.is_overloaded)}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/teachers/${teacher._id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/teachers/${teacher._id}/assignments`}>
                        <Calendar className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {teachers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Teachers Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterDepartment || filterStatus 
                  ? "No teachers match your current filters." 
                  : "Get started by adding your first teacher."
                }
              </p>
              <Button asChild>
                <Link href="/dashboard/teachers/new">Add Teacher</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}