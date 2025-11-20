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
  });

  useEffect(() => {
    fetchStudents();
    loadSections();
  }, [pagination.page, pagination.limit, filters]);

  const loadSections = async () => {
    try {
      const allSections = await sectionsService.getAll();
      setSections(allSections);
    } catch (error) {
      console.warn('Failed to load sections:', error);
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
      });

      console.log('✅ Students API Response:', response);
      console.log('📊 Sample student raw data:', response.data[0]);

      if (response.success) {
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
        
        if (typeof student.user_id === 'object' && student.user_id?.name) {
          const userName = student.user_id.name;
          initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase();
        } else {
          // Use admission number as fallback
          initials = student.admission_no ? student.admission_no.slice(-2) : 'ST';
        }
        
        const profilePicture = typeof student.user_id === 'object' ? student.user_id?.profile_picture : student.profile_picture;
        const userName = typeof student.user_id === 'object' ? student.user_id?.name : 'Student';
        
        return (
          <ProfileImage
            src={profilePicture}
            alt={userName}
            fallbackText={userName}
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
          userName = student.user_id.name || 'N/A';
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
        const section = sections.find(s => s._id === student.section_id);
        const sectionName = section?.name || 'Unknown';

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
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'default' : 'secondary'}>
          {value || 'Active'}
        </Badge>
      ),
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
