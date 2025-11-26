'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileEdit, Download, Upload, ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import examsService, { MarksEntryData } from '@/lib/api/services/exams.service';
import Link from 'next/link';

interface Student {
  _id: string;
  roll_no: string;
  admission_no: string;
  user_id: {
    first_name: string;
    last_name: string;
  };
  marks?: number;
  is_absent?: boolean;
  grade?: string;
}

interface ExamSubject {
  subject_id: string;
  subject_name: string;
  total_marks: number;
  passing_marks: number;
}

export default function ExamMarksEntryPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [examData, setExamData] = useState<any>(null);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [examSubjects, setExamSubjects] = useState<ExamSubject[]>([]);
  const [selectedExamSubject, setSelectedExamSubject] = useState<ExamSubject | null>(null);
  const [marksData, setMarksData] = useState<{ [studentId: string]: { marks: number, isAbsent: boolean } }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchExamDetails();
    }
  }, [params.id]);

  useEffect(() => {
    if (selectedStandard && selectedSubject) {
      fetchStudents();
      fetchExistingMarks();
    }
  }, [selectedStandard, selectedSubject]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      const exam = await examsService.getById(params.id as string);
      setExamData(exam);

      // Extract subjects from exam data
      if (exam.subjects && Array.isArray(exam.subjects)) {
        setExamSubjects(exam.subjects.map((sub: any) => ({
          subject_id: sub.subject_id,
          subject_name: sub.subject_name,
          total_marks: sub.total_marks,
          passing_marks: sub.passing_marks,
        })));
      } else {
        // Fallback to mock subjects
        const mockSubjects: ExamSubject[] = [
          { subject_id: '1', subject_name: 'Mathematics', total_marks: 100, passing_marks: 40 },
          { subject_id: '2', subject_name: 'Physics', total_marks: 100, passing_marks: 40 },
          { subject_id: '3', subject_name: 'Chemistry', total_marks: 100, passing_marks: 40 },
          { subject_id: '4', subject_name: 'Biology', total_marks: 100, passing_marks: 40 },
          { subject_id: '5', subject_name: 'English', total_marks: 100, passing_marks: 40 },
        ];
        setExamSubjects(mockSubjects);
      }
    } catch (error) {
      console.error('Error fetching exam details:', error);
      toast.error('Failed to fetch exam details');
      router.push('/dashboard/exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      // Mock students data - replace with actual API call
      const mockStudents: Student[] = [
        {
          _id: '1',
          roll_no: '1001',
          admission_no: 'ADM001',
          user_id: { first_name: 'Rahul', last_name: 'Kumar' }
        },
        {
          _id: '2',
          roll_no: '1002',
          admission_no: 'ADM002',
          user_id: { first_name: 'Priya', last_name: 'Sharma' }
        },
        {
          _id: '3',
          roll_no: '1003',
          admission_no: 'ADM003',
          user_id: { first_name: 'Amit', last_name: 'Patel' }
        },
        {
          _id: '4',
          roll_no: '1004',
          admission_no: 'ADM004',
          user_id: { first_name: 'Sneha', last_name: 'Reddy' }
        },
      ];
      setStudents(mockStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    }
  };

  const fetchExistingMarks = async () => {
    // Fetch existing marks for this exam/subject/class combination
    try {
      console.log('Fetching existing marks...');
      // Implementation would go here
    } catch (error) {
      console.error('Error fetching existing marks:', error);
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    const subject = examSubjects.find(s => s.subject_id === subjectId);
    setSelectedExamSubject(subject || null);
    setMarksData({}); // Reset marks when subject changes
  };

  const updateMarks = (studentId: string, marks: number, isAbsent: boolean = false) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        marks: isAbsent ? 0 : marks,
        isAbsent
      }
    }));
  };

  const calculateGrade = (marks: number, totalMarks: number): string => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const handleSubmitMarks = async () => {
    if (!selectedExamSubject) return;

    try {
      setSubmitting(true);

      const marksToSubmit: MarksEntryData[] = students
        .filter(student => marksData[student._id])
        .map(student => ({
          exam_id: params.id as string,
          student_id: student._id,
          subject_id: selectedSubject,
          marks_obtained: marksData[student._id].marks,
          total_marks: selectedExamSubject.total_marks,
          grade: marksData[student._id].isAbsent ? 'AB' : calculateGrade(marksData[student._id].marks, selectedExamSubject.total_marks),
          remarks: marksData[student._id].isAbsent ? 'Absent' : '',
        }));

      for (const markData of marksToSubmit) {
        await examsService.enterMarks(markData);
      }

      toast.success('Marks submitted successfully!');
    } catch (error) {
      console.error('Error submitting marks:', error);
      toast.error('Failed to submit marks');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmitMarks = selectedSubject && students.some(student => marksData[student._id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/exams">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {examData?.name} - Marks Entry
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Enter student marks for the exam</p>
        </div>
      </div>

      {/* Exam Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Exam Information</CardTitle>
            <Badge variant="outline">{examData?.exam_type}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-500">Start Date</p>
              <p>{examData?.start_date ? new Date(examData.start_date).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">End Date</p>
              <p>{examData?.end_date ? new Date(examData.end_date).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Status</p>
              <Badge variant="secondary">{examData?.status || 'Scheduled'}</Badge>
            </div>
            <div>
              <p className="font-medium text-gray-500">Subjects</p>
              <p>{examSubjects.length} subjects</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class and Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Standard</label>
              <Select value={selectedStandard} onValueChange={setSelectedStandard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select standard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Class 10</SelectItem>
                  <SelectItem value="9">Class 9</SelectItem>
                  <SelectItem value="8">Class 8</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {examSubjects.map(subject => (
                    <SelectItem key={subject.subject_id} value={subject.subject_id}>
                      {subject.subject_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marks Entry */}
      {selectedStandard && selectedSubject && selectedExamSubject && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {selectedExamSubject.subject_name} - Class {selectedStandard}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Total Marks: {selectedExamSubject.total_marks} | Passing Marks: {selectedExamSubject.passing_marks}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Template
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-800">
                    <th className="text-left p-3">Roll No</th>
                    <th className="text-left p-3">Student Name</th>
                    <th className="text-center p-3">Marks Obtained</th>
                    <th className="text-center p-3">Total Marks</th>
                    <th className="text-center p-3">Grade</th>
                    <th className="text-center p-3">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const studentMarks = marksData[student._id];
                    const marks = studentMarks?.marks || 0;
                    const isAbsent = studentMarks?.isAbsent || false;
                    const grade = isAbsent ? 'AB' : calculateGrade(marks, selectedExamSubject.total_marks);

                    return (
                      <tr key={student._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-3 font-medium">{student.roll_no}</td>
                        <td className="p-3">
                          {student.user_id.first_name} {student.user_id.last_name}
                        </td>
                        <td className="p-3 text-center">
                          <Input
                            type="number"
                            placeholder="0"
                            className="w-20 mx-auto"
                            min="0"
                            max={selectedExamSubject.total_marks}
                            value={isAbsent ? '' : marks || ''}
                            onChange={(e) => updateMarks(student._id, parseInt(e.target.value) || 0, isAbsent)}
                            disabled={isAbsent}
                          />
                        </td>
                        <td className="p-3 text-center font-medium">{selectedExamSubject.total_marks}</td>
                        <td className="p-3 text-center">
                          <Badge
                            variant={
                              grade === 'A+' || grade === 'A' ? 'default' :
                                grade === 'B+' || grade === 'B' ? 'secondary' :
                                  grade === 'AB' ? 'outline' : 'destructive'
                            }
                          >
                            {grade || '-'}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Checkbox
                            checked={isAbsent}
                            onCheckedChange={(checked) => {
                              updateMarks(student._id, 0, checked as boolean);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" disabled={!canSubmitMarks}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button
                onClick={handleSubmitMarks}
                disabled={!canSubmitMarks || submitting}
              >
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileEdit className="mr-2 h-4 w-4" />
                )}
                {submitting ? 'Submitting...' : 'Submit Marks'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedStandard || !selectedSubject ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileEdit className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Select Class and Subject</p>
            <p className="text-gray-400 text-sm">Choose a standard and subject to start entering marks.</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}