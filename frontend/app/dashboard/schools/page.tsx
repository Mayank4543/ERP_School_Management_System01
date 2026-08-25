'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, School, MoreVertical, Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

import { toast } from 'sonner';
import { getSchools, deleteSchool, SchoolStatus, type SchoolListItem } from './api';
import { SchoolFormDialog } from './components/SchoolFormDialog';
type SchoolStatusFilter = 'all' | SchoolStatus;

export default function SchoolsPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<SchoolListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SchoolStatusFilter>('all');
  const [editSchool, setEditSchool] = useState<SchoolListItem | null>(null);
  const [addSchoolOpen, setAddSchoolOpen] = useState(false);
  const [deleteSchoolTarget, setDeleteSchoolTarget] = useState<SchoolListItem | null>(null);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const data = await getSchools();
      setSchools(data);
    } catch (error) {
      console.error('Failed to fetch schools:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load schools');
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const query = searchTerm.trim().toLowerCase();
  const filteredSchools = schools.filter((school) => {
    if (statusFilter !== 'all' && school.status !== statusFilter) {
      return false;
    }
    if (!query) return true;

    return [
      school.name,
      school.email,
      school.phone,
      school.address,
      school.state,
      school.city,
      school.pincode,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  const handleDeleteSchool = async (school: SchoolListItem) => {
    try {
      const response = await deleteSchool(school._id);
      if (response.success) {
        toast.success(response.message || 'School deleted successfully');
        setSchools((current) => current.filter((item) => item._id !== school._id));
        return;
      }

      toast.error(response.message || 'Failed to delete school');
    } catch (error) {
      console.error('Delete school error:', error);
      toast.error('Failed to delete school');
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';

    const value = new Date(date);
    if (Number.isNaN(value.getTime())) return 'N/A';

    return value.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns: Column<SchoolListItem>[] = [
    {
      key: 'name',
      label: 'School',
      render: (_, school) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <School className="h-4 w-4 text-purple-600" />
            <span className="font-semibold text-gray-900">{school.name}</span>
          </div>
          {school.board && <p className="text-xs text-gray-500">Board: {school.board}</p>}
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (_, school) => <span className="text-sm text-gray-600">{school.email}</span>,
    },
    {
      key: 'location',
      label: 'Location',
      render: (_, school) => (
        <div className="text-sm text-gray-600">
          <p>{school.city || 'N/A'}</p>
          <p>{school.pincode || 'N/A'}</p>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (_, school) => <span className="text-sm text-gray-600">{formatDate(school.createdAt)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, school) => {
        const status = school.status ?? SchoolStatus.PENDING; 
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status === SchoolStatus.APPROVED
                ? 'bg-green-100 text-green-700'
                : status === SchoolStatus.PENDING
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schools</h1>
            <p className="mt-1 text-sm text-gray-500">Manage all schools in one place.</p>
          </div>
          <Button onClick={() => setAddSchoolOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add School
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search schools"
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SchoolStatusFilter)}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value={SchoolStatus.APPROVED}>Approved</SelectItem>
            <SelectItem value={SchoolStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={SchoolStatus.REJECTED}>Rejected</SelectItem>
            <SelectItem value={SchoolStatus.SUSPENDED}>Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filteredSchools}
        loading={loading}
        getRowKey={(school) => school._id}
        showSearch={false}
        showExport={false}
        emptyMessage={
          searchTerm || statusFilter !== 'all'
            ? 'No schools match the selected filters'
            : 'No schools available yet'
        }
        rowActions={(school) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/schools/${school._id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditSchool(school)} >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteSchoolTarget(school)} className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

      />
      <ConfirmDialog
        open={!!deleteSchoolTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteSchoolTarget(null);
        }}
        onConfirm={async () => {
          if (deleteSchoolTarget) {
            await handleDeleteSchool(deleteSchoolTarget);
            setDeleteSchoolTarget(null);
          }
        }}
        title="Delete school?"
        description={
          deleteSchoolTarget
            ? `Delete ${deleteSchoolTarget.name}? This action cannot be undone.`
            : 'This action cannot be undone.'
        }
        confirmLabel="Delete"
        destructive
      />
      <SchoolFormDialog
        school={editSchool}
        open={!!editSchool}
        onClose={() => setEditSchool(null)}
        onUpdated={(updatedSchool) => {
          setSchools((current) =>
            current.map((school) =>
              school._id === updatedSchool._id
                ? updatedSchool
                : school
            )
          );
        }}
      />
      <SchoolFormDialog
        school={null}
        open={addSchoolOpen}
        onClose={() => setAddSchoolOpen(false)}
        onUpdated={(createdSchool) => {
          setSchools((current) => [createdSchool, ...current]);
          setAddSchoolOpen(false);
        }}
      />
    </div>
  );
}
