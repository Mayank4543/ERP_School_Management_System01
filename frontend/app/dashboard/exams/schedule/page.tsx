'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users, BookOpen, Award } from 'lucide-react';

export default function ExamSchedulePage() {
  const [selectedExam, setSelectedExam] = useState('midterm-2025');

  const exams = [
    { id: 'midterm-2025', name: 'Mid-Term Exam 2025' },
    { id: 'final-2025', name: 'Final Exam 2025' },
  ];

  const schedule = [
    {
      date: '2025-12-01',
      day: 'Monday',
      exams: [
        {
          class: '10-A',
          subject: 'Mathematics',
          time: '09:00 AM - 12:00 PM',
          room: 'Room 301',
          invigilator: 'Mr. Sharma',
          totalMarks: 100,
        },
        {
          class: '9-A',
          subject: 'Science',
          time: '09:00 AM - 12:00 PM',
          room: 'Room 302',
          invigilator: 'Dr. Kumar',
          totalMarks: 100,
        },
      ],
    },
    {
      date: '2025-12-03',
      day: 'Wednesday',
      exams: [
        {
          class: '10-A',
          subject: 'Physics',
          time: '09:00 AM - 12:00 PM',
          room: 'Room 301',
          invigilator: 'Dr. Patel',
          totalMarks: 100,
        },
        {
          class: '9-A',
          subject: 'English',
          time: '09:00 AM - 12:00 PM',
          room: 'Room 302',
          invigilator: 'Ms. Gupta',
          totalMarks: 100,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exam Schedule</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage exam timetables and halls</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Generate Hall Tickets</Button>
          <Button>Create Schedule</Button>
        </div>
      </div>

      {/* Exam Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            {exams.map((exam) => (
              <Button
                key={exam.id}
                variant={selectedExam === exam.id ? 'default' : 'outline'}
                onClick={() => setSelectedExam(exam.id)}
              >
                {exam.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invigilators</CardTitle>
            <Award className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule */}
      <div className="space-y-4">
        {schedule.map((day) => (
          <Card key={day.date}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                {day.day}, {day.date}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {day.exams.map((exam, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Class</p>
                        <p className="font-semibold text-lg">{exam.class}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Subject</p>
                        <p className="font-semibold">{exam.subject}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-medium">{exam.time}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Room & Invigilator</p>
                        <p className="font-medium">{exam.room}</p>
                        <p className="text-sm text-gray-600">{exam.invigilator}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Marks</p>
                        <p className="font-semibold text-blue-600">{exam.totalMarks}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Seating</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline">View Seating Arrangement</Button>
            <Button variant="outline">Assign Invigilators</Button>
            <Button variant="outline">Download Schedule PDF</Button>
            <Button variant="outline">Send Notifications</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
