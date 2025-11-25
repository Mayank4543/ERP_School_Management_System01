'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit2, Save, X, UserCheck, UserX, Clock, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import attendanceService from '@/lib/api/services/attendance.service';
import studentsService from '@/lib/api/services/students.service';
import sectionsService from '@/lib/api/services/sections.service';
import { toast } from 'sonner';

interface Student {
    _id: string;
    user_id: {
        _id: string;
        first_name?: string;
        last_name?: string;
        email: string;
        phone?: string;
        profile_picture?: string;
    } | string; // Handle both populated and unpopulated cases
    roll_no: string;
    admission_no: string;
    school_id: string;
    academic_year_id: string;
    standard: number;
    section_id: string;
    status: string;
    admission_date: string;
    father_name?: string;
    mother_name?: string;
}

// Helper function to safely get user ID
const getUserId = (user_id: Student['user_id']): string => {
    return typeof user_id === 'object' && user_id !== null ? user_id._id : user_id as string;
};

// Helper function to safely get user info
const getUserInfo = (user_id: Student['user_id']) => {
    return typeof user_id === 'object' && user_id !== null ? user_id : null;
};

// Helper function to get student display name
const getStudentDisplayName = (student: Student): string => {
    const userInfo = getUserInfo(student.user_id);

    // Try to get full name first
    if (userInfo?.first_name && userInfo?.last_name) {
        return `${userInfo.first_name} ${userInfo.last_name}`;
    }

    // Try individual name parts
    if (userInfo?.first_name) {
        return userInfo.first_name;
    }

    // Try to extract name from email
    if (userInfo?.email) {
        const emailName = userInfo.email.split('@')[0];
        // Convert formats like "raghav.kumar.2005" to "Raghav Kumar"
        const cleanName = emailName
            .replace(/\./g, ' ')           // Replace dots with spaces
            .replace(/\d+/g, '')          // Remove numbers
            .split(' ')
            .filter(part => part.length > 0) // Remove empty parts
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize
            .join(' ')
            .trim();

        if (cleanName) {
            return cleanName;
        }
    }

    // Try father's name or mother's name
    if (student.father_name) {
        return `Child of ${student.father_name}`;
    }

    if (student.mother_name) {
        return `Child of ${student.mother_name}`;
    }

    // Final fallbacks
    return student.admission_no || `Student ${student.roll_no}` || 'Unknown Student';
};

interface AttendanceRecord {
    user_id: string;
    status: 'present' | 'absent' | 'late' | 'leave';
    reason?: string;
    remarks?: string;
}

// Use the Attendance type from the service for the actual API response
type AttendanceData = any; // We'll use any since the structure varies between services

