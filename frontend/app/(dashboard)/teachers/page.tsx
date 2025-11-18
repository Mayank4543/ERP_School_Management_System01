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
import { Plus, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { Teacher } from '@/types';
import teachersService from '@/lib/api/services/teachers.service';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function TeachersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
  });

  useEffect(() => {
    fetchTeachers();
  }, [pagination.page, pagination.limit, filters]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await teachersService.getAll({
        schoolId: user?.school_id || '',
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
      });

      if (response.success) {
        setTeachers(response.data);
        setPagination({
          page: response.page,
          limit: pagination.limit,
          total: response.total,
          totalPages: response.totalPages,
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch teachers');
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

  const columns: Column<Teacher>[] = [
    {
      key: 'employee_id',
      label: '#',
      render: (_, teacher) => {
        const index = teachers.indexOf(teacher);
        return `# ${(pagination.page - 1) * pagination.limit + index + 1}`;
      },
    },
    {
      key: 'profile_picture',
      label: 'Photo',
      render: (_, teacher) => (
        <Avatar className="h-10 w-10">
          <AvatarImage src={teacher.profile_picture} />
          <AvatarFallback className="bg-blue-500 text-white">
            {teacher.first_name[0]}{teacher.last_name[0]}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      key: 'first_name',
      label: 'Teacher Name',
      sortable: true,
      render: (_, teacher) => (
        <span className="font-medium">
          {teacher.first_name} {teacher.last_name}
        </span>
      ),
    },
    {
      key: 'gender',
      label: 'Gender',
      render: (value) => (
        <span className="capitalize">{value}</span>
      ),
    },
    {
      key: 'subjects',
      label: 'Subject',
      render: (subjects) => (
        subjects?.length > 0 ? subjects.join(', ') : '-'
      ),
    },
    {
      key: 'standard',
      label: 'Class',
      render: (_, teacher) => (
        // This would come from class assignment - placeholder for now
        <span>1, 3</span>
      ),
    },
    {
      key: 'section',
      label: 'Section',
      render: () => 'A, B',
    },
    {
      key: 'joining_date',
      label: 'Date',
      render: (value) => (
        value ? new Date(value).toLocaleDateString('en-GB').replace(/\//g, '/') : '-'
      ),
    },
    {
      key: 'phone',
      label: 'Time',
      render: () => '10:00 am - 11:00 am',
    },
    {
      key: 'phone',
      label: 'Mobile No',
      render: (value) => value || '-',
    },
    {
      key: 'email',
      label: 'E-mail',
    },
    {
      key: '_id',
      label: 'Action',
      render: (_, teacher) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-blue-600"
            onClick={() => router.push(`/dashboard/teachers/${teacher._id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-green-600"
            onClick={() => router.push(`/dashboard/teachers/${teacher._id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600"
            onClick={() => handleDelete(teacher._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Class Schedule</h1>
          <p className="text-gray-500">Manage teacher schedules and assignments</p>
        </div>
        <Button onClick={() => router.push('/dashboard/teachers/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={teachers}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPagination({ ...pagination, page })}
          onLimitChange={(limit) => setPagination({ ...pagination, limit, page: 1 })}
          onSearch={(search) => setFilters({ ...filters, search })}
          searchPlaceholder="Search by name, employee ID, email..."
          emptyMessage="No teachers found. Add your first teacher to get started."
          showExport={false}
        />
      </Card>
    </div>
  );
}
