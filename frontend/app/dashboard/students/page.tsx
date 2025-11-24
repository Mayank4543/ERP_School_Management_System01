'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfileImage from '@/components/shared/ProfileImage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Plus, MoreVertical, Eye, Edit, Trash2, Download } from 'lucide-react';
import studentsService, { type Student } from '@/lib/api/services/students.service';
import sectionsService from '@/lib/api/services/sections.service';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<any[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    standard: undefined as number | undefined,
    section: undefined as string | undefined,
    status: undefined as string | undefined,
  });

  useEffect(() => {
    fetchStudents();
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    // Load sections independently, only once
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setSectionsLoading(true);

      if (!user?.school_id) {
        console.warn('No school_id found for sections loading');
        setSections([]);
        setSectionsLoading(false);
        return;
      }

      const response = await sectionsService.getAll({
        schoolId: user.school_id,
        page: 1,
        limit: 1000
      });

      console.log('🔍 Sections API response:', response);

      // Handle both paginated response and direct array response
      let sectionsArray: any[] = [];

      if (Array.isArray(response)) {
        sectionsArray = response;
      } else if (response && Array.isArray(response.data)) {
        sectionsArray = response.data;
      } else if (response && typeof response === 'object' && 'data' in response) {
        // Handle case where data might not be an array but exists
        sectionsArray = Array.isArray(response.data) ? response.data : [];
      } else {
        console.warn('⚠️ Unexpected sections response format:', response);
        sectionsArray = [];
      }

      setSections(sectionsArray);
      console.log('✅ Loaded sections:', sectionsArray.length, 'sections');
    } catch (error) {
      console.error('❌ Failed to load sections:', error);
      setSections([]); // Ensure sections is always an array
      toast.error('Failed to load sections data');
    } finally {
      setSectionsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);

      // Debug logging
      console.log('📊 Fetching students with params:', {
        schoolId: user?.school_id,
        page: pagination.page,
        limit: pagination.limit,
        filters
      });

      if (!user?.school_id) {
        console.warn('⚠️ No school_id found in user object:', user);
        toast.error('School ID not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await studentsService.getAll({
        schoolId: user.school_id,
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        standard: filters.standard,
        section: filters.section,
        status: filters.status,
      });

      console.log('✅ Students API Response:', response);
      console.log('📊 Sample student raw data:', response.data[0]);

      if (response.success) {
        console.log('✅ Students loaded with complete data from backend');
        setStudents(response.data);
        setPagination({
          page: response.page,
          limit: pagination.limit,
          total: response.total,
          totalPages: response.totalPages,
        });

        console.log(`✅ Loaded ${response.data.length} students (Total: ${response.total})`);

        // Debug the first student's data structure
        if (response.data.length > 0) {
          const student = response.data[0];
          console.log('🔍 First student analysis:', {
            user_id_type: typeof student.user_id,
            user_id_value: student.user_id,
            section_id_type: typeof student.section_id,
            section_id_value: student.section_id,
            admission_no: student.admission_no,
            roll_no: student.roll_no
          });
        }
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch students:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await studentsService.delete(id);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete student');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';

    if (!confirm(`Are you sure you want to ${action} this student?`)) return;

    try {
      await studentsService.update(id, { status: newStatus });
      toast.success(`Student ${action}d successfully`);
      fetchStudents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${action} student`);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await studentsService.exportToExcel({
        schoolId: user?.school_id || '',
        ...filters,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Students exported successfully');
    } catch (error: any) {
      toast.error('Failed to export students');
    }
  };

  const columns: Column<Student>[] = [
    {
      key: 'profile_picture',
      label: 'Photo',
      render: (_, student: any) => {
        let initials = 'ST';
        let profilePicture = null;
        let userName = 'Student';

        if (typeof student.user_id === 'object' && student.user_id) {
          const firstName = student.user_id.first_name || '';
          const lastName = student.user_id.last_name || '';
          const fullName = `${firstName} ${lastName}`.trim();

          // Fallback to email username if name is not available
          userName = fullName || student.user_id.name ||
            (student.user_id.email ? student.user_id.email.split('@')[0] : 'Student');
          profilePicture = student.user_id.profile_picture;

          if (userName && userName !== 'Student') {
            initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
          } else {
            // Use admission number as fallback
            initials = student.admission_no ? student.admission_no.slice(-2).toUpperCase() : 'ST';
          }
        } else {
          // Use admission number as fallback
          initials = student.admission_no ? student.admission_no.slice(-2).toUpperCase() : 'ST';
          userName = student.admission_no || 'Student';
        }

        return (
          <ProfileImage
            src={profilePicture}
            alt={userName}
            fallbackText={initials}
            size="md"
          />
        );
      },
    },
    {
      key: 'admission_no',
      label: 'Admission No',
      sortable: true,
    },
    {
      key: 'user_id',
      label: 'Name',
      sortable: true,
      render: (_, student: any) => {
        // Handle both populated and non-populated user_id
        let userName = 'N/A';
        let userEmail = 'N/A';

        if (typeof student.user_id === 'object' && student.user_id) {
          // User is populated
          const firstName = student.user_id.first_name || '';
          const lastName = student.user_id.last_name || '';
          const fullName = `${firstName} ${lastName}`.trim();

          userName = fullName || student.user_id.name ||
            (student.user_id.email ? student.user_id.email.split('@')[0] : 'N/A');
          userEmail = student.user_id.email || 'N/A';
        } else if (typeof student.user_id === 'string') {
          // User is just an ID - show ID as fallback
          userName = `User ${student.user_id.slice(-6)}`;
          userEmail = 'Click to view';
        }

        return (
          <div>
            <p className="font-medium">
              {userName}
            </p>
            <p className="text-sm text-gray-500">{userEmail}</p>
          </div>
        );
      },
    },
    {
      key: 'roll_no',
      label: 'Roll No',
      sortable: true,
    },
    {
      key: 'standard',
      label: 'Class',
      render: (_, student: any) => {
        // Get section name from loaded sections since section_id might be a string
        // Ensure sections is an array before calling find
        const sectionsArray = Array.isArray(sections) ? sections : [];

        if (sectionsLoading && sectionsArray.length === 0) {
          return (
            <span>
              Class {student.standard} - Loading...
            </span>
          );
        }

        const section = sectionsArray.find(s => s._id === student.section_id);
        // Try multiple fallback strategies for section name
        const sectionName = section?.name ||
          student.section ||
          student.section_name ||
          (student.section_id ? `Section ${student.section_id.slice(-3)}` : 'Unknown');

        return (
          <span>
            Class {student.standard} - {sectionName}
          </span>
        );
      },
    },
    {
      key: 'user_id.mobile_no',
      label: 'Mobile No',
      render: (_, student: any) => {
        let mobileNo = 'N/A';

        if (typeof student.user_id === 'object' && student.user_id?.mobile_no) {
          mobileNo = student.user_id.mobile_no;
        } else if (typeof student.user_id === 'string') {
          mobileNo = 'Click to view';
        }

        return mobileNo;
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, student: any) => {
        const status = student.status || 'active';
        const variant = status === 'active' ? 'default' :
          status === 'inactive' ? 'destructive' : 'secondary';
        return (
          <Badge variant={variant}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: '_id',
      label: 'Action',
      render: (_, student) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/students/${student._id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/students/${student._id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleToggleStatus(student._id, student.status || 'active')}
              className={student.status === 'active' ? 'text-orange-600' : 'text-green-600'}
            >
              {student.status === 'active' ? (
                <>
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Deactivate
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => handleDelete(student._id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-gray-500">Manage student records and information</p>
        </div>
        <Button onClick={() => router.push('/dashboard/students/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      <Card className="p-6">
        {/* Filters Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                className="w-full text-sm border rounded px-3 py-2"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="transferred">Transferred</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>

            {/* Class Filter */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Class</label>
              <select
                value={filters.standard || ''}
                onChange={(e) => setFilters({ ...filters, standard: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full text-sm border rounded px-3 py-2"
              >
                <option value="">All Classes</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(std => (
                  <option key={std} value={std}>Class {std}</option>
                ))}
              </select>
            </div>

            {/* Section Filter */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Section</label>
              <select
                value={filters.section || ''}
                onChange={(e) => setFilters({ ...filters, section: e.target.value || undefined })}
                className="w-full text-sm border rounded px-3 py-2"
                disabled={sectionsLoading}
              >
                <option value="">All Sections</option>
                {sections.map(section => (
                  <option key={section._id} value={section.name}>{section.name}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ search: '', standard: undefined, section: undefined, status: undefined })}
                className="w-full text-sm bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={students}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPagination({ ...pagination, page })}
          onLimitChange={(limit) => setPagination({ ...pagination, limit, page: 1 })}
          onSearch={(search) => setFilters({ ...filters, search })}
          onExport={handleExport}
          searchPlaceholder="Search by name, admission no, email..."
          emptyMessage="No students found. Add your first student to get started."
        />
      </Card>
    </div>
  );
}
