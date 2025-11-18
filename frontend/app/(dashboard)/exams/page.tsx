'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ExamsPage() {
  // Mock data
  const exams = [
    {
      id: '1',
      name: 'Half Yearly Examination',
      type: 'Theory',
      startDate: '2025-12-01',
      endDate: '2025-12-15',
      classes: ['10', '9', '8'],
      status: 'Upcoming',
    },
    {
      id: '2',
      name: 'First Terminal Exam',
      type: 'Theory + Practical',
      startDate: '2025-09-01',
      endDate: '2025-09-15',
      classes: ['10', '9'],
      status: 'Completed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Examination Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage exams, schedule, and results</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/exams/results">View Results</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/exams/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Exam
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {exams.filter((e) => e.status === 'Upcoming').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {exams.filter((e) => e.status === 'Completed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Pass %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">87.5%</div>
          </CardContent>
        </Card>
      </div>

      {/* Exams List */}
      <div className="space-y-4">
        {exams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle>{exam.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{exam.type}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    exam.status === 'Upcoming'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  {exam.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{new Date(exam.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium">{new Date(exam.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Classes</p>
                  <p className="font-medium">Class {exam.classes.join(', ')}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/exams/${exam.id}`}>View Details</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/exams/${exam.id}/schedule`}>View Schedule</Link>
                </Button>
                {exam.status === 'Upcoming' && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/exams/${exam.id}/marks`}>Enter Marks</Link>
                  </Button>
                )}
                {exam.status === 'Completed' && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/exams/${exam.id}/results`}>View Results</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
