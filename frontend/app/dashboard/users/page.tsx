'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { superAdminService } from '@/lib/api/super-admin.service';
import { toast } from 'sonner';
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield, 
  UserCheck, 
  Mail, 
  Phone,
  Eye,
  Settings,
  Crown,
  School,
  Calendar,
  CheckCircle2,
  XCircle
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

interface UserData {
  _id: string;
  name: string;
  email: string;
  mobile_no?: string;
  usergroup_id: string;
  school_id?: string | {
    _id: string;
    name: string;
    email?: string;
  };
  is_activated: boolean;
  roles?: string[];
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AllUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);  const [schools, setSchools] = useState<any[]>([]);  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'teacher' | 'student' | 'superadmin'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [createFormData, setCreateFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile_no: '',
    usergroup_id: 'student',
    school_id: '',
    roles: ['student']
  });

  const [editFormData, setEditFormData] = useState<Partial<UserData>>({});

  useEffect(() => {
    fetchUsers();
    fetchSchools();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole]);

  const fetchSchools = async () => {
    try {
      const response = await superAdminService.getAllSchools({ limit: 500 });
      if (response.success && response.data?.schools) {
        // Only show approved schools
        const approvedSchools = response.data.schools.filter((school: any) => school.status === true);
        setSchools(approvedSchools);
      }
    } catch (error) {
      console.error('Failed to fetch schools:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await superAdminService.getAllUsers({ limit: 100 });
      
      if (response.success && response.data?.users) {
        setUsers(response.data.users);
        if (response.message) {
          console.log('Users loaded:', response.message);
        }
      } else {
        const errorMsg = response.message || 'Failed to load users';
        console.error('Failed to fetch users:', errorMsg);
        toast.error(errorMsg);
        setUsers([]);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'An unexpected error occurred while fetching users';
      console.error('Failed to fetch users:', errorMsg, error);
      toast.error('Unable to fetch users. Please ensure the backend server is running.');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        const schoolName = typeof user.school_id === 'object' && user.school_id?.name 
          ? user.school_id.name.toLowerCase() 
          : '';
        
        return (
          (user.name || '').toLowerCase().includes(searchLower) ||
          (user.email || '').toLowerCase().includes(searchLower) ||
          schoolName.includes(searchLower)
        );
      });
    }

    // Filter by role
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.usergroup_id === selectedRole);
    }

    setFilteredUsers(filtered);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-red-600 text-white';
      case 'admin': return 'bg-blue-600 text-white';
      case 'teacher': return 'bg-green-600 text-white';
      case 'student': return 'bg-purple-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin': return Shield;
      case 'admin': return UserCheck;
      case 'teacher': return Users;
      case 'student': return Users;
      default: return Users;
    }
  };

  const formatRoleName = (role: string) => {
    if (!role) return 'Unknown';
    switch (role) {
      case 'superadmin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'teacher': return 'Teacher';
      case 'student': return 'Student';
      default: return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const handleCreateUser = async () => {
    try {
      setIsSubmitting(true);
      
      if (!createFormData.name || !createFormData.email || !createFormData.password) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate school_id for non-superadmin users
      if (createFormData.usergroup_id !== 'superadmin' && !createFormData.school_id) {
        toast.error('Please select a school');
        return;
      }

      const response = await superAdminService.createUser(createFormData);
      if (response.success) {
        toast.success('User created successfully');
        setShowCreateDialog(false);
        setCreateFormData({
          name: '',
          email: '',
          password: '',
          mobile_no: '',
          usergroup_id: 'student',
          school_id: '',
          roles: ['student']
        });
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error creating user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);
      const response = await superAdminService.updateUser(selectedUser._id, editFormData);
      if (response.success) {
        toast.success('User updated successfully');
        setShowEditDialog(false);
        setSelectedUser(null);
        setEditFormData({});
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string, userRole: string) => {
    if (userRole === 'superadmin') {
      toast.error('Cannot delete Super Admin');
      return;
    }

    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await superAdminService.deleteUser(userId);
        if (response.success) {
          toast.success('User deleted successfully');
          fetchUsers();
        } else {
          toast.error(response.message || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error deleting user');
      }
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await superAdminService.updateUserStatus(userId, {
        status: currentStatus ? 'inactive' : 'active'
      });
      if (response.success) {
        toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Error updating user status');
    }
  };

  const openViewDialog = (user: UserData) => {
    setSelectedUser(user);
    setShowViewDialog(true);
  };

  const openEditDialog = (user: UserData) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      mobile_no: user.mobile_no,
      usergroup_id: user.usergroup_id,
      roles: user.roles
    });
    setShowEditDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getUserStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.is_activated).length;
    const roleStats = users.reduce((acc, user) => {
      acc[user.usergroup_id] = (acc[user.usergroup_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalUsers, activeUsers, roleStats };
  };

  const stats = getUserStats();

  return (
    <div className="space-y-4 sm:space-y-6 w-full px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage all users across the system</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={fetchUsers} className="w-full sm:w-auto">
            <Settings className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system. Choose the role and school assignment carefully.
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
                  <Label htmlFor="role">User Role *</Label>
                  <Select
                    value={createFormData.usergroup_id}
                    onValueChange={(value) => 
                      setCreateFormData({...createFormData, usergroup_id: value, roles: [value]})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">School Admin</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school">School {createFormData.usergroup_id !== 'superadmin' && '*'}</Label>
                  <Select
                    value={createFormData.school_id}
                    onValueChange={(value) => 
                      setCreateFormData({...createFormData, school_id: value})
                    }
                    disabled={createFormData.usergroup_id === 'superadmin'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {createFormData.usergroup_id === 'superadmin' && (
                        <SelectItem value="">All Schools (Super Admin)</SelectItem>
                      )}
                      {schools.map((school) => (
                        <SelectItem key={school._id} value={school._id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {createFormData.usergroup_id !== 'superadmin' && schools.length === 0 && (
                    <p className="text-sm text-gray-500">No approved schools available. Please create and approve a school first.</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser} disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.totalUsers}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.roleStats.superadmin || 0}</p>
                <p className="text-sm text-gray-600">Super Admins</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <Crown className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.roleStats.student || 0}</p>
                <p className="text-sm text-gray-600">Students</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {([
                { key: 'all', label: 'All' },
                { key: 'superadmin', label: 'Super Admin' },
                { key: 'admin', label: 'Admin' },
                { key: 'teacher', label: 'Teacher' },
                { key: 'student', label: 'Student' }
              ] as const).map((roleOption) => (
                <Button
                  key={roleOption.key}
                  variant={selectedRole === roleOption.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRole(roleOption.key)}
                >
                  {roleOption.label}
                  {roleOption.key !== 'all' && (
                    <span className="ml-1 text-xs">
                      ({users.filter(u => u.usergroup_id === roleOption.key).length})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => {
          const RoleIcon = getRoleIcon(user.usergroup_id || '');
          return (
            <Card key={user._id} className="hover:shadow-md transition-shadow border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      user.usergroup_id === 'superadmin' ? 'bg-red-100 text-red-600' :
                      user.usergroup_id === 'admin' ? 'bg-blue-100 text-blue-600' :
                      user.usergroup_id === 'teacher' ? 'bg-green-100 text-green-600' :
                      user.usergroup_id === 'student' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <RoleIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{user.name || 'Unknown User'}</h3>
                        <Badge className={getRoleColor(user.usergroup_id || '')}>
                          {formatRoleName(user.usergroup_id || '')}
                        </Badge>
                        <Badge 
                          variant={user.is_activated ? 'default' : 'secondary'} 
                          className={user.is_activated ? 'bg-green-600' : 'bg-gray-400'}
                        >
                          {user.is_activated ? 'Active' : 'Inactive'}
                        </Badge>
                        {user.roles && user.roles.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {user.roles.join(', ')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {user.email || 'No email'}
                        </div>
                        {user.mobile_no && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {user.mobile_no}
                          </div>
                        )}
                      </div>
                      {user.school_id && typeof user.school_id === 'object' && user.school_id.name && (
                        <p className="text-sm text-gray-500 mt-1">School: {user.school_id.name}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm text-gray-500">
                      <p>Created:</p>
                      <p>{new Date(user.createdAt || '').toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Updated: {new Date(user.updatedAt || '').toLocaleDateString()}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewDialog(user)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleToggleUserStatus(user._id, user.is_activated)}
                        >
                          {user.is_activated ? (
                            <><XCircle className="h-4 w-4 mr-2" />Deactivate</>
                          ) : (
                            <><CheckCircle2 className="h-4 w-4 mr-2" />Activate</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => {
                            if (user.usergroup_id === 'superadmin') {
                              toast.error('Cannot delete Super Admin');
                              return;
                            }
                            if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
                              handleDeleteUser(user._id, user.usergroup_id);
                            }
                          }}
                          disabled={user.usergroup_id === 'superadmin'}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedRole !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'No users are registered yet'
              }
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First User
            </Button>
          </CardContent>
        </Card>
      )}

      {/* View User Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-lg ${
                  selectedUser.usergroup_id === 'superadmin' ? 'bg-red-100' :
                  selectedUser.usergroup_id === 'admin' ? 'bg-blue-100' :
                  selectedUser.usergroup_id === 'teacher' ? 'bg-green-100' :
                  selectedUser.usergroup_id === 'student' ? 'bg-purple-100' :
                  'bg-gray-100'
                }`}>
                  {selectedUser.usergroup_id === 'superadmin' ? (
                    <Crown className="h-8 w-8 text-red-600" />
                  ) : selectedUser.usergroup_id === 'admin' ? (
                    <UserCheck className="h-8 w-8 text-blue-600" />
                  ) : (
                    <Users className="h-8 w-8 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Role</Label>
                  <p className="mt-1">{formatRoleName(selectedUser.usergroup_id)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <p className="mt-1">
                    <Badge variant={selectedUser.is_activated ? "default" : "secondary"}>
                      {selectedUser.is_activated ? 'Active' : 'Inactive'}
                    </Badge>
                  </p>
                </div>
                {selectedUser.mobile_no && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Mobile</Label>
                    <p className="mt-1">{selectedUser.mobile_no}</p>
                  </div>
                )}
                {selectedUser.school_id && typeof selectedUser.school_id === 'object' && selectedUser.school_id.name && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">School</Label>
                    <p className="mt-1">{selectedUser.school_id.name}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created</Label>
                  <p className="mt-1">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                  <p className="mt-1">{new Date(selectedUser.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              
              {selectedUser.roles && selectedUser.roles.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Roles</Label>
                  <div className="mt-1 flex gap-2">
                    {selectedUser.roles.map((role, index) => (
                      <Badge key={index} variant="outline">{role}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedUser.permissions && selectedUser.permissions.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Permissions</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedUser.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{permission}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Be careful with role changes.
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
              <Label htmlFor="edit-role">User Role</Label>
              <Select
                value={editFormData.usergroup_id}
                onValueChange={(value) => 
                  setEditFormData({...editFormData, usergroup_id: value})
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">School Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}