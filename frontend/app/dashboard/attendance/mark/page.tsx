'use client';

import { useState, useEffect } from 'react';
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
import { Calendar, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import attendanceService from '@/lib/api/services/attendance.service';
import studentsService from '@/lib/api/services/students.service';
import { useAuth } from '@/contexts/AuthContext';

export default function MarkAttendancePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  // Fetch students when class and section are selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass || !selectedSection || !user?.school_id) {
        setStudents([]);
        return;
      }

      try {
        setFetching(true);
        const data = await studentsService.getByClass(
          user.school_id,
          parseInt(selectedClass),
          selectedSection
        );
        setStudents(data);
        
        // Initialize attendance as present for all students
        const initialAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
        data.forEach((student: any) => {
          initialAttendance[student._id] = 'present';
        });
        setAttendance(initialAttendance);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to fetch students');
      } finally {
        setFetching(false);
      }
    };

    fetchStudents();
  }, [selectedClass, selectedSection, user?.school_id]);

  const handleToggleAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    const newAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach((student) => {
      newAttendance[student._id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedClass || !selectedSection) {
      toast.error('Please select date, class and section');
      return;
    }

    if (students.length === 0) {
      toast.error('No students found');
      return;
    }

    setLoading(true);
    try {
      const attendanceRecords = Object.entries(attendance).map(([studentId, status]) => ({
        student_id: studentId,
        status,
      }));

      await attendanceService.markAttendance({
        school_id: user?.school_id!,
        date: selectedDate,
        class: parseInt(selectedClass),
        section: selectedSection,
        attendance_records: attendanceRecords,
      });
      
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
      {fetching ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2">Loading students...</span>
            </div>
          </CardContent>
        </Card>
      ) : students.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Student List - Class {selectedClass}{selectedSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {student.roll_number || '-'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {student.first_name} {student.middle_name} {student.last_name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Roll No: {student.roll_number || '-'} | Adm: {student.admission_number}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant={attendance[student._id] === 'present' ? 'default' : 'outline'}
                      onClick={() => handleToggleAttendance(student._id, 'present')}
                      className={attendance[student._id] === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant={attendance[student._id] === 'absent' ? 'default' : 'outline'}
                      onClick={() => handleToggleAttendance(student._id, 'absent')}
                      className={attendance[student._id] === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                      Absent
                    </Button>
                    <Button
                      size="sm"
                      variant={attendance[student._id] === 'late' ? 'default' : 'outline'}
                      onClick={() => handleToggleAttendance(student._id, 'late')}
                      className={attendance[student._id] === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
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
              <Button onClick={handleSubmit} disabled={loading || fetching || Object.keys(attendance).length === 0}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {loading ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        selectedClass && selectedSection && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">No students found for this class</p>
            </CardContent>
          </Card>
        )
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
