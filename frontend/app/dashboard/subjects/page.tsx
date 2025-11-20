'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function SubjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const subjects = [
    { id: '1', name: 'Mathematics', code: 'MATH101', type: 'Core', classes: ['10', '9'], teachers: ['Mr. Sharma', 'Ms. Gupta'], totalStudents: 185 },
    { id: '2', name: 'Physics', code: 'PHY101', type: 'Core', classes: ['10', '9'], teachers: ['Dr. Kumar'], totalStudents: 185 },
    { id: '3', name: 'Chemistry', code: 'CHEM101', type: 'Core', classes: ['10', '9'], teachers: ['Ms. Patel'], totalStudents: 185 },
    { id: '4', name: 'Biology', code: 'BIO101', type: 'Core', classes: ['10', '9'], teachers: ['Mr. Singh'], totalStudents: 185 },
    { id: '5', name: 'English', code: 'ENG101', type: 'Language', classes: ['10', '9', '8'], teachers: ['Ms. Verma'], totalStudents: 320 },
    { id: '6', name: 'Hindi', code: 'HIN101', type: 'Language', classes: ['10', '9', '8'], teachers: ['Mr. Rao'], totalStudents: 320 },
    { id: '7', name: 'Computer Science', code: 'CS101', type: 'Elective', classes: ['10', '9'], teachers: ['Mr. Mehta'], totalStudents: 95 },
    { id: '8', name: 'Physical Education', code: 'PE101', type: 'Activity', classes: ['10', '9', '8', '7'], teachers: ['Coach Rawat'], totalStudents: 450 },
  ];

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subjects Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage subjects and teacher assignments</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/subjects/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Core Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {subjects.filter(s => s.type === 'Core').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Electives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {subjects.filter(s => s.type === 'Elective').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">12</div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search subjects by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{subject.code}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  subject.type === 'Core' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' :
                  subject.type === 'Elective' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                  subject.type === 'Language' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' :
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {subject.type}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Classes</p>
                  <div className="flex gap-2 mt-1">
                    {subject.classes.map((cls) => (
                      <span key={cls} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm">
                        Class {cls}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Teachers</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {subject.teachers.map((teacher, idx) => (
                      <span key={idx} className="text-sm text-blue-600 dark:text-blue-400">
                        {teacher}{idx < subject.teachers.length - 1 && ','}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-xl font-bold text-blue-600">{subject.totalStudents}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/dashboard/subjects/${subject.id}`}>View</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/subjects/${subject.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
