'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  School, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Clock, 
  AlertCircle,
  Users,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { superAdminService } from '@/lib/api/super-admin.service';

export default function SchoolApprovalsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedSchoolForReview, setSelectedSchoolForReview] = useState<any>(null);

  // Debug state
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    fetchPendingSchools();
  }, []);

  useEffect(() => {
    if (!Array.isArray(schools)) {
      setFilteredSchools([]);
      return;
    }
    const filtered = schools.filter(school =>
      school.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.board?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.pincode?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchools(filtered);
  }, [schools, searchTerm]);

  const fetchPendingSchools = async () => {
    try {
      setIsLoading(true);
      
      
      // First try to get pending schools from the specific endpoint
      let response = await superAdminService.getPendingSchools();
    
      
      let schoolsData = response?.data?.schools || (response as any)?.schools || response?.data || [];
      
      // If no pending schools found, get all schools and show them for review
      if (!Array.isArray(schoolsData) || schoolsData.length === 0) {
        
        const allSchoolsResponse = await superAdminService.getAllSchools();
       
        
        const allSchools = allSchoolsResponse?.data?.schools || allSchoolsResponse?.data || [];
        
        schoolsData = Array.isArray(allSchools) ? allSchools : [];
      }
      
      setSchools(schoolsData);
      setDebugInfo({
        ...debugInfo,
        lastFetch: new Date().toISOString(),
        schoolCount: Array.isArray(schoolsData) ? schoolsData.length : 0,
        rawResponse: response
      });
      
      toast.success(`Loaded ${Array.isArray(schoolsData) ? schoolsData.length : 0} schools for review`);
    } catch (error: any) {
      console.error('Error fetching schools:', error);
      setDebugInfo({
        ...debugInfo,
        error: error?.message || 'Unknown error',
        lastError: new Date().toISOString()
      });
      toast.error('Failed to load schools');
    } finally {
      setIsLoading(false);
    }
  };

  const approveSchool = async (schoolId: string) => {
    try {
      setProcessingIds(prev => new Set([...prev, schoolId]));
    
      
      await superAdminService.approveSchool(schoolId);
   
      
      toast.success('School approved successfully');
      fetchPendingSchools(); // Refresh the list
    } catch (error) {
      
      toast.error('Failed to approve school');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(schoolId);
        return newSet;
      });
    }
  };

  const rejectSchool = async (schoolId: string) => {
    try {
      setProcessingIds(prev => new Set([...prev, schoolId]));
      
      
      await superAdminService.rejectSchool(schoolId);

      
      toast.success('School registration rejected');
      fetchPendingSchools(); // Refresh the list
    } catch (error) {
     
      toast.error('Failed to reject school');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(schoolId);
        return newSet;
      });
    }
  };

  const handleReviewSchool = (school: any) => {
   
    setSelectedSchoolForReview(school);
    setShowReviewDialog(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

 
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">School Approvals</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading pending applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">School Approvals</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-500">Review and approve pending school registrations</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={fetchPendingSchools} variant="outline" className="flex-1 sm:flex-none">
            Refresh
          </Button>
         
        </div>
      </div>

     
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Schools</CardTitle>
            <School className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredSchools.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingIds.size}</div>
            <p className="text-xs text-muted-foreground">
              Currently being processed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Search Results</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredSchools.length}</div>
            <p className="text-xs text-muted-foreground">
              {searchTerm ? `Matching "${searchTerm}"` : 'All results'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search schools by name, slug, email, board, state, city, or pincode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Schools Grid */}
      <div className="space-y-4">
        <div className="grid gap-6">
          {filteredSchools.map((school) => (
            <Card key={school._id} className="hover:shadow-md transition-shadow border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <School className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                      <Badge variant={school.status ? "default" : "secondary"} className={school.status ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {school.status ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <strong>Slug:</strong> {school.slug || 'Not provided'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {school.email || 'Not provided'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {school.phone || 'Not provided'}
                      </div>
                      <div className="flex items-center gap-2">
                        <strong>Created:</strong> {formatDate(school.createdAt)}
                      </div>
                    </div>
                    
                    {/* Location Information */}
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <strong>State:</strong> {school.state || 'Not provided'}
                      </div>
                      <div className="flex items-center gap-2">
                        <strong>City:</strong> {school.city || 'Not provided'}
                      </div>
                      <div className="flex items-center gap-2">
                        <strong>Pincode:</strong> {school.pincode || 'Not provided'}
                      </div>
                    </div>
                    
                    {(school.board || school.website) && (
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-2">
                        {school.board && (
                          <div className="flex items-center gap-2">
                            <strong>Board:</strong> {school.board}
                          </div>
                        )}
                        {school.website && (
                          <div className="flex items-center gap-2">
                            <strong>Website:</strong> 
                            <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {school.website}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {school.address && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {school.address}
                      </div>
                    )}
                    
                    {/* Document Status */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-sm font-medium text-gray-700">Documents:</span>
                      <div className="flex gap-2">
                        <Badge variant={school.documents?.license ? "default" : "destructive"} className="text-xs">
                          License {school.documents?.license ? '✓' : '✗'}
                        </Badge>
                        <Badge variant={school.documents?.certificate ? "default" : "destructive"} className="text-xs">
                          Certificate {school.documents?.certificate ? '✓' : '✗'}
                        </Badge>
                        <Badge variant={school.documents?.identification ? "default" : "destructive"} className="text-xs">
                          ID {school.documents?.identification ? '✓' : '✗'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-24"
                      onClick={() => handleReviewSchool(school)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                    
                    <Button
                      variant="default"
                      size="sm"
                      className="w-24 bg-green-600 hover:bg-green-700"
                      onClick={() => approveSchool(school._id)}
                      disabled={processingIds.has(school._id)}
                    >
                      {processingIds.has(school._id) ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-24 text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => {
                        if (confirm('Are you sure you want to reject this school registration?')) {
                          rejectSchool(school._id);
                        }
                      }}
                      disabled={processingIds.has(school._id)}
                    >
                      {processingIds.has(school._id) ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review School Application</DialogTitle>
            </DialogHeader>
            {selectedSchoolForReview && (
              <div className="space-y-4">
                {/* School Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">School Name</label>
                    <p className="text-sm text-gray-900">{selectedSchoolForReview.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Slug</label>
                    <p className="text-sm text-gray-900">{selectedSchoolForReview.slug || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contact</label>
                    <p className="text-sm text-gray-900">{selectedSchoolForReview.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedSchoolForReview.email || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Board</label>
                    <p className="text-sm text-gray-900">{selectedSchoolForReview.board || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Website</label>
                    <p className="text-sm text-gray-900">
                      {selectedSchoolForReview.website ? (
                        <a href={selectedSchoolForReview.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedSchoolForReview.website}
                        </a>
                      ) : 'Not provided'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Badge variant={selectedSchoolForReview.status ? "default" : "destructive"} className="text-xs">
                      {selectedSchoolForReview.status ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedSchoolForReview.updatedAt)}</p>
                  </div>
                </div>
                
                {/* Address */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <p className="text-sm text-gray-900">{selectedSchoolForReview.address || 'Not provided'}</p>
                </div>
                
                {/* Location Details */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">State</label>
                    <p className="text-sm text-gray-900">{selectedSchoolForReview.state || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <p className="text-sm text-gray-900">{selectedSchoolForReview.city || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pincode</label>
                    <p className="text-sm text-gray-900">{selectedSchoolForReview.pincode || 'Not provided'}</p>
                  </div>
                </div>
                
                {/* Document Status */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Document Verification</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`p-3 rounded-lg border ${selectedSchoolForReview.documents?.license ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium">License</span>
                      </div>
                      <p className={`text-xs mt-1 ${selectedSchoolForReview.documents?.license ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedSchoolForReview.documents?.license ? 'Verified ✓' : 'Missing ✗'}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg border ${selectedSchoolForReview.documents?.certificate ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium">Certificate</span>
                      </div>
                      <p className={`text-xs mt-1 ${selectedSchoolForReview.documents?.certificate ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedSchoolForReview.documents?.certificate ? 'Verified ✓' : 'Missing ✗'}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg border ${selectedSchoolForReview.documents?.identification ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium">ID Proof</span>
                      </div>
                      <p className={`text-xs mt-1 ${selectedSchoolForReview.documents?.identification ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedSchoolForReview.documents?.identification ? 'Verified ✓' : 'Missing ✗'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewDialog(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Are you sure you want to reject this school registration?')) {
                        rejectSchool(selectedSchoolForReview._id);
                        setShowReviewDialog(false);
                      }
                    }}
                    disabled={processingIds.has(selectedSchoolForReview._id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      approveSchool(selectedSchoolForReview._id);
                      setShowReviewDialog(false);
                    }}
                    disabled={processingIds.has(selectedSchoolForReview._id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve School
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {filteredSchools.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'No schools match your search criteria' 
              : 'No schools are available for review'
            }
          </p>
        </div>
      )}
    </div>
  );
}