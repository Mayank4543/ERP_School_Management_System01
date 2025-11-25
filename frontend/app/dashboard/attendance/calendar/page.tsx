'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Calendar, Loader2, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import attendanceService from '@/lib/api/services/attendance.service';
import sectionsService from '@/lib/api/services/sections.service';
import { toast } from 'sonner';

interface CalendarDay {
    date: string;
    isCurrentMonth: boolean;
    isToday: boolean;
    attendanceData?: {
        total: number;
        present: number;
        absent: number;
        percentage: number;
    };
}

interface MonthAttendanceData {
    [date: string]: {
        total: number;
        present: number;
        absent: number;
        percentage: number;
    };
}

export default function AttendanceCalendarPage() {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [sectionsLoading, setSectionsLoading] = useState(false);
    const [selectedStandard, setSelectedStandard] = useState('all');
    const [selectedSection, setSelectedSection] = useState('all');
    const [sections, setSections] = useState<any[]>([]);
    const [monthAttendanceData, setMonthAttendanceData] = useState<MonthAttendanceData>({});
    const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

    useEffect(() => {
        if (user?.school_id) {
            loadSections();
        }
    }, [user?.school_id]);

    useEffect(() => {
        generateCalendarDays();
    }, [currentDate]);

    useEffect(() => {
        if (user?.school_id) {
            loadMonthAttendanceData();
        }
    }, [user?.school_id, currentDate, selectedStandard, selectedSection]);

    const loadSections = async () => {
        if (!user?.school_id) return;

        try {
            setSectionsLoading(true);
            const response = await sectionsService.getAll({
                schoolId: user.school_id,
                page: 1,
                limit: 1000,
            });
            setSections(response.data || []);
        } catch (error) {
            console.error('Error loading sections:', error);
            toast.error('Failed to load sections');
        } finally {
            setSectionsLoading(false);
        }
    };

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);

        // First day of the calendar (might be from previous month)
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // Last day of the calendar (might be from next month)
        const endDate = new Date(lastDay);
        endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

        const days: CalendarDay[] = [];
        const currentDatePtr = new Date(startDate);
        const today = new Date();

        while (currentDatePtr <= endDate) {
            const dateString = currentDatePtr.toISOString().split('T')[0];

            days.push({
                date: dateString,
                isCurrentMonth: currentDatePtr.getMonth() === month,
                isToday: currentDatePtr.toDateString() === today.toDateString(),
                attendanceData: monthAttendanceData[dateString],
            });

            currentDatePtr.setDate(currentDatePtr.getDate() + 1);
        }

        setCalendarDays(days);
    };

    const loadMonthAttendanceData = async () => {
        if (!user?.school_id) return;

        try {
            setLoading(true);
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
            const endDate = new Date(year, month, 0).toISOString().split('T')[0];

            const attendanceData: MonthAttendanceData = {};
            let sectionsToProcess = sections;

            // Filter sections based on selection
            if (selectedStandard !== 'all') {
                sectionsToProcess = sections.filter(s => s.standard === parseInt(selectedStandard));
            }
            if (selectedSection !== 'all') {
                sectionsToProcess = sectionsToProcess.filter(s => s._id === selectedSection);
            }

            // Process each day of the month
            const daysInMonth = new Date(year, month, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

                let totalStudents = 0;
                let totalPresent = 0;
                let totalAbsent = 0;

                // Process each section for this date
                for (const section of sectionsToProcess) {
                    try {
                        const dayAttendance = await attendanceService.getByDateAndClass(
                            user.school_id,
                            dateString,
                            section.standard,
                            section._id
                        );

                        const sectionPresent = dayAttendance.filter(a => a.status === 'present').length;
                        const sectionAbsent = dayAttendance.filter(a => a.status === 'absent').length;
                        const sectionTotal = sectionPresent + sectionAbsent;

                        totalStudents += sectionTotal;
                        totalPresent += sectionPresent;
                        totalAbsent += sectionAbsent;
                    } catch (error) {
                        // Skip sections with no attendance data
                    }
                }

                if (totalStudents > 0) {
                    attendanceData[dateString] = {
                        total: totalStudents,
                        present: totalPresent,
                        absent: totalAbsent,
                        percentage: Math.round((totalPresent / totalStudents) * 100),
                    };
                }
            }

            setMonthAttendanceData(attendanceData);
        } catch (error) {
            console.error('Error loading month attendance data:', error);
            toast.error('Failed to load attendance data');
        } finally {
            setLoading(false);
        }
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const getFilteredSections = () => {
        if (selectedStandard === 'all') return [];
        return sections.filter(section => section.standard === parseInt(selectedStandard));
    };

    const getAttendanceColorClass = (percentage?: number) => {
        if (!percentage) return 'bg-gray-100 dark:bg-gray-800';
        if (percentage >= 90) return 'bg-green-100 dark:bg-green-900';
        if (percentage >= 75) return 'bg-yellow-100 dark:bg-yellow-900';
        return 'bg-red-100 dark:bg-red-900';
    };

    const getAttendanceTextClass = (percentage?: number) => {
        if (!percentage) return 'text-gray-500';
        if (percentage >= 90) return 'text-green-800 dark:text-green-200';
        if (percentage >= 75) return 'text-yellow-800 dark:text-yellow-200';
        return 'text-red-800 dark:text-red-200';
    };

    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance Calendar</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        View attendance data in calendar format
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Calendar Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="standard">Class</Label>
                            <Select
                                value={selectedStandard}
                                onValueChange={(val) => {
                                    setSelectedStandard(val);
                                    setSelectedSection('all');
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All classes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
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
                                disabled={selectedStandard === 'all' || sectionsLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All sections" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sections</SelectItem>
                                    {getFilteredSections().map((section) => (
                                        <SelectItem key={section._id} value={section._id}>
                                            Section {section.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded"></div>
                                    <span>≥90%</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900 rounded"></div>
                                    <span>75-89%</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 bg-red-100 dark:bg-red-900 rounded"></div>
                                    <span>&lt;75%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Calendar */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            {formatMonthYear(currentDate)}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <span className="ml-2">Loading calendar data...</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Week headers */}
                            <div className="grid grid-cols-7 gap-2">
                                {weekDays.map((day) => (
                                    <div
                                        key={day}
                                        className="h-10 flex items-center justify-center font-medium text-gray-500 dark:text-gray-400"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar grid */}
                            <div className="grid grid-cols-7 gap-2">
                                {calendarDays.map((day, index) => (
                                    <div
                                        key={index}
                                        className={`
                      h-24 border rounded-lg p-2 flex flex-col justify-between
                      ${day.isCurrentMonth ? 'border-gray-200 dark:border-gray-700' : 'border-gray-100 dark:border-gray-800 opacity-50'}
                      ${day.isToday ? 'ring-2 ring-blue-500' : ''}
                      ${getAttendanceColorClass(day.attendanceData?.percentage)}
                    `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-medium ${day.isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                                {new Date(day.date).getDate()}
                                            </span>
                                            {day.attendanceData && (
                                                <Users className={`h-3 w-3 ${getAttendanceTextClass(day.attendanceData.percentage)}`} />
                                            )}
                                        </div>

                                        {day.attendanceData && day.isCurrentMonth && (
                                            <div className={`text-xs space-y-1 ${getAttendanceTextClass(day.attendanceData.percentage)}`}>
                                                <div className="font-semibold">{day.attendanceData.percentage}%</div>
                                                <div className="text-xs">
                                                    {day.attendanceData.present}/{day.attendanceData.total}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="border-t pt-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    Legend: Attendance percentage for selected classes/sections
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded border"></div>
                                        <span>Excellent (≥90%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900 rounded border"></div>
                                        <span>Good (75-89%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-red-100 dark:bg-red-900 rounded border"></div>
                                        <span>Poor (&lt;75%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded border"></div>
                                        <span>No data</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}