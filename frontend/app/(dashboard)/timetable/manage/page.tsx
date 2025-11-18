'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, BookOpen, Users, Plus, Edit } from 'lucide-react';

export default function TimetableManagementPage() {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedDay, setSelectedDay] = useState('monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [
    { time: '08:00 - 08:45', label: 'Period 1' },
    { time: '08:45 - 09:30', label: 'Period 2' },
    { time: '09:30 - 10:15', label: 'Period 3' },
    { time: '10:15 - 10:30', label: 'Break' },
    { time: '10:30 - 11:15', label: 'Period 4' },
    { time: '11:15 - 12:00', label: 'Period 5' },
    { time: '12:00 - 12:45', label: 'Period 6' },
    { time: '12:45 - 01:30', label: 'Lunch' },
    { time: '01:30 - 02:15', label: 'Period 7' },
    { time: '02:15 - 03:00', label: 'Period 8' },
  ];

  const timetable = {
    monday: [
      { subject: 'Mathematics', teacher: 'Mr. Sharma', room: '301' },
      { subject: 'Physics', teacher: 'Dr. Kumar', room: '302' },
      { subject: 'Chemistry', teacher: 'Ms. Gupta', room: '303' },
      { subject: 'Break', teacher: '-', room: '-' },
      { subject: 'English', teacher: 'Mrs. Verma', room: '201' },
      { subject: 'Biology', teacher: 'Dr. Patel', room: '304' },
      { subject: 'Computer', teacher: 'Mr. Singh', room: 'Lab 1' },
      { subject: 'Lunch', teacher: '-', room: '-' },
      { subject: 'Physical Ed', teacher: 'Mr. Rao', room: 'Ground' },
      { subject: 'Hindi', teacher: 'Mrs. Joshi', room: '202' },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Timetable Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create and manage class timetables</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Bulk Upload</Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Period
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Periods</CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">480</div>
            <p className="text-xs text-gray-500 mt-1">Per week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Working Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-gray-500 mt-1">Monday - Saturday</p>
          </CardContent>
        </Card>
      </div>

      {/* Class Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10-A">Class 10-A</SelectItem>
                  <SelectItem value="10-B">Class 10-B</SelectItem>
                  <SelectItem value="9-A">Class 9-A</SelectItem>
                  <SelectItem value="9-B">Class 9-B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Day</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day.toLowerCase()} value={day.toLowerCase()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timetable Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Timetable for {selectedClass} - {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</CardTitle>
            <Button size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {periods.map((period, index) => {
              const lesson = timetable.monday[index];
              const isBreak = period.label === 'Break' || period.label === 'Lunch';

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    isBreak ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-32">
                      <p className="text-sm font-medium text-gray-500">{period.time}</p>
                      <p className="text-xs text-gray-400">{period.label}</p>
                    </div>

                    {!isBreak ? (
                      <>
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{lesson?.subject}</p>
                          <p className="text-sm text-gray-500">{lesson?.teacher}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Room</p>
                          <p className="font-medium">{lesson?.room}</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 text-center">
                        <p className="font-medium text-gray-500">{period.label}</p>
                      </div>
                    )}
                  </div>

                  {!isBreak && (
                    <div className="ml-4">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Copy to Other Classes</Button>
            <Button variant="outline">Assign Substitute Teacher</Button>
            <Button variant="outline">Download PDF</Button>
            <Button variant="outline">Print Timetable</Button>
            <Button variant="outline">Send to Teachers</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
