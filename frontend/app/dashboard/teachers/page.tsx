'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfileImage from '@/components/shared/ProfileImage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Eye, Edit, Trash2, Filter, Search, Download, Users } from 'lucide-react';
import { Teacher } from '@/types';
import teachersService from '@/lib/api/services/teachers.service';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function TeachersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(''); // Local search input state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    department: 'all',
    designation: 'all',
    status: 'all' as 'active' | 'inactive' | 'all', // Start with no filter to show all teachers
  });

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== filters.search) {
        updateFilters({ ...filters, search: searchInput });
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Reset pagination when filters change
  const updateFilters = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when filters change
  }, []);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    departments: 0,
  });

  useEffect(() => {
    console.log('useEffect triggered - user:', user, 'filters:', filters);
    if (user?.school_id) {
      fetchTeachers();
    }
  }, [user?.school_id, pagination.page, pagination.limit, filters]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);

      if (!user?.school_id) {
        toast.error('School information not available. Please refresh and try again.');
        setLoading(false);
        return;
      }

      console.log('Fetching teachers with params:', {
        schoolId: user.school_id,
        page: pagination.page,
        limit: pagination.limit,
        filters
      });

      const response = await teachersService.getAll({
        schoolId: user.school_id,
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        department: filters.department === 'all' ? undefined : filters.department,
        designation: filters.designation === 'all' ? undefined : filters.designation,
        status: filters.status === 'all' ? undefined : filters.status,
      });

      console.log('Teachers API response:', response);

      if (response && response.data) {
        setTeachers(response.data || []);
        setPagination({
          page: response.page || pagination.page,
          limit: pagination.limit,
          total: response.total || 0,
          totalPages: response.totalPages || 0,
        });

        // Update stats
        setStats({
          total: response.total || 0,
          active: (response.data || []).filter(t => t.is_active).length,
          departments: [...new Set((response.data || []).map(t => t.department).filter(Boolean))].length,
        });
      } else {
        setTeachers([]);
        toast.error('No teachers data received from server');
      }
    } catch (error: any) {
      console.error('Error fetching teachers:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch teachers');
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;

    try {
      await teachersService.delete(id);
      toast.success('Teacher deleted successfully');
      fetchTeachers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete teacher');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await teachersService.exportToExcel({
        schoolId: user?.school_id || '',
        search: filters.search,
        department: filters.department === 'all' ? undefined : filters.department,
        designation: filters.designation === 'all' ? undefined : filters.designation,
        status: filters.status === 'all' ? undefined : filters.status as 'active' | 'inactive',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `teachers-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Teachers exported successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to export teachers');
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    updateFilters({
      search: '',
      department: 'all',
      designation: 'all',
      status: 'all',
    });
  };

  const columns: Column<Teacher>[] = [
    {
      key: 'employee_id',
      label: '#',
      render: (_, teacher) => {
        const index = teachers.indexOf(teacher);
        return `${(pagination.page - 1) * pagination.limit + index + 1}`;
      },
    },
    {
      key: 'profile_picture',
      label: 'Photo',
      render: (_, teacher) => (
        <ProfileImage
          src={teacher.profile_picture}
          alt={`${teacher.first_name} ${teacher.last_name}`}
          fallbackText={`${teacher.first_name} ${teacher.last_name}`}
          size="md"
        />
      ),
    },
    {
      key: 'first_name',
      label: 'Teacher Name',
      sortable: true,
      render: (_, teacher) => (
        <div>
          <span className="font-medium">
            {teacher.first_name} {teacher.middle_name} {teacher.last_name}
          </span>
          <div className="text-xs text-gray-500">{teacher.employee_id}</div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Contact',
      render: (_, teacher) => (
        <div className="space-y-1">
          <div className="text-sm">{teacher.email}</div>
          <div className="text-xs text-gray-500">{teacher.phone}</div>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (value) => (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {value || 'Not Assigned'}
        </Badge>
      ),
    },
    {
      key: 'designation',
      label: 'Designation',
      render: (value) => (
        <span className="text-sm">{value || '-'}</span>
      ),
    },
    {
      key: 'subjects',
      label: 'Subjects',
      render: (subjects) => (
        <div className="space-y-1">
          {subjects && subjects.length > 0 ? (
            subjects.slice(0, 2).map((subject: string, idx: number) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {subject}
              </Badge>
            ))
          ) : (
            <span className="text-gray-400 text-sm">-</span>
          )}
          {subjects && subjects.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{subjects.length - 2} more
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'experience_years',
      label: 'Experience',
      render: (value) => (
        <span className="text-sm">{value ? `${value} years` : '-'}</span>
      ),
    },
    {
      key: 'joining_date',
      label: 'Joined',
      render: (value) => (
        value ? new Date(value).toLocaleDateString('en-IN') : '-'
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'} className={value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: '_id',
      label: 'Actions',
      render: (_, teacher) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
            onClick={() => router.push(`/dashboard/teachers/${teacher._id}`)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
            onClick={() => router.push(`/dashboard/teachers/${teacher._id}/edit`)}
            title="Edit Teacher"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
            onClick={() => handleDelete(teacher._id)}
            title="Delete Teacher"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teachers Management</h1>
          <p className="text-gray-500">Manage teachers, view profiles, and track performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push('/dashboard/teachers/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Registered teachers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.departments}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Teachers List</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, employee ID, email, phone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* Active Filters Indicator */}
            {(filters.search || (filters.department !== 'all') || (filters.designation !== 'all') || (filters.status !== 'all')) && (
              <div className="text-sm text-blue-600 font-medium">
                {[filters.search && 'Search', (filters.department !== 'all') && 'Department', (filters.designation !== 'all') && 'Designation', (filters.status !== 'all') && 'Status']
                  .filter(Boolean).length} filter{[filters.search && 'Search', (filters.department !== 'all') && 'Department', (filters.designation !== 'all') && 'Designation', (filters.status !== 'all') && 'Status']
                    .filter(Boolean).length > 1 ? 's' : ''} active
              </div>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={filters.department} onValueChange={(value) => updateFilters({ ...filters, department: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Social Studies">Social Studies</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Geography">Geography</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Physical Education">Physical Education</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Sanskrit">Sanskrit</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Select value={filters.designation} onValueChange={(value) => updateFilters({ ...filters, designation: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Designations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Designations</SelectItem>
                    <SelectItem value="Principal">Principal</SelectItem>
                    <SelectItem value="Vice Principal">Vice Principal</SelectItem>
                    <SelectItem value="Head Teacher">Head Teacher</SelectItem>
                    <SelectItem value="Senior Teacher">Senior Teacher</SelectItem>
                    <SelectItem value="Junior Teacher">Junior Teacher</SelectItem>
                    <SelectItem value="PGT">PGT (Post Graduate Teacher)</SelectItem>
                    <SelectItem value="TGT">TGT (Trained Graduate Teacher)</SelectItem>
                    <SelectItem value="PRT">PRT (Primary Teacher)</SelectItem>
                    <SelectItem value="Subject Coordinator">Subject Coordinator</SelectItem>
                    <SelectItem value="Department Head">Department Head</SelectItem>
                    <SelectItem value="Guest Teacher">Guest Teacher</SelectItem>
                    <SelectItem value="Lab Assistant">Lab Assistant</SelectItem>
                    <SelectItem value="Librarian">Librarian</SelectItem>
                    <SelectItem value="Sports Teacher">Sports Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={filters.status} onValueChange={(value) => updateFilters({ ...filters, status: value as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          )}



          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="text-gray-500">Loading teachers...</div>
            </div>
          )}

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={teachers}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => setPagination({ ...pagination, page })}
            onLimitChange={(limit) => setPagination({ ...pagination, limit, page: 1 })}
            emptyMessage={`No teachers found${teachers.length === 0 && !loading ? '. Click "Add Teacher" to create your first teacher.' : '.'}`}
            showSearch={false}
            showExport={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
