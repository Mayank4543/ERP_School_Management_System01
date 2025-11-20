'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function HomeworkPage() {
  const [activeTab, setActiveTab] = useState('all');

  // Mock data
  const homework = [
    {
      id: '1',
      title: 'Math Exercise 4.2',
      subject: 'Mathematics',
      class: '10-A',
      assignedDate: '2025-11-17',
      dueDate: '2025-11-20',
      submitted: 38,
      total: 45,
      status: 'active',
    },
    {
      id: '2',
      title: 'English Essay - My Hero',
      subject: 'English',
      class: '9-B',
      assignedDate: '2025-11-16',
      dueDate: '2025-11-22',
      submitted: 25,
      total: 40,
      status: 'active',
    },
    {
      id: '3',
      title: 'Science Worksheet Chapter 5',
      subject: 'Science',
      class: '8-A',
      assignedDate: '2025-11-10',
      dueDate: '2025-11-15',
      submitted: 42,
      total: 42,
      status: 'completed',
    },
  ];

  const stats = {
    total: homework.length,
    active: homework.filter(h => h.status === 'active').length,
    completed: homework.filter(h => h.status === 'completed').length,
    pendingSubmissions: homework.filter(h => h.status === 'active').reduce((acc, h) => acc + (h.total - h.submitted), 0),
  };

  const filteredHomework = activeTab === 'all' 
    ? homework 
    : homework.filter(h => h.status === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Homework</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage daily homework assignments</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/homework/create">
            <Plus className="mr-2 h-4 w-4" />
            Assign Homework
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Homework</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.pendingSubmissions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Homework</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredHomework.map((hw) => {
            const submissionRate = Math.round((hw.submitted / hw.total) * 100);

            return (
              <Card key={hw.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{hw.title}</CardTitle>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          hw.status === 'active'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {hw.status === 'active' ? 'Active' : 'Completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Subject</p>
                      <p className="font-medium">{hw.subject}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Class</p>
                      <p className="font-medium">{hw.class}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Assigned Date</p>
                      <p className="font-medium">{new Date(hw.assignedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="font-medium">{new Date(hw.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submissions</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{hw.submitted}/{hw.total}</p>
                        <span className={`text-xs ${submissionRate >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                          ({submissionRate}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/homework/${hw.id}`}>View Details</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/homework/${hw.id}/submissions`}>
                        View Submissions ({hw.submitted})
                      </Link>
                    </Button>
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
