'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RejectSchoolDialog } from './components/RejectDialog';
import type { RejectSchoolFormValues } from './schemas/reject-school.schema';
import { getSchoolApprovals, approveSchoolApproval, rejectSchoolApproval, type SchoolApproval } from './api';
import { School, Search, Eye, CheckCircle, XCircle, FileText, AlertCircle, MapPin, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { SchoolStatusBadge } from '@/components/shared/SchoolStatusBadge';
import { DataTable, type Column } from '@/components/shared/DataTable';
export default function SchoolApprovalsPage() {
  const [schools, setSchools] = useState<SchoolApproval[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedSchoolForReview, setSelectedSchoolForReview] = useState<SchoolApproval | null>(null);
  const [rejectTarget, setRejectTarget] = useState<SchoolApproval | null>(null);

  useEffect(() => {
    fetchPendingSchools();
  }, []);

  const filterSchool = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return schools;
    }
    return schools.filter((school) =>
      [
        school.name,
        school.slug,
        school.email,
        school.board,
        school.state,
        school.city,
        school.pincode,
      ]
        .filter(Boolean)
        .some((value) =>
          value!.toLowerCase().includes(query),
        ),
    );
  }, [schools, searchTerm]);

  const fetchPendingSchools = async () => {
    try {
      setIsLoading(true);
      const data = await getSchoolApprovals();
      setSchools(data);

    } catch (error: any) {
      console.error('Error fetching schools:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to load  schools approvals'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const approveSchool = async (schoolId: string) => {
    try {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.add(schoolId);
        return next;
      });

      await approveSchoolApproval(schoolId);


      toast.success('School approved successfully');
      setSchools((prev) =>
        prev.filter((school) => school._id !== schoolId),
      );

      setSelectedSchoolForReview((current) =>
        current?._id === schoolId ? null : current,
      );

      setShowReviewDialog(false);
    } catch (error) {
      console.error('Error approving school:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to approve school',
      );
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(schoolId);
        return newSet;
      });
    }
  };
  const rejectSchool = async (
    schoolId: string,
    data: RejectSchoolFormValues
  ) => {
    try {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.add(schoolId);
        return next;
      });

      await rejectSchoolApproval(schoolId, data);

      toast.success('School registration rejected');

      setSchools((prev) =>
        prev.filter((school) => school._id !== schoolId)
      );

      setSelectedSchoolForReview((current) =>
        current?._id === schoolId ? null : current
      );

      setRejectTarget(null);
      setShowReviewDialog(false);
    } catch (error) {
      console.error('Error rejecting school:', error);

      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to reject school'
      );
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(schoolId);
        return next;
      });
    }
  };

  const handleReviewSchool = (school: SchoolApproval) => {
    setSelectedSchoolForReview(school);
    setShowReviewDialog(true);
  };

  const formatDate = (dateString?: string) => {
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
  const columns: Column<SchoolApproval>[] = [
    {
      key: 'name',
      label: 'School Name',
      render: (_, school) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <School className="h-4 w-4 text-purple-600" />
            <span className="font-semibold text-gray-900">{school.name}</span>
          </div>
          {school.board && <p className="text-xs text-gray-500">Board: {school.board}</p>}
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (_, school) => <span className="text-sm text-gray-600">{school.email}</span>,
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (_, school) => <span className="text-sm text-gray-600">{school.phone}</span>
    },
    {
      key: 'location',
      label: 'Location',
      render: (_, school) => (
        <div className="text-sm text-gray-600">
          <p>{school.city || 'N/A'}</p>
          <p>{school.pincode || 'N/A'}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, school) => <SchoolStatusBadge status={school.status} />
    },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (_, school) => <span className="text-sm text-gray-600">{formatDate(school.createdAt)}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, school) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleReviewSchool(school)}
            variant="outline"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-1" />
            Review
          </Button>

          <Button
            onClick={() => approveSchool(school._id)}
            variant="default"
            size="sm"
            disabled={processingIds.has(school._id)}
            className="bg-green-600 hover:bg-green-700"
          >
            {processingIds.has(school._id) ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </>
            )}
          </Button>

          <Button
            onClick={() => setRejectTarget(school)}
            variant="outline"
            size="sm"
            disabled={processingIds.has(school._id)}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            {processingIds.has(school._id) ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600" />
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </>
            )}
          </Button>
        </div>
      ),
    },
  ]


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
            <div className="text-2xl font-bold">{filterSchool.length}</div>
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
            <div className="text-2xl font-bold">{filterSchool.length}</div>
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
          placeholder="Search schools by name, slug, email, board, state, city, pincode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="w-full overflow-x-auto">
        <DataTable
          columns={columns}
          data={filterSchool}
        />
      </div>
      <Dialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
      >
        <DialogContent className="w-[100vw] max-w-3xl max-h-[90vh] overflow-y-auto p-0">

          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Review School Application
                </DialogTitle>

                <p className="text-sm text-gray-500 mt-1">
                  Review the school information and documents before taking action.
                </p>
              </div>
            </div>
          </DialogHeader>

          {selectedSchoolForReview && (
            <div className="px-6 py-5 space-y-6">

              {/* School Information */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <School className="h-5 w-5 text-gray-600" />

                  <h3 className="text-sm font-semibold text-gray-900">
                    School Information
                  </h3>
                </div>

                <div className="rounded-lg border bg-gray-50/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2">

                    <div className="px-4 py-3 border-b sm:border-r">
                      <p className="text-xs font-medium text-gray-500">
                        School Name
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {selectedSchoolForReview.name}
                      </p>
                    </div>

                    <div className="px-4 py-3 border-b">
                      <p className="text-xs font-medium text-gray-500">
                        Slug
                      </p>

                      <p className="mt-1 text-sm text-gray-900">
                        {selectedSchoolForReview.slug || "Not provided"}
                      </p>
                    </div>

                    <div className="px-4 py-3 border-b sm:border-r">
                      <p className="text-xs font-medium text-gray-500">
                        Board
                      </p>

                      <p className="mt-1 text-sm text-gray-900">
                        {selectedSchoolForReview.board || "Not provided"}
                      </p>
                    </div>

                    <div className="px-4 py-3 border-b">
                      <p className="text-xs font-medium text-gray-500">
                        Status
                      </p>

                      <div className="mt-2">
                        <SchoolStatusBadge
                          status={selectedSchoolForReview.status}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5 text-gray-600" />

                  <h3 className="text-sm font-semibold text-gray-900">
                    Contact Information
                  </h3>
                </div>

                <div className="rounded-lg border bg-gray-50/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2">

                    <div className="px-4 py-3 border-b sm:border-r">
                      <p className="text-xs font-medium text-gray-500">
                        Email
                      </p>

                      <p className="mt-1 text-sm text-gray-900 break-all">
                        {selectedSchoolForReview.email || "Not provided"}
                      </p>
                    </div>

                    <div className="px-4 py-3 border-b">
                      <p className="text-xs font-medium text-gray-500">
                        Phone
                      </p>

                      <p className="mt-1 text-sm text-gray-900">
                        {selectedSchoolForReview.phone || "Not provided"}
                      </p>
                    </div>

                    <div className="px-4 py-3 sm:border-r">
                      <p className="text-xs font-medium text-gray-500">
                        Website
                      </p>

                      {selectedSchoolForReview.website ? (
                        <a
                          href={selectedSchoolForReview.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block text-sm text-blue-600 hover:underline truncate"
                        >
                          {selectedSchoolForReview.website}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          Not provided
                        </p>
                      )}
                    </div>

                    <div className="px-4 py-3">
                      <p className="text-xs font-medium text-gray-500">
                        Created At
                      </p>

                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(selectedSchoolForReview.createdAt)}
                      </p>
                    </div>

                  </div>
                </div>
              </section>

              {/* Location */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-gray-600" />

                  <h3 className="text-sm font-semibold text-gray-900">
                    Location
                  </h3>
                </div>

                <div className="rounded-lg border bg-gray-50/50">

                  <div className="px-4 py-3 border-b">
                    <p className="text-xs font-medium text-gray-500">
                      Address
                    </p>

                    <p className="mt-1 text-sm text-gray-900">
                      {selectedSchoolForReview.address || "Not provided"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3">

                    <div className="px-4 py-3 sm:border-r">
                      <p className="text-xs font-medium text-gray-500">
                        State
                      </p>

                      <p className="mt-1 text-sm text-gray-900">
                        {selectedSchoolForReview.state || "Not provided"}
                      </p>
                    </div>

                    <div className="px-4 py-3 sm:border-r border-t sm:border-t-0">
                      <p className="text-xs font-medium text-gray-500">
                        City
                      </p>

                      <p className="mt-1 text-sm text-gray-900">
                        {selectedSchoolForReview.city || "Not provided"}
                      </p>
                    </div>

                    <div className="px-4 py-3 border-t sm:border-t-0">
                      <p className="text-xs font-medium text-gray-500">
                        Pincode
                      </p>

                      <p className="mt-1 text-sm text-gray-900">
                        {selectedSchoolForReview.pincode || "Not provided"}
                      </p>
                    </div>

                  </div>
                </div>
              </section>

              {/* Documents */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-600" />

                    <h3 className="text-sm font-semibold text-gray-900">
                      Document Verification
                    </h3>
                  </div>

                  <span className="text-xs text-gray-500">
                    3 required documents
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                  {[
                    {
                      label: "License",
                      verified:
                        selectedSchoolForReview.documents?.license,
                    },
                    {
                      label: "Certificate",
                      verified:
                        selectedSchoolForReview.documents?.certificate,
                    },
                    {
                      label: "ID Proof",
                      verified:
                        selectedSchoolForReview.documents?.identification,
                    },
                  ].map((document) => (
                    <div
                      key={document.label}
                      className={`rounded-lg border p-4 ${document.verified
                        ? "border-green-200 bg-green-50/50"
                        : "border-red-200 bg-red-50/50"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <FileText className="h-5 w-5 text-gray-600" />

                        <span
                          className={`text-xs font-medium ${document.verified
                            ? "text-green-700"
                            : "text-red-700"
                            }`}
                        >
                          {document.verified
                            ? "Verified"
                            : "Missing"}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-medium text-gray-900">
                        {document.label}
                      </p>

                      <p
                        className={`mt-1 text-xs ${document.verified
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {document.verified
                          ? "Document submitted"
                          : "Document not submitted"}
                      </p>
                    </div>
                  ))}

                </div>
              </section>

            </div>
          )}

          {/* Footer */}
          {selectedSchoolForReview && (
            <div className="border-t bg-gray-50 px-6 py-4">
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">

                <Button
                  variant="outline"
                  onClick={() => setShowReviewDialog(false)}
                  className="sm:min-w-[90px]"
                >
                  Close
                </Button>

                <Button
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 sm:min-w-[110px]"
                  onClick={() => {
                    setRejectTarget(selectedSchoolForReview);
                    setShowReviewDialog(false);
                  }}
                  disabled={processingIds.has(
                    selectedSchoolForReview._id
                  )}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>

                <Button
                  className="bg-green-600 hover:bg-green-700 sm:min-w-[110px]"
                  onClick={() => {
                    approveSchool(selectedSchoolForReview._id);
                    setShowReviewDialog(false);
                  }}
                  disabled={processingIds.has(
                    selectedSchoolForReview._id
                  )}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>

              </div>
            </div>
          )}

        </DialogContent>
      </Dialog>
      <RejectSchoolDialog
        onSubmit={async (data) => {
          if (rejectTarget) {
            await rejectSchool(rejectTarget._id, data);
          }
        }}
        open={!!rejectTarget}
        schoolName={rejectTarget?.name || ''}
        loading={rejectTarget ? processingIds.has(rejectTarget._id) : false}
        onClose={() => setRejectTarget(null)}
      />

      {filterSchool.length === 0 && !isLoading && (
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