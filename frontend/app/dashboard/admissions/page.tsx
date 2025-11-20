'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, CheckCircle, Clock, XCircle, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AdmissionsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    total: 125,
    pending: 45,
    approved: 65,
    rejected: 15,
  };

  const applications = [
    {
      id: '1',
      applicationNo: 'ADM2025001',
      studentName: 'Ankit Verma',
      class: '6',
      parentName: 'Mr. Suresh Verma',
      phone: '+91 98765 43210',
      email: 'suresh.verma@example.com',
      appliedDate: '2025-11-10',
      status: 'pending',
    },
    {
      id: '2',
      applicationNo: 'ADM2025002',
      studentName: 'Sneha Gupta',
      class: '7',
      parentName: 'Mrs. Rekha Gupta',
      phone: '+91 98765 43211',
      email: 'rekha.gupta@example.com',
      appliedDate: '2025-11-12',
      status: 'approved',
    },
    {
      id: '3',
      applicationNo: 'ADM2025003',
      studentName: 'Rohan Singh',
      class: '8',
      parentName: 'Mr. Vikram Singh',
      phone: '+91 98765 43212',
      email: 'vikram.singh@example.com',
      appliedDate: '2025-11-14',
      status: 'rejected',
      reason: 'Age criteria not met',
    },
  ];

  const filteredApplications = (status?: string) => {
    let filtered = applications;
    if (status) {
      filtered = filtered.filter(app => app.status === status);
    }
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicationNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admissions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage admission applications</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admissions/new">
            <UserPlus className="mr-2 h-4 w-4" />
            New Application
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
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

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search by name or application number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Applications Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {filteredApplications().map((app) => (
            <Card key={app.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{app.studentName}</h3>
                      <span className="text-sm text-gray-500">({app.applicationNo})</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        app.status === 'approved' ? 'bg-green-100 text-green-700' :
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Applying for Class</p>
                        <p className="font-medium">Class {app.class}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Parent/Guardian</p>
                        <p className="font-medium">{app.parentName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <p className="font-medium text-sm">{app.phone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Applied On</p>
                        <p className="font-medium">{app.appliedDate}</p>
                      </div>
                    </div>

                    {app.status === 'rejected' && app.reason && (
                      <div className="p-2 bg-red-50 dark:bg-red-900/10 rounded text-sm text-red-700">
                        Reason: {app.reason}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/admissions/${app.id}`}>View Details</Link>
                    </Button>
                    {app.status === 'pending' && (
                      <>
                        <Button size="sm" variant="default">Approve</Button>
                        <Button size="sm" variant="outline">Reject</Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-3 mt-4">
          {filteredApplications('pending').map((app) => (
            <Card key={app.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{app.studentName}</h3>
                    <p className="text-sm text-gray-500">Class {app.class} • {app.applicationNo}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Approve</Button>
                    <Button size="sm" variant="outline">Reject</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-3 mt-4">
          {filteredApplications('approved').map((app) => (
            <Card key={app.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{app.studentName}</h3>
                    <p className="text-sm text-gray-500">Class {app.class} • {app.applicationNo}</p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/admissions/${app.id}/complete`}>Complete Admission</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-3 mt-4">
          {filteredApplications('rejected').map((app) => (
            <Card key={app.id}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{app.studentName}</h3>
                <p className="text-sm text-gray-500 mb-2">Class {app.class} • {app.applicationNo}</p>
                {app.reason && (
                  <p className="text-sm text-red-600">Reason: {app.reason}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
