'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Plus, MoreVertical, Eye, Edit, Trash2, Download } from 'lucide-react';
import { Student } from '@/types';
import studentsService from '@/lib/api/services/students.service';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
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
  }, [pagination.page, pagination.limit, filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsService.getAll({
        schoolId: user?.school_id || '',
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        standard: filters.standard,
        section: filters.section,
      });

      if (response.success) {
        setStudents(response.data);
        setPagination({
          page: response.page,
          limit: pagination.limit,
          total: response.total,
          totalPages: response.totalPages,
        });
      }
    } catch (error: any) {
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
      key: 'admission_no',
      label: 'Photo',
      render: (_, student) => (
        <Avatar className="h-10 w-10">
          <AvatarImage src={student.profile_picture} />
          <AvatarFallback>
            {student.first_name[0]}{student.last_name[0]}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      key: 'admission_no',
      label: 'Admission No',
      sortable: true,
    },
    {
      key: 'first_name',
      label: 'Name',
      sortable: true,
      render: (_, student) => (
        <div>
          <p className="font-medium">
            {student.first_name} {student.middle_name} {student.last_name}
          </p>
          <p className="text-sm text-gray-500">{student.email}</p>
        </div>
      ),
    },
    {
      key: 'gender',
      label: 'Gender',
      render: (value) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: 'standard',
      label: 'Class',
      render: (_, student) => (
        <span>
          {student.standard} - {student.section}
        </span>
      ),
    },
    {
      key: 'phone',
      label: 'Mobile No',
    },
    {
      key: 'email',
      label: 'E-mail',
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
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
        <Button onClick={() => router.push('/dashboard/students/new')}>
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
