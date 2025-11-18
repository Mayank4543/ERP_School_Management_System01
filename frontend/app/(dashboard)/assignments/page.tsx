'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Clock, FileText, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState('all');

  // Mock data
  const assignments = [
    {
      id: '1',
      title: 'Quadratic Equations Practice',
      subject: 'Mathematics',
      class: '10-A',
      teacher: 'Mr. Sharma',
      dueDate: '2025-11-25',
      totalMarks: 50,
      submissions: 35,
      totalStudents: 45,
      status: 'active',
      description: 'Solve problems 1-20 from Chapter 4'
    },
    {
      id: '2',
      title: 'Newton\'s Laws Lab Report',
      subject: 'Physics',
      class: '10-B',
      teacher: 'Dr. Kumar',
      dueDate: '2025-11-20',
      totalMarks: 30,
      submissions: 38,
      totalStudents: 40,
      status: 'active',
      description: 'Write a detailed lab report on Newton\'s laws experiment'
    },
    {
      id: '3',
      title: 'Chemical Bonding Assignment',
      subject: 'Chemistry',
      class: '10-A',
      teacher: 'Ms. Patel',
      dueDate: '2025-11-15',
      totalMarks: 25,
      submissions: 45,
      totalStudents: 45,
      status: 'completed',
      description: 'Answer questions on ionic and covalent bonding'
    },
  ];

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === 'active').length,
    completed: assignments.filter(a => a.status === 'completed').length,
    pending: assignments.filter(a => a.status === 'active').reduce((acc, a) => acc + (a.totalStudents - a.submissions), 0),
  };

  const filteredAssignments = activeTab === 'all' 
    ? assignments 
    : assignments.filter(a => a.status === activeTab);

  const getDaysLeft = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assignments</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track student assignments</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/assignments/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Assignment
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Assignments</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredAssignments.map((assignment) => {
            const daysLeft = getDaysLeft(assignment.dueDate);
            const submissionRate = Math.round((assignment.submissions / assignment.totalStudents) * 100);

            return (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">{assignment.title}</CardTitle>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          assignment.status === 'active'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {assignment.status === 'active' ? 'Active' : 'Completed'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{assignment.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Subject</p>
                      <p className="font-medium">{assignment.subject}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Class</p>
                      <p className="font-medium">{assignment.class}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                      </div>
                      {assignment.status === 'active' && (
                        <p className={`text-xs mt-1 ${daysLeft <= 2 ? 'text-red-600' : 'text-gray-500'}`}>
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Marks</p>
                      <p className="font-medium text-purple-600">{assignment.totalMarks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submissions</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{assignment.submissions}/{assignment.totalStudents}</p>
                        <span className={`text-xs ${submissionRate >= 80 ? 'text-green-600' : submissionRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          ({submissionRate}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/assignments/${assignment.id}`}>View Details</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/assignments/${assignment.id}/submissions`}>
                        View Submissions ({assignment.submissions})
                      </Link>
                    </Button>
                    {assignment.status === 'active' && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/assignments/${assignment.id}/grade`}>Grade</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
