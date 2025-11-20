'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Clock, Download } from 'lucide-react';

export default function HomeworkSubmissionsPage() {
  const params = useParams();

  const submissions = [
    {
      id: '1',
      studentName: 'Rahul Kumar',
      rollNo: '1001',
      submittedOn: '2025-11-16 02:30 PM',
      status: 'submitted',
      file: 'homework_rahul.pdf',
      remarks: null,
    },
    {
      id: '2',
      studentName: 'Priya Sharma',
      rollNo: '1002',
      submittedOn: '2025-11-15 11:45 AM',
      status: 'checked',
      file: 'homework_priya.pdf',
      remarks: 'Well done! Keep it up.',
    },
    {
      id: '3',
      studentName: 'Amit Patel',
      rollNo: '1003',
      submittedOn: null,
      status: 'not-submitted',
      file: null,
      remarks: null,
    },
  ];

  const stats = {
    total: 45,
    submitted: 38,
    checked: 25,
    pending: 7,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Homework Submissions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Chapter 5 Practice Questions</p>
        </div>
        <Button>Grade All</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.submitted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.checked}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Submitted</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions */}
      <div className="space-y-3">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold">{submission.studentName}</h3>
                    <span className="text-sm text-gray-500">({submission.rollNo})</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      submission.status === 'checked' ? 'bg-blue-100 text-blue-700' :
                      submission.status === 'submitted' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {submission.status === 'checked' ? 'Checked' :
                       submission.status === 'submitted' ? 'Submitted' : 'Not Submitted'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="font-medium">{submission.submittedOn || 'N/A'}</p>
                    </div>
                    {submission.file && (
                      <div>
                        <p className="text-sm text-gray-500">Attachment</p>
                        <Button variant="link" className="p-0 h-auto">
                          <Download className="mr-2 h-4 w-4" />
                          {submission.file}
                        </Button>
                      </div>
                    )}
                  </div>

                  {submission.remarks && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Teacher's Remarks</p>
                      <p className="text-gray-700 dark:text-gray-300">{submission.remarks}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {submission.status === 'submitted' && (
                    <Button size="sm">Add Remarks</Button>
                  )}
                  {submission.status === 'checked' && (
                    <Button size="sm" variant="outline">Edit Remarks</Button>
                  )}
                  {submission.status === 'not-submitted' && (
                    <Button size="sm" variant="outline">Send Reminder</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
