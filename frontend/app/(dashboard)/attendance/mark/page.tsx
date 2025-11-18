'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function MarkAttendancePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock students data - replace with API call
  const students = selectedClass
    ? [
        { id: '1', name: 'Aarav Kumar', rollNo: '101', admissionNo: 'STU001' },
        { id: '2', name: 'Priya Singh', rollNo: '102', admissionNo: 'STU002' },
        { id: '3', name: 'Rahul Sharma', rollNo: '103', admissionNo: 'STU003' },
        { id: '4', name: 'Sneha Patel', rollNo: '104', admissionNo: 'STU004' },
        { id: '5', name: 'Vikram Rao', rollNo: '105', admissionNo: 'STU005' },
      ]
    : [];

  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  const handleToggleAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    const newAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach((student) => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // API call to save attendance
      // await axios.post('/attendance/mark', { date: selectedDate, class: selectedClass, attendance });
      
      toast.success('Attendance marked successfully');
      router.push('/dashboard/attendance');
    } catch (error) {
      toast.error('Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mark Attendance</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Select class and mark student attendance</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class & Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Class 10</SelectItem>
                  <SelectItem value="9">Class 9</SelectItem>
                  <SelectItem value="8">Class 8</SelectItem>
                  <SelectItem value="7">Class 7</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                  <SelectItem value="C">Section C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex items-end gap-2">
              <Button onClick={() => handleMarkAll('present')} variant="outline" className="flex-1">
                Mark All Present
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      {students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Student List - Class {selectedClass}{selectedSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {student.rollNo}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{student.name}</h4>
                      <p className="text-sm text-gray-500">Roll No: {student.rollNo} | Adm: {student.admissionNo}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                      onClick={() => handleToggleAttendance(student.id, 'present')}
                      className={attendance[student.id] === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant={attendance[student.id] === 'absent' ? 'default' : 'outline'}
                      onClick={() => handleToggleAttendance(student.id, 'absent')}
                      className={attendance[student.id] === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                      Absent
                    </Button>
                    <Button
                      size="sm"
                      variant={attendance[student.id] === 'late' ? 'default' : 'outline'}
                      onClick={() => handleToggleAttendance(student.id, 'late')}
                      className={attendance[student.id] === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                    >
                      Late
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading || Object.keys(attendance).length === 0}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedClass && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">Please select a class and section to mark attendance</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