export default function ClassDetailPage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const standard = searchParams.get('standard');
    const sectionId = searchParams.get('sectionId');
    const date = searchParams.get('date');

    const [students, setStudents] = useState<Student[]>([]);
    const [sectionName, setSectionName] = useState<string>('');
    const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editedAttendance, setEditedAttendance] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user?.school_id && standard && sectionId && date) {
            loadData();
        }
    }, [user?.school_id, standard, sectionId, date]);

    const loadData = async () => {
        if (!user?.school_id || !sectionId || !standard || !date) return;

        try {
            setLoading(true);

            // Get section details, students, and attendance data in parallel
            const [sectionData, studentsData, attendance] = await Promise.all([
                sectionsService.getById(sectionId),
                studentsService.getByClass(user.school_id, parseInt(standard), sectionId),
                attendanceService.getByDateAndClass(user.school_id, date, parseInt(standard), sectionId)
            ]);

            console.log('🔍 Students data received:', studentsData);
            console.log('🔍 Sample student:', studentsData[0]);
            console.log('🔍 Sample user_id type:', typeof studentsData[0]?.user_id);
            console.log('🔍 Sample user_id value:', studentsData[0]?.user_id);
            console.log('🔍 Processing display names...');

            // Test the display name function with first student
            if (studentsData[0]) {
                console.log('🔍 Display name for first student:', getStudentDisplayName(studentsData[0]));
            }

            setStudents(studentsData);
            setAttendanceData(attendance);
            setSectionName(sectionData.name);

            // Initialize edit state
            const editState: Record<string, string> = {};
            studentsData.forEach(student => {
                const userId = getUserId(student.user_id);
                const attendanceRecord = attendance.find((a: any) => a.user_id === userId);
                editState[userId] = attendanceRecord?.status || 'present';
            });
            setEditedAttendance(editState);

        } catch (error) {
            console.error('Error loading class detail:', error);
            toast.error('Failed to load class data');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChanges = async () => {
        if (!user?.school_id || !date || !standard || !sectionId) return;

        try {
            const attendanceRecords = Object.entries(editedAttendance).map(([userId, status]) => ({
                user_id: userId,
                status: status as 'present' | 'absent' | 'late' | 'leave'
            }));

            await attendanceService.markAttendance({
                school_id: user.school_id,
                date,
                user_type: 'student',
                standard: parseInt(standard),
                section_id: sectionId,
                attendance: attendanceRecords
            });

            toast.success('Attendance updated successfully');
            setEditMode(false);
            loadData(); // Reload to get fresh data
        } catch (error) {
            console.error('Error saving attendance:', error);
            toast.error('Failed to save attendance');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'present':
                return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><UserCheck className="w-3 h-3 mr-1" />Present</Badge>;
            case 'absent':
                return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"><UserX className="w-3 h-3 mr-1" />Absent</Badge>;
            case 'late':
                return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"><Clock className="w-3 h-3 mr-1" />Late</Badge>;
            case 'leave':
                return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"><Coffee className="w-3 h-3 mr-1" />Leave</Badge>;
            default:
                return <Badge variant="secondary">Unknown</Badge>;
        }
    };

    const getStatusCounts = () => {
        const counts = { present: 0, absent: 0, late: 0, leave: 0 };
        Object.values(editMode ? editedAttendance : attendanceData.reduce((acc: Record<string, string>, record: any) => {
            acc[record.user_id] = record.status;
            return acc;
        }, {} as Record<string, string>)).forEach((status: string) => {
            if (status in counts) {
                counts[status as keyof typeof counts]++;
            }
        });
        return counts;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading class details...</p>
                </div>
            </div>
        );
    }

    const statusCounts = getStatusCounts();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Class {standard} - Section {sectionName || sectionId}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Attendance for {new Date(date!).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {editMode ? (
                        <>
                            <Button variant="outline" onClick={() => setEditMode(false)}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button onClick={handleSaveChanges}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setEditMode(true)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Attendance
                        </Button>
                    )}
                </div>
            </div>

            {/* Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{students.length}</p>
                            <p className="text-sm text-gray-500">Total Students</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{statusCounts.present}</p>
                            <p className="text-sm text-gray-500">Present</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-red-600">{statusCounts.absent}</p>
                            <p className="text-sm text-gray-500">Absent</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">{statusCounts.late}</p>
                            <p className="text-sm text-gray-500">Late</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{statusCounts.leave}</p>
                            <p className="text-sm text-gray-500">Leave</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Student List */}
            <Card>
                <CardHeader>
                    <CardTitle>Student Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {students.map((student) => {
                            const userId = getUserId(student.user_id);
                            const userInfo = getUserInfo(student.user_id);

                            const currentStatus = editMode
                                ? editedAttendance[userId]
                                : attendanceData.find(a => (a as any).user_id === userId)?.status || 'present';

                            return (
                                <div
                                    key={student._id}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center overflow-hidden">
                                            {userInfo?.profile_picture ? (
                                                <img
                                                    src={userInfo.profile_picture}
                                                    alt="Student"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                    {getStudentDisplayName(student).charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                {getStudentDisplayName(student)}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                Roll: {student.roll_no} | Admission: {student.admission_no}
                                                {userInfo?.email && (
                                                    <span className="ml-2 text-blue-600">• {userInfo.email}</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {editMode ? (
                                            <div className="flex gap-2">
                                                {['present', 'absent', 'late', 'leave'].map((status) => (
                                                    <Button
                                                        key={status}
                                                        size="sm"
                                                        variant={editedAttendance[userId] === status ? 'default' : 'outline'}
                                                        onClick={() => setEditedAttendance(prev => ({
                                                            ...prev,
                                                            [userId]: status
                                                        }))}
                                                        className={`
                              ${status === 'present' && editedAttendance[userId] === status ? 'bg-green-600 hover:bg-green-700' : ''}
                              ${status === 'absent' && editedAttendance[userId] === status ? 'bg-red-600 hover:bg-red-700' : ''}
                              ${status === 'late' && editedAttendance[userId] === status ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                              ${status === 'leave' && editedAttendance[userId] === status ? 'bg-purple-600 hover:bg-purple-700' : ''}
                            `}
                                                    >
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </Button>
                                                ))}
                                            </div>
                                        ) : (
                                            getStatusBadge(currentStatus)
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}