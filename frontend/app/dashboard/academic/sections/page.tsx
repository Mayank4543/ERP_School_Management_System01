'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import {
  Users,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  MapPin,
  Clock,
  UserCheck,
  Building,
  Loader2,
  AlertTriangle,
  AlertCircle,
  Search,
  Filter,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';
import sectionsService from '@/lib/api/services/sections.service';
import academicService, { AcademicYear } from '@/lib/api/services/academic.service';
import teachersService from '@/lib/api/services/teachers.service';
import { Section, CreateSectionDto } from '@/types/academic';
import { Teacher } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function SectionsManagementPage() {
  const { user } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentAcademicYear, setCurrentAcademicYear] = useState<AcademicYear | null>(null);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    standard: 'all',
    shift: 'all',
    academicYearId: '',
    showInactive: false
  });

  // Form data
  const [formData, setFormData] = useState<CreateSectionDto>({
    school_id: user?.school_id ?? '',
    academic_year_id: '',
    name: '',
    standard: 1,
    capacity: 40,
    class_teacher_id: 'none',
    room_number: '',
    building: '',
    floor: '',
    shift: 'morning',
    remarks: ''
  });

  useEffect(() => {
    if (user?.school_id) {
      loadInitialData();
    } else if (user && !user.school_id) {
      // User is logged in but has no school_id
      setLoading(false);
      toast.error('No school ID found in user profile. Please contact administrator.');
    }
  }, [user?.school_id]);

  // Reload sections when academic year changes
  useEffect(() => {
    if (user?.school_id && currentAcademicYear?._id) {
      console.log('🔄 Academic year changed, reloading sections...');
      loadSections(currentAcademicYear._id);
    }
  }, [currentAcademicYear?._id, user?.school_id]);

  // Reload sections when filters change
  useEffect(() => {
    if (user?.school_id && (currentAcademicYear?._id || filters.academicYearId)) {
      console.log('🔄 Filters changed, reloading sections...');
      const debounceTimer = setTimeout(() => {
        loadSections(currentAcademicYear?._id || filters.academicYearId);
      }, 300); // Debounce to avoid too many API calls

      return () => clearTimeout(debounceTimer);
    }
  }, [filters.standard, filters.shift, filters.search, filters.showInactive, filters.academicYearId, user?.school_id, currentAcademicYear?._id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load academic years and current academic year
      const [academicYearsData, currentYearData] = await Promise.allSettled([
        academicService.getAll(),
        academicService.getCurrent()
      ]);

      let selectedAcademicYear = null;

      if (academicYearsData.status === 'fulfilled') {
        setAcademicYears(academicYearsData.value);
      }

      if (currentYearData.status === 'fulfilled') {
        setCurrentAcademicYear(currentYearData.value);
        selectedAcademicYear = currentYearData.value;
        setFilters(prev => ({ ...prev, academicYearId: currentYearData.value._id }));
        setFormData(prev => ({ ...prev, academic_year_id: currentYearData.value._id }));
      } else if (academicYearsData.status === 'fulfilled' && academicYearsData.value.length > 0) {
        // Fallback to first academic year if no current year is set
        selectedAcademicYear = academicYearsData.value[0];
        setFilters(prev => ({ ...prev, academicYearId: academicYearsData.value[0]._id }));
        setFormData(prev => ({ ...prev, academic_year_id: academicYearsData.value[0]._id }));
      }

      // Load teachers
      if (user?.school_id) {
        const teachersData = await teachersService.getAll({
          schoolId: user.school_id,
          page: 1,
          limit: 1000
        });
        setTeachers(teachersData.data);
      }

      // Load sections if we have an academic year
      if (selectedAcademicYear) {
        await loadSections(selectedAcademicYear._id);
      }

    } catch (error: any) {
      console.error('Failed to load initial data:', error);
      toast.error('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const loadSections = async (academicYearId?: string) => {
    if (!user?.school_id) {
      console.warn('No school_id available for user');
      return;
    }

    try {
      console.log('🔄 Loading sections with params:', {
        schoolId: user.school_id,
        academicYearId: academicYearId || filters.academicYearId,
        standard: filters.standard !== 'all' ? filters.standard : undefined,
        shift: filters.shift !== 'all' ? filters.shift : undefined
      });

      const sectionsData = await sectionsService.getAll({
        schoolId: user.school_id,
        academicYearId: academicYearId || filters.academicYearId || undefined,
        standard: filters.standard && filters.standard !== 'all' ? parseInt(filters.standard) : undefined,
        shift: filters.shift && filters.shift !== 'all' ? filters.shift as any : undefined,
        page: 1,
        limit: 1000
      });

      console.log('📦 Sections API response:', sectionsData);
      console.log('📊 Sections data array:', sectionsData.data);
      console.log('📈 Number of sections:', sectionsData.data?.length);

      // Ensure we have a valid array to work with
      let filteredSections = Array.isArray(sectionsData.data) ? sectionsData.data : [];

      console.log('✅ Initial sections count:', filteredSections.length);

      // Apply client-side filters
      if (filters.search && filteredSections.length > 0) {
        filteredSections = filteredSections.filter(section =>
          section.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          section.room_number?.toLowerCase().includes(filters.search.toLowerCase()) ||
          section.building?.toLowerCase().includes(filters.search.toLowerCase())
        );
        console.log('🔍 After search filter:', filteredSections.length);
      }

      if (!filters.showInactive && filteredSections.length > 0) {
        filteredSections = filteredSections.filter(section => section.is_active);
        console.log('👁️ After active filter:', filteredSections.length);
      }

      console.log('🎯 Final sections to display:', filteredSections);
      setSections(filteredSections);
    } catch (error: any) {
      console.error('❌ Failed to load sections:', error);
      toast.error(error.response?.data?.error?.message || error.response?.data?.message || 'Failed to load sections');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.school_id) {
      toast.error('School information not available. Please refresh and try again.');
      return;
    }

    // Validate required fields
    if (!formData.academic_year_id) {
      toast.error('Please select an academic year');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Please enter a section name');
      return;
    }

    try {
      setFormLoading(true);
      const sectionData = {
        ...formData,
        school_id: user.school_id,
        class_teacher_id: formData.class_teacher_id === 'none' ? undefined : formData.class_teacher_id || undefined
      };

      console.log('Creating section with data:', sectionData);

      await sectionsService.create(sectionData);
      toast.success('Section created successfully');
      setCreateDialogOpen(false);
      resetForm();

      // Reload sections with current academic year
      await loadSections(currentAcademicYear?._id || filters.academicYearId);
    } catch (error: any) {
      console.error('Error creating section:', error);

      // Handle different error formats
      let message = 'Failed to create section';

      if (error.name === 'ConflictError') {
        // Custom error from our service
        message = error.message;
      } else if (error?.response?.data?.error?.message) {
        // Backend error format: { success: false, error: { message: "..." } }
        message = error.response.data.error.message;
      } else if (error?.response?.data?.message) {
        // Direct backend message
        message = error.response.data.message;
      } else if (error?.message && error.message !== 'Request failed with status code 409') {
        // Other meaningful error messages
        message = error.message;
      }

      toast.error(message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    try {
      setFormLoading(true);
      const updateData = {
        ...formData,
        class_teacher_id: formData.class_teacher_id === 'none' ? undefined : formData.class_teacher_id || undefined
      };

      await sectionsService.update(editingSection._id, updateData);
      toast.success('Section updated successfully');
      setEditDialogOpen(false);
      setEditingSection(null);
      resetForm();
      await loadSections(currentAcademicYear?._id || filters.academicYearId);
    } catch (error: any) {
      console.error('Error updating section:', error);

      // Handle different error formats
      let message = 'Failed to update section';

      if (error.name === 'ConflictError') {
        // Custom error from our service
        message = error.message;
      } else if (error?.response?.data?.error?.message) {
        // Backend error format: { success: false, error: { message: "..." } }
        message = error.response.data.error.message;
      } else if (error?.response?.data?.message) {
        // Direct backend message
        message = error.response.data.message;
      } else if (error?.message && error.message !== 'Request failed with status code 409') {
        // Other meaningful error messages
        message = error.message;
      }

      toast.error(message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await sectionsService.delete(id);
      toast.success('Section deleted successfully');
      await loadSections(currentAcademicYear?._id || filters.academicYearId);
    } catch (error: any) {
      console.error('Failed to delete section:', error);
      toast.error(error.response?.data?.message || 'Failed to delete section');
    }
  };

  const resetForm = () => {
    setFormData({
      school_id: user?.school_id ?? '',
      academic_year_id: currentAcademicYear?._id || '',
      name: '',
      standard: 1,
      capacity: 40,
      class_teacher_id: 'none',
      room_number: '',
      building: '',
      floor: '',
      shift: 'morning',
      remarks: ''
    });
  };

  const openEditDialog = (section: Section) => {
    setEditingSection(section);
    setFormData({
      school_id: section.school_id,
      academic_year_id: section.academic_year_id,
      name: section.name,
      standard: section.standard,
      capacity: section.capacity,
      class_teacher_id: section.class_teacher_id || 'none',
      room_number: section.room_number || '',
      building: section.building || '',
      floor: section.floor || '',
      shift: section.shift,
      remarks: section.remarks || ''
    });
    setEditDialogOpen(true);
  };

  const getShiftBadgeColor = (shift: string) => {
    switch (shift) {
      case 'morning': return 'bg-blue-100 text-blue-800';
      case 'afternoon': return 'bg-orange-100 text-orange-800';
      case 'evening': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCapacityStatus = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 100) return { color: 'text-red-600', status: 'Full' };
    if (percentage >= 90) return { color: 'text-orange-600', status: 'Nearly Full' };
    if (percentage >= 75) return { color: 'text-yellow-600', status: 'Good' };
    return { color: 'text-green-600', status: 'Available' };
  };

  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.standard]) {
      acc[section.standard] = [];
    }
    acc[section.standard].push(section);
    return acc;
  }, {} as Record<number, Section[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading sections...</p>
        </div>
      </div>
    );
  }

  if (!user?.school_id) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-gray-600">School ID not found. Please contact administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Section Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage school sections, class assignments, and capacity</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setCreateDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                New Section
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Section</DialogTitle>
                <DialogDescription>
                  Add a new section to your school.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="academic_year">Academic Year</Label>
                    <Select
                      value={formData.academic_year_id}
                      onValueChange={(value) => setFormData({ ...formData, academic_year_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicYears.map((year) => (
                          <SelectItem key={year._id} value={year._id}>
                            {year.name} {year.is_current && '(Current)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="standard">Class/Standard</Label>
                    <Select
                      value={formData.standard.toString()}
                      onValueChange={(value) => setFormData({ ...formData, standard: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((std) => (
                          <SelectItem key={std} value={std.toString()}>
                            Class {std}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Section Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., A, B, C"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class_teacher">Class Teacher (Optional)</Label>
                  <Select
                    value={formData.class_teacher_id}
                    onValueChange={(value) => setFormData({ ...formData, class_teacher_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Class Teacher</SelectItem>
                      {teachers.filter(t => t.is_active).map((teacher) => (
                        <SelectItem key={teacher._id} value={teacher._id}>
                          {teacher.first_name} {teacher.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="room_number">Room Number</Label>
                    <Input
                      id="room_number"
                      placeholder="101"
                      value={formData.room_number}
                      onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="building">Building</Label>
                    <Input
                      id="building"
                      placeholder="Main Block"
                      value={formData.building}
                      onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor">Floor</Label>
                    <Input
                      id="floor"
                      placeholder="Ground"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shift">Shift</Label>
                  <Select
                    value={formData.shift}
                    onValueChange={(value: 'morning' | 'afternoon' | 'evening') => setFormData({ ...formData, shift: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks (Optional)</Label>
                  <Input
                    id="remarks"
                    placeholder="Additional notes"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={formLoading}>
                    {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Section
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sections..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Select
                value={filters.academicYearId}
                onValueChange={(value) => {
                  setFilters({ ...filters, academicYearId: value });
                  loadSections(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year._id} value={year._id}>
                      {year.name} {year.is_current && '(Current)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Class/Standard</Label>
              <Select
                value={filters.standard}
                onValueChange={(value) => {
                  setFilters({ ...filters, standard: value });
                  loadSections();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((std) => (
                    <SelectItem key={std} value={std.toString()}>
                      Class {std}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Shift</Label>
              <Select
                value={filters.shift}
                onValueChange={(value) => {
                  setFilters({ ...filters, shift: value });
                  loadSections();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All shifts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showInactive"
                checked={filters.showInactive}
                onChange={(e) => {
                  setFilters({ ...filters, showInactive: e.target.checked });
                  loadSections();
                }}
                className="rounded"
              />
              <Label htmlFor="showInactive">Show inactive sections</Label>
            </div>
            <Button variant="outline" size="sm" onClick={() => loadSections()}>
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sections Display */}
      {sections.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sections Found</h3>
            <p className="text-gray-600 mb-4">Create your first section to get started.</p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSections)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([standard, standardSections]) => (
              <Card key={standard}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Class {standard} Sections ({standardSections.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {standardSections.map((section) => {
                      const capacityStatus = getCapacityStatus(section.current_strength, section.capacity);
                      const classTeacher = teachers.find(t => t._id === section.class_teacher_id);

                      return (
                        <div key={section._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">Section {section.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getShiftBadgeColor(section.shift)}>
                                  <Clock className="h-3 w-3 mr-1" />
                                  {section.shift}
                                </Badge>
                                {!section.is_active && (
                                  <Badge variant="secondary">Inactive</Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(section)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Section</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete Section {section.name} of Class {section.standard}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(section._id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-gray-500" />
                                Students
                              </span>
                              <span className={`font-medium ${capacityStatus.color}`}>
                                {section.current_strength}/{section.capacity} ({capacityStatus.status})
                              </span>
                            </div>

                            {classTeacher && (
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                  <UserCheck className="h-4 w-4 text-gray-500" />
                                  Class Teacher
                                </span>
                                <span className="font-medium">
                                  {classTeacher.first_name} {classTeacher.last_name}
                                </span>
                              </div>
                            )}

                            {section.room_number && (
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-gray-500" />
                                  Location
                                </span>
                                <span className="font-medium">
                                  {section.building && `${section.building}, `}
                                  {section.floor && `${section.floor}, `}
                                  Room {section.room_number}
                                </span>
                              </div>
                            )}

                            {section.remarks && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                {section.remarks}
                              </div>
                            )}
                          </div>

                          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${capacityStatus.color === 'text-red-600' ? 'bg-red-500' :
                                  capacityStatus.color === 'text-orange-600' ? 'bg-orange-500' :
                                    capacityStatus.color === 'text-yellow-600' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                              style={{
                                width: `${Math.min((section.current_strength / section.capacity) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Update section information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_academic_year">Academic Year</Label>
                <Select
                  value={formData.academic_year_id}
                  onValueChange={(value) => setFormData({ ...formData, academic_year_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year._id} value={year._id}>
                        {year.name} {year.is_current && '(Current)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_standard">Class/Standard</Label>
                <Select
                  value={formData.standard.toString()}
                  onValueChange={(value) => setFormData({ ...formData, standard: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((std) => (
                      <SelectItem key={std} value={std.toString()}>
                        Class {std}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_name">Section Name</Label>
                <Input
                  id="edit_name"
                  placeholder="e.g., A, B, C"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_capacity">Capacity</Label>
                <Input
                  id="edit_capacity"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_class_teacher">Class Teacher (Optional)</Label>
              <Select
                value={formData.class_teacher_id}
                onValueChange={(value) => setFormData({ ...formData, class_teacher_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Class Teacher</SelectItem>
                  {teachers.filter(t => t.is_active).map((teacher) => (
                    <SelectItem key={teacher._id} value={teacher._id}>
                      {teacher.first_name} {teacher.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_room_number">Room Number</Label>
                <Input
                  id="edit_room_number"
                  placeholder="101"
                  value={formData.room_number}
                  onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_building">Building</Label>
                <Input
                  id="edit_building"
                  placeholder="Main Block"
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_floor">Floor</Label>
                <Input
                  id="edit_floor"
                  placeholder="Ground"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_shift">Shift</Label>
              <Select
                value={formData.shift}
                onValueChange={(value: 'morning' | 'afternoon' | 'evening') => setFormData({ ...formData, shift: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_remarks">Remarks (Optional)</Label>
              <Input
                id="edit_remarks"
                placeholder="Additional notes"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Section
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}