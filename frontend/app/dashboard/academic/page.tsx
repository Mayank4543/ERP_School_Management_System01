'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  BookOpen,
  GraduationCap,
  Users,
  Clock,
  TrendingUp,
  FileText,
  CheckCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Trash2,
  Check,
  Star,
  Loader2,
  BarChart3
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import academicService, { AcademicYear, CreateAcademicYearDto, UpdateAcademicYearDto } from '@/lib/api/services/academic.service';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function AcademicManagementPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState<AcademicYear | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateAcademicYearDto>({
    name: '',
    start_date: '',
    end_date: '',
    is_current: false,
    status: 'active'
  });

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      setLoading(true);
      const [yearsData, currentYearData] = await Promise.allSettled([
        academicService.getAll(),
        academicService.getCurrent()
      ]);

      if (yearsData.status === 'fulfilled') {
        setAcademicYears(yearsData.value);
      }

      if (currentYearData.status === 'fulfilled') {
        setCurrentYear(currentYearData.value);
      }
    } catch (error: any) {
      console.error('Failed to fetch academic data:', error);
      toast.error(error.response?.data?.message || 'Failed to load academic data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      await academicService.create(formData);
      toast.success('Academic year created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      await fetchAcademicData();
    } catch (error: any) {
      console.error('Failed to create academic year:', error);
      toast.error(error.response?.data?.message || 'Failed to create academic year');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingYear) return;

    try {
      setFormLoading(true);
      await academicService.update(editingYear._id, formData);
      toast.success('Academic year updated successfully');
      setIsEditDialogOpen(false);
      setEditingYear(null);
      resetForm();
      await fetchAcademicData();
    } catch (error: any) {
      console.error('Failed to update academic year:', error);
      toast.error(error.response?.data?.message || 'Failed to update academic year');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await academicService.delete(id);
      toast.success('Academic year deleted successfully');
      await fetchAcademicData();
    } catch (error: any) {
      console.error('Failed to delete academic year:', error);
      toast.error(error.response?.data?.message || 'Failed to delete academic year');
    }
  };

  const handleSetCurrent = async (id: string) => {
    try {
      await academicService.setCurrent(id);
      toast.success('Current academic year updated successfully');
      await fetchAcademicData();
    } catch (error: any) {
      console.error('Failed to set current year:', error);
      toast.error(error.response?.data?.message || 'Failed to set current year');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      start_date: '',
      end_date: '',
      is_current: false,
      status: 'active'
    });
  };

  const openEditDialog = (year: AcademicYear) => {
    setEditingYear(year);
    setFormData({
      name: year.name,
      start_date: year.start_date.split('T')[0],
      end_date: year.end_date.split('T')[0],
      is_current: year.is_current,
      status: year.status as 'active' | 'inactive'
    });
    setIsEditDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    if (now < start) return 0;
    if (now > end) return 100;

    return Math.round(((now - start) / (end - start)) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading academic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Academic Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage academic years and terms for your school</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/academic/sections">
              <Users className="h-4 w-4 mr-2" />
              Manage Sections
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/academic/overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </Link>
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                New Academic Year
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Academic Year</DialogTitle>
                <DialogDescription>
                  Add a new academic year for your school.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Academic Year Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., 2024-2025"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_current"
                    checked={formData.is_current}
                    onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="is_current">Set as current academic year</Label>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={formLoading}>
                    {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Current Academic Year */}
      {currentYear && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Current Academic Year
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{currentYear.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Start: {new Date(currentYear.start_date).toLocaleDateString()}</p>
                  <p>End: {new Date(currentYear.end_date).toLocaleDateString()}</p>
                  <Badge className={getStatusColor(currentYear.status)}>
                    {currentYear.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Year Progress</span>
                  <span className="text-sm text-gray-600">{calculateProgress(currentYear.start_date, currentYear.end_date)}%</span>
                </div>
                <Progress value={calculateProgress(currentYear.start_date, currentYear.end_date)} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((new Date().getTime() - new Date(currentYear.start_date).getTime()) / (1000 * 60 * 60 * 24))} days completed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Academic Years */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            All Academic Years
          </CardTitle>
        </CardHeader>
        <CardContent>
          {academicYears.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Academic Years Found</h3>
              <p className="text-gray-600 mb-4">Create your first academic year to get started.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Academic Year
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {academicYears.map((year) => (
                <div key={year._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    {year.is_current && (
                      <Star className="h-5 w-5 text-yellow-500" />
                    )}
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium text-lg">{year.name}</h4>
                        <Badge className={getStatusColor(year.status)}>
                          {year.status}
                        </Badge>
                        {year.is_current && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(year.start_date).toLocaleDateString()} - {new Date(year.end_date).toLocaleDateString()}
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500">Progress:</span>
                          <span className="text-xs font-medium">{calculateProgress(year.start_date, year.end_date)}%</span>
                        </div>
                        <Progress value={calculateProgress(year.start_date, year.end_date)} className="h-1 w-32" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!year.is_current && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetCurrent(year._id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Set Current
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(year)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={year.is_current}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the academic year "{year.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(year._id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Academic Year</DialogTitle>
            <DialogDescription>
              Update academic year information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_name">Academic Year Name</Label>
              <Input
                id="edit_name"
                placeholder="e.g., 2024-2025"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_start_date">Start Date</Label>
                <Input
                  id="edit_start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_end_date">End Date</Label>
                <Input
                  id="edit_end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'completed') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit_is_current"
                checked={formData.is_current}
                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="edit_is_current">Set as current academic year</Label>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}