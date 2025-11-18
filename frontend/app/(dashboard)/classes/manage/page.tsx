'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, GraduationCap, Plus, Edit, Trash2 } from 'lucide-react';

export default function ManageClassesPage() {
  const [classes, setClasses] = useState([
    {
      id: '1',
      name: 'Class 10-A',
      classTeacher: 'Mr. Rajesh Sharma',
      totalStudents: 45,
      sections: 1,
      subjects: 8,
    },
    {
      id: '2',
      name: 'Class 10-B',
      classTeacher: 'Dr. Anjali Kumar',
      totalStudents: 42,
      sections: 1,
      subjects: 8,
    },
    {
      id: '3',
      name: 'Class 9-A',
      classTeacher: 'Ms. Priya Gupta',
      totalStudents: 48,
      sections: 1,
      subjects: 9,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Classes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Configure classes and sections</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">675</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Students/Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
          </CardContent>
        </Card>
      </div>

      {/* Classes List */}
      <div className="space-y-3">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">{cls.name}</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Class Teacher</p>
                      <p className="font-medium">{cls.classTeacher}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Students</p>
                      <p className="font-medium text-blue-600">{cls.totalStudents}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sections</p>
                      <p className="font-medium">{cls.sections}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Subjects</p>
                      <p className="font-medium">{cls.subjects}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Class Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Class</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="className">Class Name</Label>
              <Input id="className" placeholder="e.g., Class 11-A" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classTeacher">Class Teacher</Label>
              <Input id="classTeacher" placeholder="Select teacher" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" placeholder="e.g., 50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Room Number</Label>
              <Input id="room" placeholder="e.g., Room 301" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button>Create Class</Button>
            <Button variant="outline">Reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
