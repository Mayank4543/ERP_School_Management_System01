'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, Award, DollarSign, MessageSquare, Bell } from 'lucide-react';

export default function ParentPortalPage() {
  const student = {
    name: 'Rahul Kumar',
    class: '10-A',
    rollNo: '1001',
    attendance: 94.5,
    rank: 5,
  };

  const recentAttendance = [
    { date: '2025-11-17', status: 'present' },
    { date: '2025-11-16', status: 'present' },
    { date: '2025-11-15', status: 'absent' },
    { date: '2025-11-14', status: 'present' },
    { date: '2025-11-13', status: 'present' },
  ];

  const upcomingTests = [
    { subject: 'Mathematics', date: '2025-11-20', syllabus: 'Chapters 1-5' },
    { subject: 'Physics', date: '2025-11-22', syllabus: 'Units and Measurements' },
  ];

  const recentMarks = [
    { subject: 'Mathematics', test: 'Unit Test 2', marks: 45, total: 50, date: '2025-11-10' },
    { subject: 'Science', test: 'Mid-Term', marks: 88, total: 100, date: '2025-11-08' },
    { subject: 'English', test: 'Unit Test 2', marks: 42, total: 50, date: '2025-11-05' },
  ];

  const feeDetails = {
    totalFee: 30000,
    paid: 20000,
    pending: 10000,
    dueDate: '2025-12-01',
  };

  const notifications = [
    { id: '1', title: 'Parent-Teacher Meeting', date: '2025-11-20', type: 'event' },
    { id: '2', title: 'Fee Payment Reminder', date: '2025-11-18', type: 'fee' },
    { id: '3', title: 'Exam Schedule Released', date: '2025-11-15', type: 'academic' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Parent Portal</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your child's progress</p>
        </div>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" />
          Contact Teacher
        </Button>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">RK</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-gray-500">Class {student.class} • Roll No: {student.rollNo}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{student.attendance}%</p>
                <p className="text-sm text-gray-500">Attendance</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">#{student.rank}</p>
                <p className="text-sm text-gray-500">Class Rank</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{student.attendance}%</div>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">87.5%</div>
            <p className="text-xs text-gray-500 mt-1">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fee</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">₹{feeDetails.pending.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Due: {feeDetails.dueDate}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{notifications.length}</div>
            <p className="text-xs text-gray-500 mt-1">Unread messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="academic">
        <TabsList>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Academic Tab */}
        <TabsContent value="academic" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMarks.map((mark, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{mark.subject}</h4>
                      <p className="text-sm text-gray-500">{mark.test} • {mark.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {mark.marks}/{mark.total}
                      </p>
                      <p className="text-sm text-gray-500">
                        {((mark.marks / mark.total) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{test.subject}</h4>
                      <p className="text-sm text-gray-500">Syllabus: {test.syllabus}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{test.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance (Last 5 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentAttendance.map((record) => (
                  <div key={record.date} className="flex items-center justify-between p-3 border rounded-lg">
                    <p className="font-medium">{record.date}</p>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      record.status === 'present'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-green-600">18</p>
                  <p className="text-sm text-gray-500">Present Days</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-red-600">1</p>
                  <p className="text-sm text-gray-500">Absent Days</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-yellow-600">0</p>
                  <p className="text-sm text-gray-500">Half Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fees Tab */}
        <TabsContent value="fees" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Payment Progress</span>
                  <span>{((feeDetails.paid / feeDetails.totalFee) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(feeDetails.paid / feeDetails.totalFee) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500">Total Fee</p>
                  <p className="text-xl font-bold">₹{feeDetails.totalFee.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <p className="text-sm text-gray-500">Paid</p>
                  <p className="text-xl font-bold text-green-600">₹{feeDetails.paid.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-xl font-bold text-yellow-600">₹{feeDetails.pending.toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Due Date: {feeDetails.dueDate}</p>
                <Button className="w-full">Pay Now</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-3 mt-4">
          {notifications.map((notification) => (
            <Card key={notification.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      notification.type === 'event' ? 'bg-blue-600' :
                      notification.type === 'fee' ? 'bg-yellow-600' :
                      'bg-green-600'
                    }`} />
                    <div>
                      <h4 className="font-semibold">{notification.title}</h4>
                      <p className="text-sm text-gray-500">{notification.date}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
