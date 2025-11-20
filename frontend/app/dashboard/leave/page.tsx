'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function LeavePage() {
  const [activeTab, setActiveTab] = useState('all');

  const leaves = [
    {
      id: '1',
      employeeName: 'Mr. Rajesh Sharma',
      employeeId: 'EMP001',
      type: 'Sick Leave',
      from: '2025-11-20',
      to: '2025-11-22',
      days: 3,
      reason: 'Medical treatment',
      status: 'pending',
      appliedOn: '2025-11-17',
    },
    {
      id: '2',
      employeeName: 'Ms. Priya Gupta',
      employeeId: 'EMP002',
      type: 'Casual Leave',
      from: '2025-11-18',
      to: '2025-11-18',
      days: 1,
      reason: 'Personal work',
      status: 'approved',
      appliedOn: '2025-11-15',
    },
    {
      id: '3',
      employeeName: 'Dr. Amit Kumar',
      employeeId: 'EMP003',
      type: 'Privilege Leave',
      from: '2025-11-25',
      to: '2025-11-30',
      days: 6,
      reason: 'Family function',
      status: 'rejected',
      appliedOn: '2025-11-16',
    },
  ];

  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
  };

  const filteredLeaves = activeTab === 'all' 
    ? leaves 
    : leaves.filter(l => l.status === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leave Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage leave applications and approvals</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/leave/apply">
            <Plus className="mr-2 h-4 w-4" />
            Apply Leave
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredLeaves.map((leave) => (
            <Card key={leave.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{leave.employeeName}</CardTitle>
                      <span className="text-sm text-gray-500">({leave.employeeId})</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        leave.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' :
                        leave.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                        'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Leave Type</p>
                    <p className="font-medium">{leave.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-medium">{new Date(leave.from).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-medium">{new Date(leave.to).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-blue-600">{leave.days} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applied On</p>
                    <p className="font-medium">{new Date(leave.appliedOn).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Reason</p>
                  <p className="text-gray-700 dark:text-gray-300">{leave.reason}</p>
                </div>

                {leave.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
