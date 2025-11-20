'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import Link from 'next/link';

export default function ClassesPage() {
  // Mock data - replace with API
  const classes = [
    { id: '1', standard: 10, sections: ['A', 'B', 'C'], totalStudents: 135, classTeacher: 'Mr. Sharma' },
    { id: '2', standard: 9, sections: ['A', 'B'], totalStudents: 98, classTeacher: 'Ms. Gupta' },
    { id: '3', standard: 8, sections: ['A', 'B', 'C'], totalStudents: 142, classTeacher: 'Mr. Kumar' },
    { id: '4', standard: 7, sections: ['A', 'B'], totalStudents: 87, classTeacher: 'Ms. Patel' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Classes & Sections</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage school classes and sections</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/classes/create">
            <Plus className="mr-2 h-4 w-4" />
            Add New Class
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.reduce((acc, c) => acc + c.sections.length, 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.reduce((acc, c) => acc + c.totalStudents, 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(classes.reduce((acc, c) => acc + c.totalStudents, 0) / classes.length)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Class {classItem.standard}</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/classes/${classItem.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Sections</p>
                  <div className="flex gap-2 mt-1">
                    {classItem.sections.map((section) => (
                      <Link
                        key={section}
                        href={`/dashboard/classes/${classItem.standard}/${section}`}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        Section {section}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="text-xl font-bold text-blue-600">{classItem.totalStudents}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Class Teacher</p>
                    <p className="font-medium">{classItem.classTeacher}</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/dashboard/classes/${classItem.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
