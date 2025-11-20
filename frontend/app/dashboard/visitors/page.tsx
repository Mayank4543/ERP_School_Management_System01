'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, LogIn, LogOut, Shield, Eye } from 'lucide-react';

export default function VisitorsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    todayVisits: 12,
    activeVisitors: 5,
    totalToday: 8,
    checkouts: 7,
  };

  const visitors = [
    {
      id: '1',
      name: 'Mr. Rajesh Kumar',
      purpose: 'Meeting with Principal',
      phone: '+91 98765 43210',
      checkIn: '09:30 AM',
      checkOut: null,
      status: 'inside',
      visitingPerson: 'Dr. Anjali Kumar',
      idProof: 'Aadhaar Card',
    },
    {
      id: '2',
      name: 'Mrs. Sunita Sharma',
      purpose: 'Student Enquiry',
      phone: '+91 98765 43211',
      checkIn: '10:15 AM',
      checkOut: '11:00 AM',
      status: 'checked-out',
      visitingPerson: 'Receptionist',
      idProof: 'Driving License',
    },
    {
      id: '3',
      name: 'Mr. Amit Patel',
      purpose: 'Book Supplier',
      phone: '+91 98765 43212',
      checkIn: '11:30 AM',
      checkOut: null,
      status: 'inside',
      visitingPerson: 'Ms. Priya (Librarian)',
      idProof: 'PAN Card',
    },
  ];

  const gatePass = [
    {
      id: '1',
      studentName: 'Rahul Kumar',
      class: '10-A',
      rollNo: '1001',
      reason: 'Medical Emergency',
      issueTime: '12:30 PM',
      status: 'approved',
      approvedBy: 'Class Teacher',
    },
    {
      id: '2',
      studentName: 'Priya Sharma',
      class: '9-B',
      rollNo: '1002',
      reason: 'Family Function',
      issueTime: '01:15 PM',
      status: 'pending',
      requestedBy: 'Parent',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Visitors & Security</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage visitor log and gate passes</p>
        </div>
        <Button>
          <UserCheck className="mr-2 h-4 w-4" />
          Register Visitor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Visits</CardTitle>
            <UserCheck className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayVisits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inside Now</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeVisitors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
            <LogIn className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-outs</CardTitle>
            <LogOut className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkouts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="visitors">
        <TabsList>
          <TabsTrigger value="visitors">Visitor Log</TabsTrigger>
          <TabsTrigger value="gatepass">Gate Pass</TabsTrigger>
        </TabsList>

        {/* Visitor Log */}
        <TabsContent value="visitors" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <Input
                placeholder="Search visitors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="space-y-3">
            {visitors.map((visitor) => (
              <Card key={visitor.id} className={`border-l-4 ${
                visitor.status === 'inside' ? 'border-l-green-500' : 'border-l-gray-300'
              }`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{visitor.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          visitor.status === 'inside'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {visitor.status === 'inside' ? 'Inside' : 'Checked Out'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Purpose</p>
                          <p className="font-medium">{visitor.purpose}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Visiting</p>
                          <p className="font-medium">{visitor.visitingPerson}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Check In</p>
                          <p className="font-medium text-blue-600">{visitor.checkIn}</p>
                        </div>
                        {visitor.checkOut && (
                          <div>
                            <p className="text-sm text-gray-500">Check Out</p>
                            <p className="font-medium text-gray-600">{visitor.checkOut}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Phone: </span>
                          <span className="font-medium">{visitor.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">ID Proof: </span>
                          <span className="font-medium">{visitor.idProof}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {visitor.status === 'inside' ? (
                        <Button size="sm">
                          <LogOut className="mr-2 h-4 w-4" />
                          Check Out
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">View Details</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Gate Pass */}
        <TabsContent value="gatepass" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Gate Pass</CardTitle>
                <Button size="sm">Issue Gate Pass</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gatePass.map((pass) => (
                  <div
                    key={pass.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{pass.studentName}</h4>
                        <span className="text-sm text-gray-500">
                          {pass.class} • {pass.rollNo}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          pass.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {pass.status.charAt(0).toUpperCase() + pass.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Reason</p>
                          <p className="font-medium">{pass.reason}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Issue Time</p>
                          <p className="font-medium">{pass.issueTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">
                            {pass.status === 'approved' ? 'Approved By' : 'Requested By'}
                          </p>
                          <p className="font-medium">
                            {pass.status === 'approved' ? pass.approvedBy : pass.requestedBy}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {pass.status === 'pending' ? (
                        <>
                          <Button size="sm">Approve</Button>
                          <Button size="sm" variant="outline">Reject</Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline">View Pass</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
