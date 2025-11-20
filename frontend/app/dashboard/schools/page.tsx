'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { superAdminService } from '@/lib/api/super-admin.service';
import { toast } from 'sonner';
import { School, Users, GraduationCap, UserCheck, Search, Plus, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SchoolData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  state: string;
  city: string;
  pincode?: string;
  board?: string;
  website?: string;
  status: boolean;
  user_count?: number;
  student_count?: number;
  teacher_count?: number;
  createdAt: string;
  updatedAt?: string;
}

export default function AllSchoolsPage() {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<SchoolData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
    board: '',
    website: '',
    status: true
  });
  const [createFormData, setCreateFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
    board: '',
    website: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Helper function for safe date formatting
  const formatDate = (dateString: string | undefined | null, options?: Intl.DateTimeFormatOptions) => {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', options || {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    filterSchools();
  }, [schools, searchTerm, selectedStatus]);

  const fetchSchools = async () => {
    try {
      setIsLoading(true);
      const response = await superAdminService.getAllSchools({ limit: 100 });
      
      if (response.success && response.data?.schools) {
        setSchools(response.data.schools);
        if (response.message && response.message.includes('Demo data loaded')) {
          toast.info('Running in demo mode - Backend unavailable');
        }
      } else {
        // If API fails but doesn't return demo data, show empty state
        console.error('Failed to fetch schools:', response.message);
        toast.error(response.message || 'Failed to load schools');
        setSchools([]);
      }
    } catch (error) {
      console.error('Failed to fetch schools:', error);
      toast.error('Failed to load schools');
      setSchools([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterSchools = () => {
    let filtered = schools;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.pincode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(school => 
        selectedStatus === 'active' ? school.status : !school.status
      );
    }

    setFilteredSchools(filtered);
  };

  const handleViewSchool = (school: SchoolData) => {
    if (!school || !school._id) {
      toast.error('Invalid school data');
      return;
    }
    setSelectedSchool(school);
    setShowViewDialog(true);
  };

  const handleEditSchool = (school: SchoolData) => {
    if (!school || !school._id) {
      toast.error('Invalid school data');
      return;
    }
    setSelectedSchool(school);
    setEditFormData({
      name: school.name,
      email: school.email,
      phone: school.phone || '',
      address: school.address || '',
      state: school.state || '',
      city: school.city || '',
      pincode: school.pincode || '',
      board: school.board || '',
      website: school.website || '',
      status: school.status
    });
    setShowEditDialog(true);
  };

  const handleUpdateSchool = async () => {
    if (!selectedSchool || !selectedSchool._id) {
      toast.error('Invalid school selection');
      return;
    }
    
    // Validate form data
    if (!editFormData.name.trim() || !editFormData.email.trim() || !editFormData.state.trim() || !editFormData.city.trim() || !editFormData.pincode.trim()) {
      toast.error('School name, email, state, city, and pincode are required');
      return;
    }
    
    try {
      setIsUpdating(true);
      
      // Prepare data, removing empty strings for optional fields
      const schoolData: any = {
        name: editFormData.name,
        email: editFormData.email,
        state: editFormData.state,
        city: editFormData.city,
        pincode: editFormData.pincode,
      };
      
      // Only include optional fields if they have values
      if (editFormData.phone?.trim()) schoolData.phone = editFormData.phone;
      if (editFormData.address?.trim()) schoolData.address = editFormData.address;
      if (editFormData.board?.trim()) schoolData.board = editFormData.board;
      if (editFormData.website?.trim()) schoolData.website = editFormData.website;
      
      const response = await superAdminService.updateSchool(selectedSchool._id, schoolData);
      
      if (response.success) {
        toast.success(response.message || 'School updated successfully');
        setShowEditDialog(false);
        fetchSchools();
      } else {
        toast.error(response.message || 'Failed to update school');
      }
    } catch (error) {
      console.error('Error updating school:', error);
      toast.error('Error updating school');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateSchool = async () => {
    if (!createFormData.name || !createFormData.email || !createFormData.state || !createFormData.city || !createFormData.pincode) {
      toast.error('Please fill in all required fields (Name, Email, State, City, Pincode)');
      return;
    }

    try {
      setIsCreating(true);
      
      // Prepare data, removing empty strings for optional fields
      const schoolData: any = {
        name: createFormData.name,
        email: createFormData.email,
        state: createFormData.state,
        city: createFormData.city,
        pincode: createFormData.pincode,
      };
      
      // Only include optional fields if they have values
      if (createFormData.phone?.trim()) schoolData.phone = createFormData.phone;
      if (createFormData.address?.trim()) schoolData.address = createFormData.address;
      if (createFormData.board?.trim()) schoolData.board = createFormData.board;
      if (createFormData.website?.trim()) schoolData.website = createFormData.website;
      
      const response = await superAdminService.createSchool(schoolData);
      
      if (response.success) {
        toast.success('School created successfully!');
        setShowCreateDialog(false);
        setCreateFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          state: '',
          city: '',
          pincode: '',
          board: '',
          website: ''
        });
        fetchSchools(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to create school');
      }
    } catch (error: any) {
      console.error('Error creating school:', error);
      toast.error(error.message || 'Failed to create school');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSchool = async (schoolId: string, schoolName: string) => {
    if (!schoolId) {
      toast.error('Invalid school ID');
      return;
    }
    
    if (confirm(`Are you sure you want to delete \"${schoolName}\"? This action cannot be undone and will affect all associated users and data.`)) {
      try {
        const response = await superAdminService.deleteSchool(schoolId);
        if (response.success) {
          toast.success(response.message || 'School deleted successfully');
          fetchSchools();
        } else {
          toast.error(response.message || 'Failed to delete school');
        }
      } catch (error) {
        console.error('Error deleting school:', error);
        toast.error('Error deleting school');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Schools</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all schools in the system</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add School
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search schools by name, email, phone, address, state, city, or pincode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {(['all', 'active', 'inactive'] as const).map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={selectedStatus === status ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <Card key={school._id} className="hover:shadow-md transition-shadow border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <School className="h-5 w-5 text-purple-600" />
                  <Badge 
                    variant={school.status ? 'default' : 'secondary'}
                    className={school.status ? 'bg-green-600' : 'bg-gray-400'}
                  >
                    {school.status ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewSchool(school)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditSchool(school)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit School
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => handleDeleteSchool(school._id, school.name)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete School
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{school.name}</h3>
                  <p className="text-sm text-gray-600">{school.email}</p>
                  {school.phone && (
                    <p className="text-sm text-gray-600">{school.phone}</p>
                  )}
                </div>
                
                {school.address && (
                  <p className="text-sm text-gray-500">{school.address}</p>
                )}
                
                <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-lg font-bold">{school.user_count || 0}</p>
                    <p className="text-xs text-gray-500">Users</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <GraduationCap className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-lg font-bold">{school.student_count || 0}</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <UserCheck className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-lg font-bold">{school.teacher_count || 0}</p>
                    <p className="text-xs text-gray-500">Teachers</p>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 pt-2">
                  Created: {formatDate(school.createdAt)}
                </div>
              </div>
            </CardContent>
          </Card>
          )
        )};
      </div>

      {filteredSchools.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or add a new school.</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add First School
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create School Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New School
            </DialogTitle>
            <DialogDescription>
              Create a new school with all required information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">School Name *</Label>
              <Input
                id="create-name"
                value={createFormData.name}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter school name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                value={createFormData.email}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-phone">Phone (Optional)</Label>
              <Input
                id="create-phone"
                value={createFormData.phone}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-address">Address (Optional)</Label>
              <Textarea
                id="create-address"
                value={createFormData.address}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter school address"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-state">State *</Label>
                <Input
                  id="create-state"
                  value={createFormData.state}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Enter state"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-city">City *</Label>
                <Input
                  id="create-city"
                  value={createFormData.city}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter city"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-pincode">Pincode *</Label>
                <Input
                  id="create-pincode"
                  value={createFormData.pincode}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, pincode: e.target.value }))}
                  placeholder="Enter pincode"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-board">Board (Optional)</Label>
                <Input
                  id="create-board"
                  value={createFormData.board}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, board: e.target.value }))}
                  placeholder="e.g., CBSE, ICSE, State Board"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-website">Website (Optional)</Label>
                <Input
                  id="create-website"
                  value={createFormData.website}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://school-website.com"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateSchool}
                disabled={isCreating || !createFormData.name || !createFormData.email || !createFormData.state || !createFormData.city || !createFormData.pincode}
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create School
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create School Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New School
            </DialogTitle>
            <DialogDescription>
              Create a new school with all required information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">School Name *</Label>
              <Input
                id="create-name"
                value={createFormData.name}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter school name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                value={createFormData.email}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-phone">Phone (Optional)</Label>
              <Input
                id="create-phone"
                value={createFormData.phone}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-address">Address (Optional)</Label>
              <Textarea
                id="create-address"
                value={createFormData.address}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter school address"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-state">State *</Label>
                <Input
                  id="create-state"
                  value={createFormData.state}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Enter state"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-city">City *</Label>
                <Input
                  id="create-city"
                  value={createFormData.city}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter city"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-pincode">Pincode *</Label>
                <Input
                  id="create-pincode"
                  value={createFormData.pincode}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, pincode: e.target.value }))}
                  placeholder="Enter pincode"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-board">Board (Optional)</Label>
                <Input
                  id="create-board"
                  value={createFormData.board}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, board: e.target.value }))}
                  placeholder="e.g., CBSE, ICSE, State Board"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-website">Website (Optional)</Label>
                <Input
                  id="create-website"
                  value={createFormData.website}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://school-website.com"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateSchool}
                disabled={isCreating || !createFormData.name || !createFormData.email || !createFormData.state || !createFormData.city || !createFormData.pincode}
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create School
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View School Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              School Details
            </DialogTitle>
            <DialogDescription>
              Complete information about the selected school
            </DialogDescription>
          </DialogHeader>
          {selectedSchool && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">School Name</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedSchool.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedSchool.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedSchool.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      <Badge 
                        variant={selectedSchool.status ? 'default' : 'secondary'}
                        className={selectedSchool.status ? 'bg-green-600' : 'bg-gray-400'}
                      >
                        {selectedSchool.status ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Created</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatDate(selectedSchool.createdAt, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedSchool.address && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSchool.address}</p>
                </div>
              )}
              
              {/* Location Information */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSchool.state || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSchool.city || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Pincode</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSchool.pincode || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{selectedSchool.user_count || 0}</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{selectedSchool.student_count || 0}</p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <UserCheck className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{selectedSchool.teacher_count || 0}</p>
                  <p className="text-sm text-gray-600">Teachers</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setShowViewDialog(false);
                  handleEditSchool(selectedSchool);
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit School
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit School Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit School
            </DialogTitle>
            <DialogDescription>
              Update school information and settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">School Name *</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={selectedSchool?.name || "Enter school name"}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder={selectedSchool?.email || "Enter email address"}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone (Optional)</Label>
              <Input
                id="edit-phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder={selectedSchool?.phone || "Enter phone number"}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address (Optional)</Label>
              <Textarea
                id="edit-address"
                value={editFormData.address}
                onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder={selectedSchool?.address || "Enter school address"}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-state">State *</Label>
                <Input
                  id="edit-state"
                  value={editFormData.state}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder={selectedSchool?.state || "Enter state"}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-city">City *</Label>
                <Input
                  id="edit-city"
                  value={editFormData.city}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder={selectedSchool?.city || "Enter city"}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-pincode">Pincode *</Label>
                <Input
                  id="edit-pincode"
                  value={editFormData.pincode}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, pincode: e.target.value }))}
                  placeholder={selectedSchool?.pincode || "Enter pincode"}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-board">Board</Label>
                <Input
                  id="edit-board"
                  value={editFormData.board}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, board: e.target.value }))}
                  placeholder="e.g., CBSE, ICSE, State Board"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-website">Website</Label>
                <Input
                  id="edit-website"
                  type="url"
                  value={editFormData.website}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-status"
                checked={editFormData.status}
                onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.checked }))}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="edit-status">School is active</Label>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateSchool}
                disabled={isUpdating || !editFormData.name || !editFormData.email || !editFormData.state || !editFormData.city || !editFormData.pincode}
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update School
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}