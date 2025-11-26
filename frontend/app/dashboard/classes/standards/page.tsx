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
    GraduationCap,
    Loader2,
    AlertTriangle,
    Search,
    Building,
    Clock
} from 'lucide-react';
import { toast } from 'sonner';
import sectionsService from '@/lib/api/services/sections.service';
import academicService, { AcademicYear } from '@/lib/api/services/academic.service';
import teachersService from '@/lib/api/services/teachers.service';
import { Section, CreateSectionDto } from '@/types/academic';
import { Teacher } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface StandardInfo {
    standard: number;
    totalSections: number;
    totalStudents: number;
    totalCapacity: number;
    sections: Section[];
    teachers: Teacher[];
}

export default function StandardsManagementPage() {
    const { user } = useAuth();
    const [standards, setStandards] = useState<StandardInfo[]>([]);
    const [availableStandards, setAvailableStandards] = useState<number[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [currentAcademicYear, setCurrentAcademicYear] = useState<AcademicYear | null>(null);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        search: '',
        academicYearId: '',
    });

    // Form data for creating new sections
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
        }
    }, [user?.school_id]);

    useEffect(() => {
        if (user?.school_id && currentAcademicYear?._id) {
            loadStandardsData(currentAcademicYear._id);
        }
    }, [currentAcademicYear?._id, user?.school_id]);

    const loadInitialData = async () => {
        try {
            setLoading(true);

            // Load academic years and current academic year
            const [academicYearsData, currentYearData, teachersData] = await Promise.allSettled([
                academicService.getAll(),
                academicService.getCurrent(),
                user?.school_id ? teachersService.getAll({ schoolId: user.school_id, page: 1, limit: 1000 }) : Promise.resolve({ data: [] })
            ]);

            if (academicYearsData.status === 'fulfilled') {
                setAcademicYears(academicYearsData.value);
            }

            let selectedAcademicYear = null;
            if (currentYearData.status === 'fulfilled') {
                setCurrentAcademicYear(currentYearData.value);
                selectedAcademicYear = currentYearData.value;
                setFilters(prev => ({ ...prev, academicYearId: currentYearData.value._id }));
                setFormData(prev => ({ ...prev, academic_year_id: currentYearData.value._id }));
            } else if (academicYearsData.status === 'fulfilled' && academicYearsData.value.length > 0) {
                selectedAcademicYear = academicYearsData.value[0];
                setFilters(prev => ({ ...prev, academicYearId: academicYearsData.value[0]._id }));
                setFormData(prev => ({ ...prev, academic_year_id: academicYearsData.value[0]._id }));
            }

            if (teachersData.status === 'fulfilled') {
                setTeachers(teachersData.value.data);
            }

            // Load standards data if we have an academic year
            if (selectedAcademicYear) {
                await loadStandardsData(selectedAcademicYear._id);
            }

        } catch (error: any) {
            console.error('Failed to load initial data:', error);
            toast.error('Failed to load data. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    const loadStandardsData = async (academicYearId: string) => {
        if (!user?.school_id) return;

        try {
            console.log('🔄 Loading standards data...');

            // Fetch all sections and unique standards
            const [sectionsData, uniqueStandards] = await Promise.all([
                sectionsService.getAll({
                    schoolId: user.school_id,
                    academicYearId,
                    page: 1,
                    limit: 1000
                }),
                sectionsService.getUniqueStandards(academicYearId)
            ]);

            console.log('📚 Unique standards:', uniqueStandards);
            console.log('📊 Sections data:', sectionsData);

            setAvailableStandards(uniqueStandards);

            // Group sections by standard
            const standardsMap = new Map<number, StandardInfo>();

            // Initialize standards from unique standards list
            uniqueStandards.forEach(standard => {
                standardsMap.set(standard, {
                    standard,
                    totalSections: 0,
                    totalStudents: 0,
                    totalCapacity: 0,
                    sections: [],
                    teachers: []
                });
            });

            // Populate with section data
            if (sectionsData.data && Array.isArray(sectionsData.data)) {
                sectionsData.data.forEach((section: Section) => {
                    const standardInfo = standardsMap.get(section.standard);
                    if (standardInfo) {
                        standardInfo.totalSections++;
                        standardInfo.totalStudents += section.current_strength;
                        standardInfo.totalCapacity += section.capacity;
                        standardInfo.sections.push(section);

                        // Add unique teachers
                        if (section.class_teacher_id) {
                            const teacher = teachers.find(t => t._id === section.class_teacher_id);
                            if (teacher && !standardInfo.teachers.find(t => t._id === teacher._id)) {
                                standardInfo.teachers.push(teacher);
                            }
                        }
                    }
                });
            }

            const standardsArray = Array.from(standardsMap.values())
                .sort((a, b) => a.standard - b.standard);

            setStandards(standardsArray);
        } catch (error) {
            console.error('❌ Failed to load standards data:', error);
            toast.error('Failed to load standards data');
        }
    };

    const handleCreateSection = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.school_id) {
            toast.error('School information not available');
            return;
        }

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

            await sectionsService.create(sectionData);
            toast.success('Section created successfully');
            setCreateDialogOpen(false);
            resetForm();

            // Reload standards data
            await loadStandardsData(currentAcademicYear?._id || filters.academicYearId);
        } catch (error: any) {
            console.error('Error creating section:', error);
            let message = 'Failed to create section';
            if (error.name === 'ConflictError') {
                message = error.message;
            } else if (error?.response?.data?.error?.message) {
                message = error.response.data.error.message;
            }
            toast.error(message);
        } finally {
            setFormLoading(false);
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

    const getCapacityPercentage = (current: number, total: number) => {
        return total > 0 ? Math.round((current / total) * 100) : 0;
    };

    const getCapacityStatus = (percentage: number) => {
        if (percentage >= 100) return { color: 'bg-red-500', textColor: 'text-red-600', status: 'Full' };
        if (percentage >= 90) return { color: 'bg-orange-500', textColor: 'text-orange-600', status: 'Nearly Full' };
        if (percentage >= 75) return { color: 'bg-yellow-500', textColor: 'text-yellow-600', status: 'Good' };
        return { color: 'bg-green-500', textColor: 'text-green-600', status: 'Available' };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-600">Loading standards...</p>
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
                    <h1 className="text-2xl font-semibold text-gray-900">Standards Management</h1>
                    <p className="text-sm text-gray-600 mt-1">Overview and management of all class standards and their sections</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/academic/sections">
                            <Building className="h-4 w-4 mr-2" />
                            Manage Sections
                        </Link>
                    </Button>
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { resetForm(); setCreateDialogOpen(true); }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Section
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Create New Section</DialogTitle>
                                <DialogDescription>
                                    Add a new section to a standard/class.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateSection} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
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
                                </div>

                                <div className="grid grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Academic Year</Label>
                            <Select
                                value={filters.academicYearId}
                                onValueChange={(value) => {
                                    setFilters({ ...filters, academicYearId: value });
                                    loadStandardsData(value);
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
                            <Label>Search Standards</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by class number..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Standards</CardTitle>
                        <GraduationCap className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{standards.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
                        <BookOpen className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {standards.reduce((acc, std) => acc + std.totalSections, 0)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {standards.reduce((acc, std) => acc + std.totalStudents, 0)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {standards.reduce((acc, std) => acc + std.totalCapacity, 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Standards Display */}
            {standards.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Standards Found</h3>
                        <p className="text-gray-600 mb-4">Create sections to establish standards for your school.</p>
                        <Button onClick={() => setCreateDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Section
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {standards
                        .filter(std =>
                            !filters.search ||
                            std.standard.toString().includes(filters.search) ||
                            `Class ${std.standard}`.toLowerCase().includes(filters.search.toLowerCase())
                        )
                        .map((standardInfo) => {
                            const capacityPercentage = getCapacityPercentage(
                                standardInfo.totalStudents,
                                standardInfo.totalCapacity
                            );
                            const capacityStatus = getCapacityStatus(capacityPercentage);

                            return (
                                <Card key={standardInfo.standard} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <BookOpen className="h-5 w-5 text-blue-600" />
                                                Class {standardInfo.standard}
                                            </CardTitle>
                                            <Badge variant="outline">
                                                {standardInfo.totalSections} Section{standardInfo.totalSections !== 1 ? 's' : ''}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Statistics */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Students</p>
                                                <p className="text-xl font-bold text-blue-600">{standardInfo.totalStudents}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Capacity</p>
                                                <p className="text-xl font-bold">{standardInfo.totalCapacity}</p>
                                            </div>
                                        </div>

                                        {/* Capacity Status */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Capacity Status</span>
                                                <span className={`text-sm font-medium ${capacityStatus.textColor}`}>
                                                    {capacityPercentage}% ({capacityStatus.status})
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${capacityStatus.color}`}
                                                    style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Sections List */}
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-500">Sections</p>
                                            <div className="flex flex-wrap gap-2">
                                                {standardInfo.sections.map((section) => (
                                                    <Badge
                                                        key={section._id}
                                                        variant="secondary"
                                                        className="text-xs flex items-center gap-1"
                                                    >
                                                        {section.name}
                                                        <span className="text-gray-400">
                                                            ({section.current_strength}/{section.capacity})
                                                        </span>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Teachers */}
                                        {standardInfo.teachers.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-500">Class Teachers</p>
                                                <div className="space-y-1">
                                                    {standardInfo.teachers.map((teacher) => (
                                                        <div key={teacher._id} className="text-sm">
                                                            {teacher.first_name} {teacher.last_name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2 border-t">
                                            <Button variant="outline" size="sm" asChild className="flex-1">
                                                <Link href={`/dashboard/academic/sections?standard=${standardInfo.standard}`}>
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Manage
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild className="flex-1">
                                                <Link href={`/dashboard/students?standard=${standardInfo.standard}`}>
                                                    <Users className="h-4 w-4 mr-1" />
                                                    Students
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                </div>
            )}
        </div>
    );
}