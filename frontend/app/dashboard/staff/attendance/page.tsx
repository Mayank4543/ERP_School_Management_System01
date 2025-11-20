'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Calendar as CalendarIcon } from 'lucide-react';

export default function StaffAttendancePage() {
  const [selectedDate, setSelectedDate] = useState('2025-11-17');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    totalStaff: 45,
    present: 42,
    absent: 2,
    onLeave: 1,
  };

  const staffAttendance = [
    {
      id: '1',
      name: 'Mr. Rajesh Sharma',
      employeeId: 'EMP001',
      department: 'Teaching',
      designation: 'Senior Teacher',
      status: 'present',
      checkIn: '08:45 AM',
      checkOut: null,
    },
    {
      id: '2',
      name: 'Dr. Anjali Kumar',
      employeeId: 'EMP002',
      department: 'Administration',
      designation: 'Principal',
      status: 'present',
      checkIn: '08:30 AM',
      checkOut: null,
    },
    {
      id: '3',
      name: 'Mr. Suresh Patel',
      employeeId: 'EMP003',
      department: 'Teaching',
      designation: 'Junior Teacher',
      status: 'absent',
      checkIn: null,
      checkOut: null,
    },
    {
      id: '4',
      name: 'Ms. Priya Gupta',
      employeeId: 'EMP004',
      department: 'Support Staff',
      designation: 'Librarian',
      status: 'on-leave',
      leaveType: 'Sick Leave',
      checkIn: null,
      checkOut: null,
    },
  ];

  const filteredStaff = (status?: string) => {
    let filtered = staffAttendance;
    if (status) {
      filtered = filtered.filter(s => s.status === status);
    }
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Attendance</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage staff attendance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Report</Button>
          <Button>Mark Attendance</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStaff}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <p className="text-xs text-gray-500 mt-1">{((stats.present / stats.totalStaff) * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.onLeave}</div>
          </CardContent>
        </Card>
      </div>

      {/* Date and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Search Staff</label>
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({stats.totalStaff})</TabsTrigger>
          <TabsTrigger value="present">Present ({stats.present})</TabsTrigger>
          <TabsTrigger value="absent">Absent ({stats.absent})</TabsTrigger>
          <TabsTrigger value="on-leave">On Leave ({stats.onLeave})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {filteredStaff().map((staff) => (
            <Card key={staff.id} className={`border-l-4 ${
              staff.status === 'present' ? 'border-l-green-500' :
              staff.status === 'absent' ? 'border-l-red-500' :
              'border-l-yellow-500'
            }`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{staff.name}</h3>
                      <span className="text-sm text-gray-500">({staff.employeeId})</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        staff.status === 'present' ? 'bg-green-100 text-green-700' :
                        staff.status === 'absent' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {staff.status === 'on-leave' ? 'On Leave' : staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-medium">{staff.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Designation</p>
                        <p className="font-medium">{staff.designation}</p>
                      </div>
                      {staff.checkIn && (
                        <div>
                          <p className="text-sm text-gray-500">Check In</p>
                          <p className="font-medium text-green-600">{staff.checkIn}</p>
                        </div>
                      )}
                      {staff.checkOut && (
                        <div>
                          <p className="text-sm text-gray-500">Check Out</p>
                          <p className="font-medium text-blue-600">{staff.checkOut}</p>
                        </div>
                      )}
                      {staff.leaveType && (
                        <div>
                          <p className="text-sm text-gray-500">Leave Type</p>
                          <p className="font-medium">{staff.leaveType}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {staff.status === 'present' && !staff.checkOut && (
                      <Button size="sm">Mark Check Out</Button>
                    )}
                    {staff.status === 'absent' && (
                      <Button size="sm" variant="outline">Mark Present</Button>
                    )}
                    <Button size="sm" variant="outline">View History</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="present" className="space-y-3 mt-4">
          {filteredStaff('present').map((staff) => (
            <Card key={staff.id} className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{staff.name}</h3>
                    <p className="text-sm text-gray-500">{staff.department} • Check In: {staff.checkIn}</p>
                  </div>
                  <Button size="sm">Mark Check Out</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="absent" className="space-y-3 mt-4">
          {filteredStaff('absent').map((staff) => (
            <Card key={staff.id} className="border-l-4 border-l-red-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{staff.name}</h3>
                    <p className="text-sm text-gray-500">{staff.department} • {staff.designation}</p>
                  </div>
                  <Button size="sm" variant="outline">Mark Present</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="on-leave" className="space-y-3 mt-4">
          {filteredStaff('on-leave').map((staff) => (
            <Card key={staff.id} className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-1">{staff.name}</h3>
                <p className="text-sm text-gray-500">{staff.leaveType} • {staff.department}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
