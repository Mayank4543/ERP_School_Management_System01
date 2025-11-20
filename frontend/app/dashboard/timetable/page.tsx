'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

export default function TimetablePage() {
  const [view, setView] = useState<'class' | 'teacher'>('class');
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedTeacher, setSelectedTeacher] = useState('Mr. Sharma');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];
  const timeSlots = ['8:00-8:45', '8:45-9:30', '9:30-10:15', '10:30-11:15', '11:15-12:00', '12:00-12:45', '12:45-1:30'];

  const classTimetable: Record<string, Record<string, { subject: string; teacher: string; room?: string }>> = {
    Monday: {
      '1st': { subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'R-101' },
      '2nd': { subject: 'Physics', teacher: 'Dr. Kumar', room: 'Lab-1' },
      '3rd': { subject: 'Chemistry', teacher: 'Ms. Patel', room: 'Lab-2' },
      '4th': { subject: 'English', teacher: 'Ms. Verma', room: 'R-102' },
      '5th': { subject: 'Biology', teacher: 'Mr. Singh', room: 'Lab-3' },
      '6th': { subject: 'Hindi', teacher: 'Mr. Rao', room: 'R-103' },
      '7th': { subject: 'Computer Science', teacher: 'Mr. Mehta', room: 'Lab-4' },
    },
    Tuesday: {
      '1st': { subject: 'Physics', teacher: 'Dr. Kumar', room: 'Lab-1' },
      '2nd': { subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'R-101' },
      '3rd': { subject: 'English', teacher: 'Ms. Verma', room: 'R-102' },
      '4th': { subject: 'Chemistry', teacher: 'Ms. Patel', room: 'Lab-2' },
      '5th': { subject: 'Hindi', teacher: 'Mr. Rao', room: 'R-103' },
      '6th': { subject: 'Biology', teacher: 'Mr. Singh', room: 'Lab-3' },
      '7th': { subject: 'PE', teacher: 'Coach Rawat', room: 'Ground' },
    },
    Wednesday: {
      '1st': { subject: 'Chemistry', teacher: 'Ms. Patel', room: 'Lab-2' },
      '2nd': { subject: 'Biology', teacher: 'Mr. Singh', room: 'Lab-3' },
      '3rd': { subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'R-101' },
      '4th': { subject: 'Physics', teacher: 'Dr. Kumar', room: 'Lab-1' },
      '5th': { subject: 'Computer Science', teacher: 'Mr. Mehta', room: 'Lab-4' },
      '6th': { subject: 'English', teacher: 'Ms. Verma', room: 'R-102' },
      '7th': { subject: 'Hindi', teacher: 'Mr. Rao', room: 'R-103' },
    },
    Thursday: {
      '1st': { subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'R-101' },
      '2nd': { subject: 'English', teacher: 'Ms. Verma', room: 'R-102' },
      '3rd': { subject: 'Physics', teacher: 'Dr. Kumar', room: 'Lab-1' },
      '4th': { subject: 'Biology', teacher: 'Mr. Singh', room: 'Lab-3' },
      '5th': { subject: 'Chemistry', teacher: 'Ms. Patel', room: 'Lab-2' },
      '6th': { subject: 'Computer Science', teacher: 'Mr. Mehta', room: 'Lab-4' },
      '7th': { subject: 'Library', teacher: 'Librarian', room: 'Library' },
    },
    Friday: {
      '1st': { subject: 'Biology', teacher: 'Mr. Singh', room: 'Lab-3' },
      '2nd': { subject: 'Chemistry', teacher: 'Ms. Patel', room: 'Lab-2' },
      '3rd': { subject: 'Hindi', teacher: 'Mr. Rao', room: 'R-103' },
      '4th': { subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'R-101' },
      '5th': { subject: 'English', teacher: 'Ms. Verma', room: 'R-102' },
      '6th': { subject: 'Physics', teacher: 'Dr. Kumar', room: 'Lab-1' },
      '7th': { subject: 'Computer Science', teacher: 'Mr. Mehta', room: 'Lab-4' },
    },
    Saturday: {
      '1st': { subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'R-101' },
      '2nd': { subject: 'Physics', teacher: 'Dr. Kumar', room: 'Lab-1' },
      '3rd': { subject: 'Chemistry', teacher: 'Ms. Patel', room: 'Lab-2' },
      '4th': { subject: 'Biology', teacher: 'Mr. Singh', room: 'Lab-3' },
      '5th': { subject: 'Sports', teacher: 'Coach Rawat', room: 'Ground' },
      '6th': { subject: 'Arts', teacher: 'Ms. Joshi', room: 'Art Room' },
      '7th': { subject: 'Music', teacher: 'Mr. Desai', room: 'Music Room' },
    },
  };

  const classes = ['6-A', '6-B', '7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B'];
  const teachers = ['Mr. Sharma', 'Dr. Kumar', 'Ms. Patel', 'Mr. Singh', 'Ms. Verma'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Timetable</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage class schedules</p>
        </div>
        <Button>Edit Timetable</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Working Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">6</div>
            <p className="text-xs text-gray-500">Monday - Saturday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Periods/Day</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">7</div>
            <p className="text-xs text-gray-500">45 min each</p>
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

      {/* View Toggle */}
      <Tabs value={view} onValueChange={(v) => setView(v as 'class' | 'teacher')}>
        <TabsList>
          <TabsTrigger value="class">Class Timetable</TabsTrigger>
          <TabsTrigger value="teacher">Teacher Timetable</TabsTrigger>
        </TabsList>

        <TabsContent value="class" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Class Timetable</CardTitle>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="border p-3 text-left font-semibold">Time</th>
                      {days.map((day) => (
                        <th key={day} className="border p-3 text-center font-semibold">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periods.map((period, idx) => (
                      <tr key={period} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="border p-3 font-medium">
                          <div>{period} Period</div>
                          <div className="text-xs text-gray-500">{timeSlots[idx]}</div>
                        </td>
                        {days.map((day) => {
                          const slot = classTimetable[day]?.[period];
                          return (
                            <td key={day} className="border p-3">
                              {slot ? (
                                <div className="text-center">
                                  <div className="font-medium text-blue-600">{slot.subject}</div>
                                  <div className="text-xs text-gray-500">{slot.teacher}</div>
                                  <div className="text-xs text-gray-400">{slot.room}</div>
                                </div>
                              ) : (
                                <div className="text-center text-gray-400">-</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teacher" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Teacher Timetable</CardTitle>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  {teachers.map((teacher) => (
                    <option key={teacher} value={teacher}>{teacher}</option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Teacher timetable view will show all classes assigned to {selectedTeacher}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
