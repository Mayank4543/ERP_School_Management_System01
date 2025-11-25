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
import sectionsService from '@/lib/api/services/sections.service';
import { useAuth } from '@/contexts/AuthContext';

export default function MarkAttendancePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | 'leave'>>({});

  // Load sections when class is selected
  useEffect(() => {
    if (selectedClass && user?.school_id) {
      loadSections(parseInt(selectedClass));
    } else {
      setSections([]);
      setSelectedSection('');
    }
  }, [selectedClass, user?.school_id]);

  // Fetch students when class and section are selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass || !selectedSection || !user?.school_id) {
        setStudents([]);
        return;
      }

      try {
        setFetching(true);
        console.log('Fetching students for:', { schoolId: user.school_id, standard: parseInt(selectedClass), sectionId: selectedSection });
        const data = await studentsService.getByClass(
          user.school_id,
          parseInt(selectedClass),
          selectedSection // This is now the section ID from the sections API
        );
        console.log('Students data received:', data);
        setStudents(data);

        // Initialize attendance as present for all students
        const initialAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
        data.forEach((student: any) => {
          // Use student's user_id for attendance tracking since backend expects user_id
          const userId = student.user_id?._id || student.user_id || student._id;
          initialAttendance[userId] = 'present';
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

  const loadSections = async (standard: number) => {
    if (!user?.school_id) return;

    try {
      setSectionsLoading(true);
      const sectionsData = await sectionsService.getByStandard(standard);
      setSections(sectionsData);
    } catch (error) {
      console.error('Error loading sections:', error);
      toast.error('Failed to load sections');
      setSections([]);
    } finally {
      setSectionsLoading(false);
    }
  };

  const handleToggleAttendance = (studentKey: string, status: 'present' | 'absent' | 'late' | 'leave') => {
    setAttendance((prev) => ({
      ...prev,
      [studentKey]: status,
    }));
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    const newAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach((student) => {
      const userId = student.user_id?._id || student.user_id || student._id;
      newAttendance[userId] = status;
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
      // Fix API payload structure to match backend expectations  
      const attendanceRecords = Object.entries(attendance).map(([userKey, status]) => ({
        user_id: userKey, // This should now be the actual user_id from the student record
        status,
      }));

      console.log('Attendance payload:', {
        school_id: user?.school_id!,
        date: selectedDate,
        user_type: 'student',
        standard: parseInt(selectedClass),
        section_id: selectedSection,
        attendance: attendanceRecords,
      });

      await attendanceService.markAttendance({
        school_id: user?.school_id!,
        date: selectedDate,
        user_type: 'student', // Required field for backend
        standard: parseInt(selectedClass),
        section_id: selectedSection, // Backend expects section_id
        attendance: attendanceRecords, // Backend expects 'attendance', not 'attendance_records'
      });

      toast.success('Attendance marked successfully');
      router.push('/dashboard/attendance');
    } catch (error: any) {
      console.error('Attendance marking error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to mark attendance';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedSectionName = () => {
    const section = sections.find(s => s._id === selectedSection);
    return section ? section.name : '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Mark Attendance</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Select class and mark student attendance</p>
        </div>
        <Button variant="outline" onClick={() => router.back()} className="self-start sm:self-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Class {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
                disabled={!selectedClass || sectionsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sectionsLoading ? (
                    <SelectItem value="loading" disabled>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading sections...
                    </SelectItem>
                  ) : sections.length === 0 ? (
                    <SelectItem value="no-sections" disabled>
                      No sections found
                    </SelectItem>
                  ) : (
                    sections.map((section) => (
                      <SelectItem key={section._id} value={section._id}>
                        Section {section.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex flex-col sm:flex-row sm:items-end gap-2">
              <Button onClick={() => handleMarkAll('present')} variant="outline" className="w-full sm:flex-1">
                Mark All Present
              </Button>
              <Button onClick={() => handleMarkAll('absent')} variant="outline" className="w-full sm:flex-1">
                Mark All Absent
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
            <CardTitle>Student List - Class {selectedClass}{getSelectedSectionName()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.map((student) => {
                const userId = student.user_id?._id || student.user_id || student._id;
                return (
                  <div
                    key={student._id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 overflow-hidden">
                        {student.user_id?.profile_picture || student.profile_picture ? (
                          <img
                            src={student.user_id?.profile_picture || student.profile_picture}
                            alt="Student"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
                            {student.roll_no || student.roll_number || (student.user_id?.first_name || student.first_name || '?').charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {student.user_id?.first_name || student.first_name || ''} {student.user_id?.last_name || student.last_name || ''}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          Roll: {student.roll_no || student.roll_number || '-'} | Adm: {student.admission_no || student.admission_number || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                      <Button
                        size="sm"
                        variant={attendance[userId] === 'present' ? 'default' : 'outline'}
                        onClick={() => handleToggleAttendance(userId, 'present')}
                        className={`min-w-0 flex-1 sm:flex-initial text-xs sm:text-sm ${attendance[userId] === 'present' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                      >
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={attendance[userId] === 'absent' ? 'default' : 'outline'}
                        onClick={() => handleToggleAttendance(userId, 'absent')}
                        className={`min-w-0 flex-1 sm:flex-initial text-xs sm:text-sm ${attendance[userId] === 'absent' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
                      >
                        Absent
                      </Button>
                      <Button
                        size="sm"
                        variant={attendance[userId] === 'late' ? 'default' : 'outline'}
                        onClick={() => handleToggleAttendance(userId, 'late')}
                        className={`min-w-0 flex-1 sm:flex-initial text-xs sm:text-sm ${attendance[userId] === 'late' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : ''}`}
                      >
                        Late
                      </Button>
                      <Button
                        size="sm"
                        variant={attendance[userId] === 'leave' ? 'default' : 'outline'}
                        onClick={() => handleToggleAttendance(userId, 'leave')}
                        className={`min-w-0 flex-1 sm:flex-initial text-xs sm:text-sm ${attendance[userId] === 'leave' ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}`}
                      >
                        Leave
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <Button variant="outline" onClick={() => router.back()} className="order-2 sm:order-1">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || fetching || Object.keys(attendance).length === 0}
                className="order-1 sm:order-2"
              >
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
