'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { superAdminService } from '@/lib/api/super-admin.service';
import { toast } from 'sonner';
import { 
  School, 
  Users, 
  GraduationCap, 
  UserCheck, 
  Plus,
  Search,
  Globe,
  Building,
  MapPin,
  Mail,
  Phone,
  Crown
} from 'lucide-react';

interface School {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: boolean;
  user_count?: number;
  student_count?: number;
  teacher_count?: number;
  created_at: string;
}

interface MultiSchoolSelectorProps {
  onSchoolSelect?: (school: School | null) => void;
  onSchoolChange?: () => void;
  showCreateButton?: boolean;
  showGlobalView?: boolean;
}

export default function MultiSchoolSelector({ 
  onSchoolSelect,
  onSchoolChange,
  showCreateButton = true,
  showGlobalView = true 
}: MultiSchoolSelectorProps) {
  const { user } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newSchoolData, setNewSchoolData] = useState({
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

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setIsLoading(true);
      const response = await superAdminService.getAllSchools({ limit: 100 });
      
      if (response.success && response.data?.schools) {
        setSchools(response.data.schools);
      } 
    } catch (error) {
      console.error('Failed to fetch schools:', error);
    
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchoolSelect = (schoolId: string) => {
    if (schoolId === 'global') {
      setSelectedSchool(null);
      onSchoolSelect?.(null);
      toast.success('Global view activated - Managing all schools');
      return;
    }

    const school = schools.find(s => s._id === schoolId);
    if (school) {
      setSelectedSchool(school);
      onSchoolSelect?.(school);
      toast.success(`Switched to ${school.name}`);
    }
  };

  const handleCreateSchool = async () => {
    if (!newSchoolData.name || !newSchoolData.email || !newSchoolData.state || !newSchoolData.city || !newSchoolData.pincode) {
      toast.error('Please fill in all required fields (Name, Email, State, City, Pincode)');
      return;
    }
    
    try {
      const response = await superAdminService.createSchool(newSchoolData);
      
      if (response.success) {
        toast.success('School created successfully!');
        setNewSchoolData({
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
        setShowCreateDialog(false);
        await fetchSchools();
        // Notify parent component that school data has changed
        onSchoolChange?.();
      } else {
        toast.error('Failed to create school');
      }
    } catch (error) {
      toast.error('Error creating school');
    }
  };

  const filteredSchools = (schools || []).filter(school =>
    school && (
      (school.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (school.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
  );

  if (!user?.roles?.includes('super_admin') && !user?.roles?.includes('superadmin')) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Loading schools...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* SuperAdmin School Selector Header */}
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Crown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-red-900">Multi-School Control</CardTitle>
                <CardDescription>SuperAdmin can manage all schools globally</CardDescription>
              </div>
            </div>
            <Badge variant="destructive" className="bg-red-600">
              {schools.length} Schools
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* School Selection Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="school-select" className="text-sm font-medium text-red-900">
              Select School to Manage
            </Label>
            <Select onValueChange={handleSchoolSelect} value={selectedSchool?._id || 'global'}>
              <SelectTrigger className="border-red-200">
                <SelectValue placeholder="Choose a school or global view" />
              </SelectTrigger>
              <SelectContent>
                {showGlobalView && (
                  <SelectItem value="global" className="font-medium text-red-600">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span> Global View (All Schools)</span>
                    </div>
                  </SelectItem>
                )}
                {filteredSchools.map((school) => (
                  <SelectItem key={school._id} value={school._id}>
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{school.name || 'Unnamed School'}</div>
                        <div className="text-xs text-gray-500">
                          {school.student_count || 0} students • {school.teacher_count || 0} teachers
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Selection Display */}
          {selectedSchool ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">{selectedSchool.name || 'Selected School'}</h4>
                    <p className="text-sm text-green-700">Currently managing this school</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{selectedSchool.user_count || 0} users</Badge>
                  <Badge variant="outline" className="border-green-300">Active</Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-900">Global Management Mode</h4>
                  <p className="text-sm text-blue-700">Managing all schools simultaneously</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2">
            {showCreateButton && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create School
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New School</DialogTitle>
                    <DialogDescription>
                      Add a new school to the system. Fields marked with * are required. As SuperAdmin, it will be auto-approved.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">School Name *</Label>
                      <Input
                        id="name"
                        value={newSchoolData.name}
                        onChange={(e) => setNewSchoolData({...newSchoolData, name: e.target.value})}
                        placeholder="Enter school name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newSchoolData.email}
                        onChange={(e) => setNewSchoolData({...newSchoolData, email: e.target.value})}
                        placeholder="school@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newSchoolData.phone}
                        onChange={(e) => setNewSchoolData({...newSchoolData, phone: e.target.value})}
                        placeholder="+1234567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newSchoolData.address}
                        onChange={(e) => setNewSchoolData({...newSchoolData, address: e.target.value})}
                        placeholder="School address"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={newSchoolData.state}
                          onChange={(e) => setNewSchoolData({...newSchoolData, state: e.target.value})}
                          placeholder="Enter state"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={newSchoolData.city}
                          onChange={(e) => setNewSchoolData({...newSchoolData, city: e.target.value})}
                          placeholder="Enter city"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={newSchoolData.pincode}
                          onChange={(e) => setNewSchoolData({...newSchoolData, pincode: e.target.value})}
                          placeholder="Enter pincode"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="board">Board</Label>
                        <Input
                          id="board"
                          value={newSchoolData.board}
                          onChange={(e) => setNewSchoolData({...newSchoolData, board: e.target.value})}
                          placeholder="e.g., CBSE, ICSE, State Board"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={newSchoolData.website}
                          onChange={(e) => setNewSchoolData({...newSchoolData, website: e.target.value})}
                          placeholder="https://school-website.com"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateSchool}
                      disabled={!newSchoolData.name || !newSchoolData.email || !newSchoolData.state || !newSchoolData.city || !newSchoolData.pincode}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Create School
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            <Button variant="outline" size="sm" onClick={() => {
              fetchSchools();
              onSchoolChange?.();
            }}>
              <Search className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* School Stats Overview */}
      {!selectedSchool && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <School className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{schools.length}</p>
                  <p className="text-sm text-gray-600">Total Schools</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {schools.reduce((sum, school) => sum + (school.user_count || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {schools.reduce((sum, school) => sum + (school.student_count || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}