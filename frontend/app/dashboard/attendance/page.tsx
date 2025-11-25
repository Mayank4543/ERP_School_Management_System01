'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import attendanceService from '@/lib/api/services/attendance.service';
import sectionsService from '@/lib/api/services/sections.service';
import studentsService from '@/lib/api/services/students.service';
import academicService from '@/lib/api/services/academic.service';
import { toast } from 'sonner';

interface AttendanceStats {
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  on_leave: number;
  half_day: number;
  attendancePercentage: number;
}

interface ClassAttendance {
  class: string;
  standard: number;
  section: string;
  sectionId: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export default function AttendancePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterSection, setFilterSection] = useState<string>('all');
  const [availableClasses, setAvailableClasses] = useState<number[]>([]);
  const [availableSections, setAvailableSections] = useState<string[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    totalStudents: 0,
    present: 0,
    absent: 0,
    late: 0,
    on_leave: 0,
    half_day: 0,
    attendancePercentage: 0,
  });
  const [classAttendanceData, setClassAttendanceData] = useState<ClassAttendance[]>([]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };

  useEffect(() => {
    if (user?.school_id) {
      loadAttendanceData();
    }
  }, [user?.school_id, selectedDate]);

  const loadAttendanceData = async () => {
    if (!user?.school_id) return;

    try {
      setLoading(true);

      // Load both academic year and class attendance in parallel for better performance
      const [currentAcademicYear] = await Promise.all([
        academicService.getCurrent(),
        loadClassAttendance() // Start class attendance loading early
      ]);

      // Get attendance summary for today
      const summaryData = await attendanceService.getSummary(
        user.school_id,
        currentAcademicYear._id,
        'student',
        selectedDate
      ); if (summaryData) {
        setStats({
          totalStudents: summaryData.total_students || 0,
          present: summaryData.present || 0,
          absent: summaryData.absent || 0,
          late: summaryData.late || 0,
          on_leave: summaryData.on_leave || 0,
          half_day: summaryData.half_day || 0,
          attendancePercentage: summaryData.attendance_percentage || 0,
        });
      }

      // Get class-wise attendance data
      await loadClassAttendance();

    } catch (error) {
      console.error('Error loading attendance data:', error);
      toast.error('Failed to load attendance data');
      // Set fallback empty data
      setStats({
        totalStudents: 0,
        present: 0,
        absent: 0,
        late: 0,
        on_leave: 0,
        half_day: 0,
        attendancePercentage: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadClassAttendance = async () => {
    if (!user?.school_id) return;

    try {
      // Get all sections for the school
      const sectionsResponse = await sectionsService.getAll({
        schoolId: user.school_id,
        page: 1,
        limit: 1000, // Get all sections
      });

      const classAttendance: ClassAttendance[] = [];

      // Process each section
      for (const section of sectionsResponse.data || []) {
        try {
          // Get attendance for this class and section for today
          const attendanceData = await attendanceService.getByDateAndClass(
            user.school_id,
            selectedDate,
            section.standard,
            section._id
          );

          // Get total students in this section
          const studentsInSection = await studentsService.getByClass(
            user.school_id,
            section.standard,
            section._id
          );

          const totalStudents = studentsInSection.length;
          const presentCount = attendanceData.filter(a => a.status === 'present').length;
          const absentCount = attendanceData.filter(a => a.status === 'absent').length;
          const lateCount = attendanceData.filter(a => a.status === 'late').length;

          const percentage = totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;

          classAttendance.push({
            class: `Class ${section.standard}-${section.name}`,
            standard: section.standard,
            section: section.name,
            sectionId: section._id,
            total: totalStudents,
            present: presentCount,
            absent: absentCount,
            late: lateCount,
            percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
          });
        } catch (sectionError) {
          console.warn(`Error processing section ${section.name}:`, sectionError);
          // Continue with other sections
        }
      }

      // Sort by standard then section
      classAttendance.sort((a, b) => {
        if (a.standard !== b.standard) {
          return b.standard - a.standard; // Higher classes first
        }
        return a.section.localeCompare(b.section);
      });

      setClassAttendanceData(classAttendance);

      // Set available classes and sections for filtering
      const classes = [...new Set(classAttendance.map(c => c.standard))].sort((a, b) => b - a);
      const sections = [...new Set(classAttendance.map(c => c.section))].sort();
      setAvailableClasses(classes);
      setAvailableSections(sections);

    } catch (error) {
      console.error('Error loading class attendance:', error);
      // Don't show toast for this as summary already handles main error
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track and manage student attendance for {new Date(selectedDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/dashboard/attendance/mark">
              <Calendar className="mr-2 h-4 w-4" />
              Mark Attendance
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/attendance/reports">View Reports</Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {availableClasses.map((cls) => (
                    <SelectItem key={cls} value={cls.toString()}>
                      Class {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Section</Label>
              <Select value={filterSection} onValueChange={setFilterSection}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {availableSections.map((section) => (
                    <SelectItem key={section} value={section}>
                      Section {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterClass('all');
                  setFilterSection('all');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2">Loading attendance data...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.present}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Late</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                <Calendar className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.on_leave}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance %</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.attendancePercentage.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/dashboard/attendance/mark">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Daily Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mark attendance for today's classes
                  </p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/dashboard/attendance/reports">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Monthly Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View detailed monthly attendance reports
                  </p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/dashboard/attendance/calendar">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Calendar View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View attendance in calendar format
                  </p>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* Recent Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance by Class</CardTitle>
            </CardHeader>
            <CardContent>
              {classAttendanceData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Calendar className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center">
                    No attendance data available for today
                  </p>
                  <p className="text-sm text-gray-400 text-center mt-1">
                    Start marking attendance to see class-wise statistics
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {classAttendanceData
                    .filter(classData => {
                      const classMatch = filterClass === 'all' || classData.standard.toString() === filterClass;
                      const sectionMatch = filterSection === 'all' || classData.section === filterSection;
                      return classMatch && sectionMatch;
                    })
                    .map((item) => (
                      <Card
                        key={`${item.standard}-${item.section}`}
                        className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
                        onClick={() => router.push(`/dashboard/attendance/class-detail?standard=${item.standard}&sectionId=${item.sectionId}&date=${selectedDate}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{item.class}</h4>
                              <p className="text-sm text-gray-500">Total: {item.total} students</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <p className="text-sm text-gray-500">Present</p>
                                <p className="text-lg font-bold text-green-600">{item.present}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-500">Absent</p>
                                <p className="text-lg font-bold text-red-600">{item.absent}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-500">Late</p>
                                <p className="text-lg font-bold text-yellow-600">{item.late}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-500">Rate</p>
                                <p className="text-lg font-bold text-blue-600">{item.percentage}%</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
