'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function ComplaintsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    total: 28,
    pending: 12,
    inProgress: 8,
    resolved: 8,
  };

  const complaints = [
    {
      id: '1',
      complaintNo: 'CMP2025001',
      title: 'Classroom AC not working',
      category: 'Infrastructure',
      submittedBy: 'Rahul Kumar (10-A)',
      priority: 'high',
      date: '2025-11-15',
      status: 'pending',
      description: 'AC in Room 301 has been malfunctioning for the past 2 days.',
    },
    {
      id: '2',
      complaintNo: 'CMP2025002',
      title: 'Library book shortage',
      category: 'Library',
      submittedBy: 'Priya Sharma (9-B)',
      priority: 'medium',
      date: '2025-11-14',
      status: 'in-progress',
      description: 'Not enough copies of Science textbooks available.',
    },
    {
      id: '3',
      complaintNo: 'CMP2025003',
      title: 'Bus delay issue',
      category: 'Transport',
      submittedBy: 'Parent - Amit Patel',
      priority: 'high',
      date: '2025-11-13',
      status: 'resolved',
      description: 'Route 2 bus consistently 15 minutes late.',
      resolution: 'Driver counseled and route optimized.',
    },
  ];

  const filteredComplaints = (status?: string) => {
    let filtered = complaints;
    if (status) {
      filtered = filtered.filter(c => c.status === status);
    }
    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.complaintNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complaints & Feedback</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage complaints and suggestions</p>
        </div>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" />
          Submit Complaint
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search complaints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Complaints Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({stats.inProgress})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {filteredComplaints().map((complaint) => (
            <Card key={complaint.id} className={`border-l-4 ${
              complaint.status === 'resolved' ? 'border-l-green-500' :
              complaint.status === 'in-progress' ? 'border-l-blue-500' :
              'border-l-yellow-500'
            }`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{complaint.title}</h3>
                      <span className="text-sm text-gray-500">({complaint.complaintNo})</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        complaint.priority === 'high' ? 'bg-red-100 text-red-700' :
                        complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {complaint.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        complaint.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {complaint.status === 'in-progress' ? 'In Progress' : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium">{complaint.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Submitted By</p>
                        <p className="font-medium">{complaint.submittedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{complaint.date}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{complaint.description}</p>
                    </div>

                    {complaint.resolution && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                        <p className="text-sm font-medium text-green-700 mb-1">Resolution</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{complaint.resolution}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm">View Details</Button>
                    {complaint.status !== 'resolved' && (
                      <>
                        <Button size="sm" variant="outline">Update Status</Button>
                        <Button size="sm" variant="outline">Assign</Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-3 mt-4">
          {filteredComplaints('pending').map((complaint) => (
            <Card key={complaint.id} className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{complaint.title}</h3>
                    <p className="text-sm text-gray-500">{complaint.category} • {complaint.submittedBy}</p>
                  </div>
                  <Button size="sm">Take Action</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-3 mt-4">
          {filteredComplaints('in-progress').map((complaint) => (
            <Card key={complaint.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{complaint.title}</h3>
                    <p className="text-sm text-gray-500">{complaint.category} • {complaint.submittedBy}</p>
                  </div>
                  <Button size="sm">Mark Resolved</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-3 mt-4">
          {filteredComplaints('resolved').map((complaint) => (
            <Card key={complaint.id} className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{complaint.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{complaint.category} • {complaint.submittedBy}</p>
                {complaint.resolution && (
                  <p className="text-sm text-green-600">✓ {complaint.resolution}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
