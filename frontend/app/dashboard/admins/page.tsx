'use client';

import { useState, useEffect } from 'react';
import { superAdminService } from '@/lib/api/super-admin.service';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  UserCheck, 
  Search, 
  Shield, 
  Mail,
  Phone,
  Calendar,
  School,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Crown,
  Plus,
  Filter,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Settings
} from 'lucide-react';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';


interface AdminUser {
  _id: string;
  name: string;
  email: string;
  mobile_no?: string;
  usergroup_id: 'admin' | 'superadmin';
  school_id?: string | {
    _id: string;
    name: string;
    email?: string;
  };
  is_activated: boolean;
  roles: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface CreateAdminData {
  name: string;
  email: string;
  password: string;
  mobile_no?: string;
  usergroup_id: 'admin' | 'superadmin';
  school_id?: string;
  roles: string[];
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'superadmin'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [createFormData, setCreateFormData] = useState<CreateAdminData>({
    name: '',
    email: '',
    password: '',
    mobile_no: '',
    usergroup_id: 'admin',
    school_id: '',
    roles: ['admin']
  });

  const [editFormData, setEditFormData] = useState<Partial<AdminUser>>({});

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await superAdminService.getAdmins({ limit: 100 });
      
      if (response.success && response.data?.admins) {
        setAdmins(response.data.admins);
        toast.success('Admins loaded successfully');
      } else {
        toast.error(response.message || 'Failed to load admins');
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      toast.error('Failed to load admins');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate form
      if (!createFormData.name || !createFormData.email || !createFormData.password) {
        toast.error('Please fill in all required fields');
        return;
      }

      const response = await superAdminService.createAdmin(createFormData);
      if (response.success) {
        toast.success('Admin created successfully');
        setShowCreateDialog(false);
        setCreateFormData({
          name: '',
          email: '',
          password: '',
          mobile_no: '',
          usergroup_id: 'admin',
          school_id: '',
          roles: ['admin']
        });
        fetchAdmins();
      } else {
        toast.error(response.message || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Error creating admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      setIsSubmitting(true);
      const response = await superAdminService.updateAdmin(selectedAdmin._id, editFormData);
      if (response.success) {
        toast.success('Admin updated successfully');
        setShowEditDialog(false);
        setSelectedAdmin(null);
        setEditFormData({});
        fetchAdmins();
      } else {
        toast.error(response.message || 'Failed to update admin');
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error('Error updating admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminRole: string) => {
    try {
      if (adminRole === 'superadmin') {
        toast.error('Cannot delete Super Admin');
        return;
      }

      const response = await superAdminService.deleteAdmin(adminId);
      if (response.success) {
        toast.success('Admin deleted successfully');
        fetchAdmins();
      } else {
        toast.error(response.message || 'Failed to delete admin');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast.error('Error deleting admin');
    }
  };

  const handleToggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    try {
      const response = await superAdminService.toggleAdminStatus(adminId, !currentStatus);
      if (response.success) {
        toast.success(`Admin ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchAdmins();
      } else {
        toast.error(response.message || 'Failed to update admin status');
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast.error('Error updating admin status');
    }
  };

  const openViewDialog = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setShowViewDialog(true);
  };

  const openEditDialog = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setEditFormData({
      name: admin.name,
      email: admin.email,
      mobile_no: admin.mobile_no,
      usergroup_id: admin.usergroup_id,
      roles: admin.roles
    });
    setShowEditDialog(true);
  };

  const filteredAdmins = admins.filter(admin => {
    const schoolName = typeof admin.school_id === 'object' && admin.school_id?.name 
      ? admin.school_id.name.toLowerCase() 
      : '';
    
    const matchesSearch = 
      (admin.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (admin.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      schoolName.includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || admin.usergroup_id === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const roleStats = admins.reduce((acc, admin) => {
    acc[admin.usergroup_id] = (acc[admin.usergroup_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeAdmins = admins.filter(admin => admin.is_activated).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage administrative users and permissions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={fetchAdmins} className="border-gray-300">
            <Settings className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Admin</DialogTitle>
                <DialogDescription>
                  Add a new administrator to the system. Choose the role carefully.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData({...createFormData, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={createFormData.email}
                    onChange={(e) => setCreateFormData({...createFormData, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={createFormData.password}
                    onChange={(e) => setCreateFormData({...createFormData, password: e.target.value})}
                    placeholder="Enter password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    value={createFormData.mobile_no}
                    onChange={(e) => setCreateFormData({...createFormData, mobile_no: e.target.value})}
                    placeholder="Enter mobile number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Admin Role *</Label>
                  <Select
                    value={createFormData.usergroup_id}
                    onValueChange={(value: 'admin' | 'superadmin') => 
                      setCreateFormData({...createFormData, usergroup_id: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">School Admin</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="border-gray-300">
                  Cancel
                </Button>
                <Button onClick={handleCreateAdmin} disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
                  {isSubmitting ? 'Creating...' : 'Create Admin'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600">{admins.length}</p>
                <p className="text-sm text-gray-600 mt-1">Total Admins</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-red-600">{roleStats.superadmin || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Super Admins</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Crown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600">{roleStats.admin || 0}</p>
                <p className="text-sm text-gray-600 mt-1">School Admins</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <School className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">{activeAdmins}</p>
                <p className="text-sm text-gray-600 mt-1">Active Admins</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search admins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedRole === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRole('all')}
                className={`text-xs sm:text-sm flex-1 sm:flex-none ${
                  selectedRole === 'all' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'border-gray-300 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'
                }`}
              >
                All ({admins.length})
              </Button>
              <Button
                variant={selectedRole === 'superadmin' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRole('superadmin')}
                className={`text-xs sm:text-sm flex-1 sm:flex-none ${
                  selectedRole === 'superadmin' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'border-gray-300 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'
                }`}
              >
                <span className="hidden sm:inline">Super Admins</span>
                <span className="sm:hidden">Super</span> ({roleStats.superadmin || 0})
              </Button>
              <Button
                variant={selectedRole === 'admin' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRole('admin')}
                className={`text-xs sm:text-sm flex-1 sm:flex-none ${
                  selectedRole === 'admin' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'border-gray-300 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'
                }`}
              >
                <span className="hidden sm:inline">School Admins</span>
                <span className="sm:hidden">Admins</span> ({roleStats.admin || 0})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admins List */}
      <div className="space-y-4">
        {filteredAdmins.map((admin) => (
          <Card key={admin._id} className="hover:shadow-md transition-shadow border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                  <div className={`p-2 sm:p-3 rounded-lg ${
                    admin.usergroup_id === 'superadmin' 
                      ? 'bg-red-50' 
                      : 'bg-purple-50'
                  }`}>
                    {admin.usergroup_id === 'superadmin' ? (
                      <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                    ) : (
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold">{admin.name}</h3>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <Badge 
                          variant="outline" 
                          className={`capitalize text-xs ${
                            admin.usergroup_id === 'superadmin' 
                              ? 'text-red-600 border-red-600 bg-red-50' 
                              : 'text-purple-600 border-purple-600 bg-purple-50'
                          }`}
                        >
                          {admin.usergroup_id === 'superadmin' ? 'Super Admin' : 'School Admin'}
                        </Badge>
                        <Badge variant={admin.is_activated ? "default" : "secondary"} className="text-xs">
                          {admin.is_activated ? 'Active' : 'Inactive'}
                        </Badge>
                        {admin.roles && admin.roles.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {admin.roles.join(', ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                        <span className="truncate">{admin.email}</span>
                      </div>
                      {admin.mobile_no && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                          <span>{admin.mobile_no}</span>
                        </div>
                      )}
                      {(typeof admin.school_id === 'object' && admin.school_id?.name) && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <School className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                          <span className="truncate">{admin.school_id.name}</span>
                        </div>
                      )}
                      {(!admin.school_id || admin.school_id === '') && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <School className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                          <span className="truncate">All Schools</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-4">
                  <div className="text-right text-xs sm:text-sm text-gray-500 hidden sm:block">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="h-3 w-3" />
                      <span>Joined {new Date(admin.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Updated {new Date(admin.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openViewDialog(admin)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(admin)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleToggleAdminStatus(admin._id, admin.is_activated)}
                      >
                        {admin.is_activated ? (
                          <><XCircle className="h-4 w-4 mr-2" />Deactivate</>
                        ) : (
                          <><CheckCircle2 className="h-4 w-4 mr-2" />Activate</>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        disabled={admin.usergroup_id === 'superadmin'}
                        onClick={() => {
                          if (admin.usergroup_id === 'superadmin') {
                            toast.error('Cannot delete Super Admin');
                            return;
                          }
                          if (confirm(`Are you sure you want to delete ${admin.name}? This action cannot be undone.`)) {
                            handleDeleteAdmin(admin._id, admin.usergroup_id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Admin
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAdmins.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No admins found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedRole !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'No administrators are registered yet'
            }
          </p>
        </div>
      )}

      {/* View Admin Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Admin Details</DialogTitle>
          </DialogHeader>
          {selectedAdmin && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-lg ${
                  selectedAdmin.usergroup_id === 'superadmin' 
                    ? 'bg-red-50' 
                    : 'bg-purple-50'
                }`}>
                  {selectedAdmin.usergroup_id === 'superadmin' ? (
                    <Crown className="h-8 w-8 text-red-600" />
                  ) : (
                    <Shield className="h-8 w-8 text-purple-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedAdmin.name}</h3>
                  <p className="text-gray-600">{selectedAdmin.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Role</Label>
                  <p className="mt-1 capitalize">
                    {selectedAdmin.usergroup_id === 'superadmin' ? 'Super Admin' : 'School Admin'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <p className="mt-1">
                    <Badge variant={selectedAdmin.is_activated ? "default" : "secondary"}>
                      {selectedAdmin.is_activated ? 'Active' : 'Inactive'}
                    </Badge>
                  </p>
                </div>
                {selectedAdmin.mobile_no && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Mobile</Label>
                    <p className="mt-1">{selectedAdmin.mobile_no}</p>
                  </div>
                )}
                {typeof selectedAdmin.school_id === 'object' && selectedAdmin.school_id?.name && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">School</Label>
                    <p className="mt-1">{selectedAdmin.school_id.name}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created</Label>
                  <p className="mt-1">{new Date(selectedAdmin.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                  <p className="mt-1">{new Date(selectedAdmin.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              
              {selectedAdmin.roles && selectedAdmin.roles.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Roles</Label>
                  <div className="mt-1 flex gap-2">
                    {selectedAdmin.roles.map((role, index) => (
                      <Badge key={index} variant="outline">{role}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedAdmin.permissions && selectedAdmin.permissions.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Permissions</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedAdmin.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{permission}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogDescription>
              Update administrator information. Be careful with role changes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email || ''}
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-mobile">Mobile Number</Label>
              <Input
                id="edit-mobile"
                value={editFormData.mobile_no || ''}
                onChange={(e) => setEditFormData({...editFormData, mobile_no: e.target.value})}
                placeholder="Enter mobile number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Admin Role</Label>
              <Select
                value={editFormData.usergroup_id}
                onValueChange={(value: 'admin' | 'superadmin') => 
                  setEditFormData({...editFormData, usergroup_id: value})
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">School Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="border-gray-300">
              Cancel
            </Button>
            <Button onClick={handleUpdateAdmin} disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
              {isSubmitting ? 'Updating...' : 'Update Admin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}