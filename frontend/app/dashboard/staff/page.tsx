'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Users,
    UserPlus,
    Search,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    Mail,
    Phone,
    Calendar,
    MapPin,
    GraduationCap,
    Briefcase,
    DollarSign,
    AlertCircle
} from 'lucide-react';

import { Staff, CreateStaffDto, UpdateStaffDto } from '@/types/staff';
import { staffService, StaffFilters, StaffStats } from '@/lib/api/services/staff.service';

export default function StaffPage() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [stats, setStats] = useState<StaffStats>({
        totalStaff: 0,
        present: 0,
        absent: 0,
        onLeave: 0,
        activeStaff: 0,
        inactiveStaff: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedDesignation, setSelectedDesignation] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [activeTab, setActiveTab] = useState('all');

    // Form state for creating/editing staff
    const [formData, setFormData] = useState<CreateStaffDto>({
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        designation: '',
        department: '',
        joiningDate: new Date().toISOString().split('T')[0], // Always string
        qualification: '',
        experience: '',
        salary: 0,
        address: '',
        emergencyContact: ''
    });

    // Available options from service
    const departments = staffService.getDepartments();
    const designations = staffService.getDesignations();

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStaff();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedDepartment, selectedDesignation, selectedStatus, currentPage]);

    // Initial data fetch
    useEffect(() => {
        fetchStaff();
        fetchStats();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const filters: StaffFilters = {
                page: currentPage,
                limit: 10
            };

            if (searchQuery.trim()) {
                filters.search = searchQuery.trim();
            }

            if (selectedDepartment !== 'all') {
                filters.department = selectedDepartment;
            }

            if (selectedDesignation !== 'all') {
                filters.designation = selectedDesignation;
            }

            if (selectedStatus !== 'all') {
                filters.status = selectedStatus;
            }

            const response = await staffService.getAll(filters);
            setStaff(response.data);

            if (response.meta) {
                setTotalPages(response.meta.totalPages);
            }
        } catch (error) {
            toast.error('Failed to fetch staff data');
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const statsData = await staffService.getStats();
            setStats(statsData);
        } catch (error) {
            console.error('Error fetching staff stats:', error);
        }
    };

    // Filter staff by tab
    const filteredStaff = useMemo(() => {
        if (activeTab === 'all') return staff;
        if (activeTab === 'active') return staff.filter(s => s.status === 'active');
        if (activeTab === 'inactive') return staff.filter(s => s.status === 'inactive');
        return staff;
    }, [staff, activeTab]);

    const handleCreateStaff = async () => {
        try {
            if (!formData.name || !formData.email || !formData.designation) {
                toast.error('Please fill in all required fields');
                return;
            }

            await staffService.create(formData);
            toast.success('Staff member created successfully');

            setIsCreateDialogOpen(false);
            resetForm();
            fetchStaff();
            fetchStats();
        } catch (error) {
            toast.error('Failed to create staff member');
            console.error('Error creating staff:', error);
        }
    };

    const handleUpdateStaff = async () => {
        try {
            if (!selectedStaff || !formData.name || !formData.email || !formData.designation) {
                toast.error('Please fill in all required fields');
                return;
            }

            const updateData: UpdateStaffDto = {
                name: formData.name,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                designation: formData.designation,
                department: formData.department,
                qualification: formData.qualification,
                experience: formData.experience,
                salary: formData.salary,
                address: formData.address,
                emergencyContact: formData.emergencyContact
            };

            await staffService.update(selectedStaff.id, updateData);
            toast.success('Staff member updated successfully');

            setIsEditDialogOpen(false);
            setSelectedStaff(null);
            resetForm();
            fetchStaff();
            fetchStats();
        } catch (error) {
            toast.error('Failed to update staff member');
            console.error('Error updating staff:', error);
        }
    };

    const handleDeleteStaff = async (staffMember: Staff) => {
        if (!window.confirm(`Are you sure you want to delete ${staffMember.name}?`)) {
            return;
        }

        try {
            await staffService.delete(staffMember.id);
            toast.success('Staff member deleted successfully');

            fetchStaff();
            fetchStats();
        } catch (error) {
            toast.error('Failed to delete staff member');
            console.error('Error deleting staff:', error);
        }
    };

    const openEditDialog = (staffMember: Staff) => {
        setSelectedStaff(staffMember);
        setFormData({
            name: staffMember.name,
            firstName: staffMember.firstName,
            lastName: staffMember.lastName,
            email: staffMember.email,
            password: '',
            phone: staffMember.phone,
            designation: staffMember.designation,
            department: staffMember.department,
            joiningDate: staffMember.joiningDate
                ? (typeof staffMember.joiningDate === 'string'
                    ? staffMember.joiningDate.split('T')[0]
                    : new Date(staffMember.joiningDate).toISOString().split('T')[0])
                : new Date().toISOString().split('T')[0],
            qualification: staffMember.qualification || '',
            experience: staffMember.experience || '',
            salary: staffMember.salary || 0,
            address: staffMember.address || '',
            emergencyContact: staffMember.emergencyContact || ''
        });
        setIsEditDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',
            designation: '',
            department: '',
            joiningDate: new Date().toISOString().split('T')[0],
            qualification: '',
            experience: '',
            salary: 0,
            address: '',
            emergencyContact: ''
        });
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage school staff members and their information</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add Staff
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add New Staff Member</DialogTitle>
                                <DialogDescription>Enter the staff member details below</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        placeholder="Enter first name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        placeholder="Enter last name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Enter email address"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Enter password"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Enter phone number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="designation">Designation *</Label>
                                    <Select value={formData.designation} onValueChange={(value) => setFormData({ ...formData, designation: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select designation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {designations.map((designation) => (
                                                <SelectItem key={designation} value={designation}>
                                                    {designation}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((department) => (
                                                <SelectItem key={department} value={department}>
                                                    {department}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="joiningDate">Joining Date</Label>
                                    <Input
                                        id="joiningDate"
                                        type="date"
                                        value={formData.joiningDate || new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="qualification">Qualification</Label>
                                    <Input
                                        id="qualification"
                                        value={formData.qualification}
                                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                        placeholder="Enter qualification"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="experience">Experience</Label>
                                    <Input
                                        id="experience"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        placeholder="e.g. 5 years"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="salary">Salary</Label>
                                    <Input
                                        id="salary"
                                        type="number"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                                        placeholder="Enter salary"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Enter address"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                                    <Input
                                        id="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                        placeholder="Enter emergency contact"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateStaff}>
                                    Create Staff
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                        <Users className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStaff}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.activeStaff}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.inactiveStaff}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.present}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Absent</CardTitle>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.absent}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                        <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{stats.onLeave}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="search">Search Staff</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    id="search"
                                    placeholder="Search by name, email, or ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="department">Department</Label>
                            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="designation">Designation</Label>
                            <Select value={selectedDesignation} onValueChange={setSelectedDesignation}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Designations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Designations</SelectItem>
                                    {designations.map((designation) => (
                                        <SelectItem key={designation} value={designation}>
                                            {designation}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
                    </div>
                </CardContent>
            </Card>

            {/* Staff List with Tabs */}
            <Card>
                <CardHeader>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="all">All Staff ({staff.length})</TabsTrigger>
                            <TabsTrigger value="active">Active ({staff.filter(s => s.status === 'active').length})</TabsTrigger>
                            <TabsTrigger value="inactive">Inactive ({staff.filter(s => s.status === 'inactive').length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab}>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                        <p className="mt-2 text-gray-500">Loading staff...</p>
                                    </div>
                                ) : filteredStaff.length === 0 ? (
                                    <div className="text-center py-8">
                                        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500">No staff members found</p>
                                    </div>
                                ) : (
                                    filteredStaff.map((staffMember) => (
                                        <Card key={staffMember.id}>
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-4">
                                                        <Avatar className="h-12 w-12">
                                                            <AvatarImage src={staffMember.profilePicture} alt={staffMember.name} />
                                                            <AvatarFallback>{getInitials(staffMember.name)}</AvatarFallback>
                                                        </Avatar>

                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="text-lg font-semibold">{staffMember.name}</h3>
                                                                <Badge variant={staffMember.status === 'active' ? 'default' : 'secondary'}>
                                                                    {staffMember.status}
                                                                </Badge>
                                                                <span className="text-sm text-gray-500">#{staffMember.employeeId}</span>
                                                            </div>

                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <Briefcase className="h-4 w-4 text-gray-400" />
                                                                    <span>{staffMember.designation}</span>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <Users className="h-4 w-4 text-gray-400" />
                                                                    <span>{staffMember.department}</span>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                                    <span className="truncate">{staffMember.email}</span>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                                    <span>{staffMember.phone || 'N/A'}</span>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                                    <span>Joined: {formatDate(staffMember.joiningDate)}</span>
                                                                </div>

                                                                {staffMember.qualification && (
                                                                    <div className="flex items-center gap-2">
                                                                        <GraduationCap className="h-4 w-4 text-gray-400" />
                                                                        <span>{staffMember.qualification}</span>
                                                                    </div>
                                                                )}

                                                                {staffMember.experience && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Briefcase className="h-4 w-4 text-gray-400" />
                                                                        <span>{staffMember.experience} exp.</span>
                                                                    </div>
                                                                )}

                                                                {staffMember.salary && (
                                                                    <div className="flex items-center gap-2">
                                                                        <DollarSign className="h-4 w-4 text-gray-400" />
                                                                        <span>₹{staffMember.salary.toLocaleString()}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {staffMember.address && (
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <MapPin className="h-4 w-4 text-gray-400" />
                                                                    <span className="truncate">{staffMember.address}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openEditDialog(staffMember)}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteStaff(staffMember)}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardHeader>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Edit Staff Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Staff Member</DialogTitle>
                        <DialogDescription>Update the staff member details below</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="editName">Full Name *</Label>
                            <Input
                                id="editName"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editFirstName">First Name</Label>
                            <Input
                                id="editFirstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                placeholder="Enter first name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editLastName">Last Name</Label>
                            <Input
                                id="editLastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                placeholder="Enter last name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editEmail">Email *</Label>
                            <Input
                                id="editEmail"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter email address"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editPhone">Phone</Label>
                            <Input
                                id="editPhone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editDesignation">Designation *</Label>
                            <Select value={formData.designation} onValueChange={(value) => setFormData({ ...formData, designation: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select designation" />
                                </SelectTrigger>
                                <SelectContent>
                                    {designations.map((designation) => (
                                        <SelectItem key={designation} value={designation}>
                                            {designation}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editDepartment">Department</Label>
                            <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((department) => (
                                        <SelectItem key={department} value={department}>
                                            {department}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editQualification">Qualification</Label>
                            <Input
                                id="editQualification"
                                value={formData.qualification}
                                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                placeholder="Enter qualification"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editExperience">Experience</Label>
                            <Input
                                id="editExperience"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                placeholder="e.g. 5 years"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editSalary">Salary</Label>
                            <Input
                                id="editSalary"
                                type="number"
                                value={formData.salary}
                                onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                                placeholder="Enter salary"
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="editAddress">Address</Label>
                            <Input
                                id="editAddress"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Enter address"
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="editEmergencyContact">Emergency Contact</Label>
                            <Input
                                id="editEmergencyContact"
                                value={formData.emergencyContact}
                                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                placeholder="Enter emergency contact"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateStaff}>
                            Update Staff
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}