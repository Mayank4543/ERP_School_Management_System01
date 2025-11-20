'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable } from '@/components/shared/DataTable';
import { superAdminService } from '@/lib/api/super-admin.service';
import { toast } from 'sonner';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  AlertTriangle, 
  Activity,
  Trash2,
  Edit,
  Crown,
  Eye,
  Ban,
  Key,
  ArrowRight,
  Globe,
  Building
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  usergroup_id: string;
  roles: string[];
  school_id?: { _id: string; name: string };
  is_activated: boolean;
  created_at: string;
  last_login?: string;
}

export default function GlobalUserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Dialog states
  const [showCreateSuperAdmin, setShowCreateSuperAdmin] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showMassActions, setShowMassActions] = useState(false);
  
  const [newSuperAdmin, setNewSuperAdmin] = useState({
    name: '',
    email: '',
    password: '',
    mobile_no: ''
  });

  const [transferData, setTransferData] = useState({
    targetSchoolId: '',
    reason: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, selectedRole, selectedSchool]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedRole) params.role = selectedRole;
      if (selectedSchool) params.school_id = selectedSchool;
      
      const response = await superAdminService.getAllUsers(params);
      
      if (response.success) {
        setUsers(response.data.users || []);
      } 
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuperAdmin = async () => {
    try {
      const response = await superAdminService.createSuperAdmin(newSuperAdmin);
      
      if (response.success) {
        toast.success('SuperAdmin created successfully!');
        setNewSuperAdmin({ name: '', email: '', password: '', mobile_no: '' });
        setShowCreateSuperAdmin(false);
        await fetchUsers();
      } else {
        toast.error('Failed to create SuperAdmin');
      }
    } catch (error) {
      toast.error('Error creating SuperAdmin');
    }
  };

  const handleMassPasswordReset = async () => {
    try {
      const response = await superAdminService.massPasswordReset(selectedUsers);
      
      if (response.success) {
        toast.success(`Password reset for ${selectedUsers.length} users`);
        setSelectedUsers([]);
        setShowMassActions(false);
      } else {
        toast.error('Mass password reset failed');
      }
    } catch (error) {
      toast.error('Error during mass password reset');
    }
  };

  const handleUserTransfer = async (userId: string) => {
    try {
      const response = await superAdminService.transferUser(userId, transferData.targetSchoolId);
      
      if (response.success) {
        toast.success('User transferred successfully!');
        setShowTransferDialog(false);
        await fetchUsers();
      } else {
        toast.error('Failed to transfer user');
      }
    } catch (error) {
      toast.error('Error transferring user');
    }
  };

  const getUserStatusBadge = (user: User) => {
    if (!user.is_activated) {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    
    const roleColors: { [key: string]: string } = {
      'superadmin': 'bg-red-600',
      'admin': 'bg-blue-600',
      'teacher': 'bg-green-600',
      'student': 'bg-purple-600',
      'parent': 'bg-orange-600'
    };
    
    return (
      <Badge className={roleColors[user.usergroup_id] || 'bg-gray-600'}>
        {user.usergroup_id}
      </Badge>
    );
  };

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-full">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'usergroup_id',
      label: 'Role & Status',
      render: (value: any, row: any) => (
        <div className="space-y-1">
          {getUserStatusBadge(row)}
          {row.usergroup_id === 'superadmin' && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <Crown className="h-3 w-3" />
              God Mode
            </div>
          )}
        </div>
      )
    },
    {
      key: 'school_id',
      label: 'School',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {row.school_id?.name || 'No School'}
          </span>
        </div>
      )
    },
    {
      key: 'last_login',
      label: 'Last Active',
      render: (value: any, row: any) => (
        <div className="text-sm">
          {row.last_login 
            ? new Date(row.last_login).toLocaleDateString()
            : 'Never'
          }
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4" />
          </Button>
          {row.original.usergroup_id !== 'superadmin' && (
            <>
              <Button size="sm" variant="outline" className="text-orange-600">
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="text-red-600">
                <Ban className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  if (!user?.roles?.includes('super_admin')) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Access Denied: SuperAdmin privileges required
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Crown className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-red-900">Global User Management</CardTitle>
                <CardDescription>
                  SuperAdmin control over all users across all schools
                </CardDescription>
              </div>
            </div>
            <Badge variant="destructive" className="bg-red-600">
              GOD MODE ACTIVE
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Search Users</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Filter by Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              <SelectItem value="superadmin">SuperAdmin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Filter by School</Label>
          <Select value={selectedSchool} onValueChange={setSelectedSchool}>
            <SelectTrigger>
              <SelectValue placeholder="All schools" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Schools</SelectItem>
              <SelectItem value="school1">Elite Academy</SelectItem>
              <SelectItem value="school2">Prime School</SelectItem>
              <SelectItem value="school3">Excellence High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>SuperAdmin Actions</Label>
          <div className="flex gap-2">
            <Dialog open={showCreateSuperAdmin} onOpenChange={setShowCreateSuperAdmin}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  <Crown className="h-4 w-4 mr-2" />
                  Create SuperAdmin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New SuperAdmin</DialogTitle>
                  <DialogDescription>
                    Create a new SuperAdmin account with God Mode privileges
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      value={newSuperAdmin.name}
                      onChange={(e) => setNewSuperAdmin({...newSuperAdmin, name: e.target.value})}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={newSuperAdmin.email}
                      onChange={(e) => setNewSuperAdmin({...newSuperAdmin, email: e.target.value})}
                      placeholder="superadmin@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password *</Label>
                    <Input
                      type="password"
                      value={newSuperAdmin.password}
                      onChange={(e) => setNewSuperAdmin({...newSuperAdmin, password: e.target.value})}
                      placeholder="Strong password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input
                      value={newSuperAdmin.mobile_no}
                      onChange={(e) => setNewSuperAdmin({...newSuperAdmin, mobile_no: e.target.value})}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateSuperAdmin(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateSuperAdmin}
                    disabled={!newSuperAdmin.name || !newSuperAdmin.email || !newSuperAdmin.password}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Create SuperAdmin
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Mass Actions */}
      {selectedUsers.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="font-medium">
                  {selectedUsers.length} users selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleMassPasswordReset}>
                  <Key className="h-4 w-4 mr-2" />
                  Reset Passwords
                </Button>
                <Button size="sm" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Transfer Users
                </Button>
                <Button size="sm" variant="destructive">
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend Users
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All System Users ({users.length})
          </CardTitle>
          <CardDescription>
            Manage users across all schools with SuperAdmin privileges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={users}
            columns={columns}
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}