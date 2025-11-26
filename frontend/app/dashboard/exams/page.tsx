'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, FileText, TrendingUp, Loader2, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import examsService from '@/lib/api/services/exams.service';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export default function ExamsPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0,
  });

  useEffect(() => {
    console.log('User context in exams page:', user);
    fetchExams();
  }, [user?.school_id]);

  const fetchExams = async () => {
    if (!user?.school_id) {
      console.log('No school_id found in user:', user);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching exams for school:', user.school_id);

      const data = await examsService.getAll({
        schoolId: user.school_id,
        page: 1,
        limit: 50,
        // Don't filter by academic year for now to see all exams
        // academic_year_id: user.academic_year_id,
      });

      console.log('Exams API response:', data);

      const examsList = data.data || [];
      setExams(examsList);

      // Calculate stats
      const now = new Date();
      const upcoming = examsList.filter((e: any) => new Date(e.start_date) > now).length;
      const ongoing = examsList.filter((e: any) =>
        new Date(e.start_date) <= now && new Date(e.end_date) >= now
      ).length;
      const completed = examsList.filter((e: any) => new Date(e.end_date) < now).length;

      setStats({
        total: data.total || examsList.length,
        upcoming,
        ongoing,
        completed,
      });

      console.log('Exam stats:', { total: data.total || examsList.length, upcoming, ongoing, completed });
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;

    try {
      await examsService.delete(examId);
      toast.success('Exam deleted successfully');
      fetchExams();
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast.error('Failed to delete exam');
    }
  };

  const getExamStatus = (exam: any) => {
    const now = new Date();
    const startDate = new Date(exam.start_date);
    const endDate = new Date(exam.end_date);

    if (startDate > now) return { label: 'Upcoming', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    if (startDate <= now && endDate >= now) return { label: 'Ongoing', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    return { label: 'Completed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Examination Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage exams, schedule, and results</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/exams/results">View Results</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/exams/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Exam
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ongoing}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Exams List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading exams...</span>
            </CardContent>
          </Card>
        ) : exams.length > 0 ? (
          exams.map((exam) => {
            const status = getExamStatus(exam);
            return (
              <Card key={exam._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{exam.name}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/exams/${exam._id}/marks`}>Enter Marks</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/exams/${exam._id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(exam._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">{format(new Date(exam.start_date), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium">{format(new Date(exam.end_date), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Subjects</p>
                      <p className="font-medium">{exam.subjects?.length || 0} subjects</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium capitalize">{exam.status || 'Scheduled'}</p>
                    </div>
                  </div>
                  {exam.description && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{exam.description}</p>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <div className="text-center">
                <p className="text-gray-500 text-lg mb-2">No exams found</p>
                <p className="text-gray-400 text-sm mb-4">
                  {user?.school_id
                    ? `No exams created yet for school ID: ${user.school_id}`
                    : 'School ID not found in user context'
                  }
                </p>
                <Button asChild>
                  <Link href="/dashboard/exams/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Exam
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
