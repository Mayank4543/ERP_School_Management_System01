'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Clock, 
  TrendingUp,
  FileText,
  CheckCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  Plus
} from 'lucide-react';

export default function AcademicManagementPage() {
  const [selectedTerm, setSelectedTerm] = useState('current');

  const academicData = {
    currentTerm: {
      name: 'Spring Term 2024',
      startDate: '2024-01-15',
      endDate: '2024-05-30',
      progress: 65,
      status: 'active'
    },
    overview: {
      totalCourses: 145,
      activeCourses: 132,
      totalStudents: 2847,
      totalTeachers: 189,
      upcomingExams: 8,
      pendingGrades: 23
    },
    recentActivities: [
      {
        id: '1',
        type: 'exam',
        title: 'Mathematics Final Exam',
        description: 'Grade 12 Mathematics final examination',
        date: '2024-12-25',
        status: 'scheduled',
        participants: 85
      },
      {
        id: '2',
        type: 'assignment',
        title: 'English Literature Essay',
        description: 'Grade 11 essay submission deadline',
        date: '2024-12-22',
        status: 'pending',
        participants: 120
      },
      {
        id: '3',
        type: 'grade',
        title: 'Chemistry Lab Reports',
        description: 'Grade 10 lab report grading completed',
        date: '2024-12-20',
        status: 'completed',
        participants: 95
      },
      {
        id: '4',
        type: 'course',
        title: 'Advanced Physics Course',
        description: 'New advanced physics course approved',
        date: '2024-12-18',
        status: 'approved',
        participants: 45
      }
    ],
    upcomingEvents: [
      {
        id: '1',
        title: 'Winter Break',
        type: 'holiday',
        startDate: '2024-12-23',
        endDate: '2025-01-08',
        description: 'School winter holiday break'
      },
      {
        id: '2',
        title: 'Grade 12 Final Exams',
        type: 'exam',
        startDate: '2024-12-25',
        endDate: '2024-12-30',
        description: 'Final examinations for graduating students'
      },
      {
        id: '3',
        title: 'Teacher Training Workshop',
        type: 'training',
        startDate: '2025-01-10',
        endDate: '2025-01-12',
        description: 'Professional development workshop for faculty'
      }
    ],
    gradingStatus: [
      { subject: 'Mathematics', total: 450, graded: 420, pending: 30, percentage: 93 },
      { subject: 'English', total: 380, graded: 365, pending: 15, percentage: 96 },
      { subject: 'Science', total: 520, graded: 485, pending: 35, percentage: 93 },
      { subject: 'History', total: 320, graded: 310, pending: 10, percentage: 97 },
      { subject: 'Art', total: 240, graded: 220, pending: 20, percentage: 92 }
    ]
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exam': return BookOpen;
      case 'assignment': return FileText;
      case 'grade': return GraduationCap;
      case 'course': return Users;
      default: return Calendar;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'holiday': return 'bg-green-100 text-green-800';
      case 'exam': return 'bg-red-100 text-red-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6\">
      <div className="flex items-center justify-between\">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Academic Management</h1>
          <p className="text-sm text-gray-600 mt-1\">Manage academic terms, courses, and student progress</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2\" />
            Academic Calendar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2\" />
            New Course
          </Button>
        </div>
      </div>

      {/* Current Term Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2\">
            <CalendarIcon className="h-5 w-5\" />
            Current Academic Term
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6\">
            <div>
              <h3 className="font-semibold text-lg mb-2\">{academicData.currentTerm.name}</h3>
              <div className="space-y-2 text-sm text-gray-600\">
                <p>Start: {new Date(academicData.currentTerm.startDate).toLocaleDateString()}</p>
                <p>End: {new Date(academicData.currentTerm.endDate).toLocaleDateString()}</p>
                <Badge className="bg-green-100 text-green-800\">
                  {academicData.currentTerm.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <div className="md:col-span-2\">
              <div className="flex items-center justify-between mb-2\">
                <span className="text-sm font-medium\">Term Progress</span>
                <span className="text-sm text-gray-600\">{academicData.currentTerm.progress}%</span>
              </div>
              <Progress value={academicData.currentTerm.progress} className="h-2\" />
              <p className="text-xs text-gray-500 mt-1\">
                {Math.round((new Date().getTime() - new Date(academicData.currentTerm.startDate).getTime()) / (1000 * 60 * 60 * 24))} days completed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className="text-sm font-medium\">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold\">{academicData.overview.totalCourses}</div>
            <p className="text-xs text-muted-foreground\">
              {academicData.overview.activeCourses} active courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className="text-sm font-medium\">Students Enrolled</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold\">{academicData.overview.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground\">
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className="text-sm font-medium\">Faculty Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold\">{academicData.overview.totalTeachers}</div>
            <p className="text-xs text-muted-foreground\">
              Active teaching staff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className="text-sm font-medium\">Upcoming Exams</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold\">{academicData.overview.upcomingExams}</div>
            <p className="text-xs text-muted-foreground\">
              Next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className="text-sm font-medium\">Pending Grades</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500\" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500\">{academicData.overview.pendingGrades}</div>
            <p className="text-xs text-muted-foreground\">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className="text-sm font-medium\">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500\" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500\">94.2%</div>
            <p className="text-xs text-muted-foreground\">
              Course completion
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6\">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2\">
              <Clock className="h-5 w-5\" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4\">
              {academicData.recentActivities.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg\">
                    <ActivityIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0\" />
                    <div className="flex-1 min-w-0\">
                      <div className="flex items-center gap-2 mb-1\">
                        <h4 className="font-medium text-sm\">{activity.title}</h4>
                        <Badge className={getActivityColor(activity.status)} size="sm">
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1\">{activity.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500\">
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                        <span>{activity.participants} participants</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2\">
              <Calendar className="h-5 w-5\" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4\">
              {academicData.upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg\">
                  <div className="flex items-center justify-between mb-2\">
                    <h4 className="font-medium\">{event.title}</h4>
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2\">{event.description}</p>
                  <div className="text-xs text-gray-500\">
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grading Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2\">
            <GraduationCap className="h-5 w-5\" />
            Grading Status by Subject
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4\">
            {academicData.gradingStatus.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between\">
                  <div className="flex items-center gap-3\">
                    <h4 className="font-medium\">{subject.subject}</h4>
                    <Badge variant="outline">
                      {subject.graded}/{subject.total} graded
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2\">
                    <span className="text-sm text-gray-600\">{subject.percentage}%</span>
                    {subject.pending > 0 ? (
                      <AlertCircle className="h-4 w-4 text-orange-500\" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500\" />
                    )}
                  </div>
                </div>
                <Progress value={subject.percentage} className="h-2" />
                {subject.pending > 0 && (
                  <p className="text-xs text-orange-600">
                    {subject.pending} assignments pending review
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}