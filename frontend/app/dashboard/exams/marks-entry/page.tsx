'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileEdit, Download, Upload, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import examsService, { MarksEntryData } from '@/lib/api/services/exams.service';

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

export default function MarksEntryPage() {
  const { user } = useAuth();
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [exams, setExams] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [examSubjects, setExamSubjects] = useState<ExamSubject[]>([]);
  const [selectedExamSubject, setSelectedExamSubject] = useState<ExamSubject | null>(null);
  const [marksData, setMarksData] = useState<{ [studentId: string]: { marks: number, isAbsent: boolean } }>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExams();
  }, [user?.school_id]);

  useEffect(() => {
    if (selectedExam && selectedStandard && selectedSubject) {
      fetchStudents();
      fetchExistingMarks();
    }
  }, [selectedExam, selectedStandard, selectedSubject]);

  const fetchExams = async () => {
    if (!user?.school_id) return;

    try {
      setLoading(true);
      const data = await examsService.getAll({
        schoolId: user.school_id,
        page: 1,
        limit: 50,
      });
      setExams(data.data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    if (!user?.school_id || !selectedStandard) return;

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingMarks = async () => {
    // Fetch existing marks for this exam/subject/class combination
    // This would be implemented based on your API structure
    try {
      // Mock implementation
      console.log('Fetching existing marks...');
    } catch (error) {
      console.error('Error fetching existing marks:', error);
    }
  };

  const handleExamChange = (examId: string) => {
    setSelectedExam(examId);
    setSelectedStandard('');
    setSelectedSubject('');

    const exam = exams.find(e => e._id === examId);
    if (exam) {
      // Mock exam subjects - replace with actual data from exam
      const mockSubjects: ExamSubject[] = [
        { subject_id: '1', subject_name: 'Mathematics', total_marks: 100, passing_marks: 40 },
        { subject_id: '2', subject_name: 'Physics', total_marks: 100, passing_marks: 40 },
        { subject_id: '3', subject_name: 'Chemistry', total_marks: 100, passing_marks: 40 },
        { subject_id: '4', subject_name: 'Biology', total_marks: 100, passing_marks: 40 },
        { subject_id: '5', subject_name: 'English', total_marks: 100, passing_marks: 40 },
      ];
      setExamSubjects(mockSubjects);
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    const subject = examSubjects.find(s => s.subject_id === subjectId);
    setSelectedExamSubject(subject || null);
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
          exam_id: selectedExam,
          student_id: student._id,
          subject_id: selectedSubject,
          marks_obtained: marksData[student._id].marks,
          total_marks: selectedExamSubject.total_marks,
          grade: marksData[student._id].isAbsent ? 'AB' : calculateGrade(marksData[student._id].marks, selectedExamSubject.total_marks),
          remarks: marksData[student._id].isAbsent ? 'Absent' : '',
        }));

      // Submit marks one by one or in batch
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

  const canSubmitMarks = selectedExam && selectedStandard && selectedSubject &&
    students.some(student => marksData[student._id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marks Entry</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Enter exam marks for students</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Excel
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Template
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Select Exam Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Exam</label>
              <Select value={selectedExam} onValueChange={handleExamChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map(exam => (
                    <SelectItem key={exam._id} value={exam._id}>{exam.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => selectedExam && selectedStandard && selectedSubject && fetchStudents()}
              >
                <Search className="mr-2 h-4 w-4" />
                Load Students
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marks Entry Table */}
      {selectedExam && selectedStandard && selectedSubject && selectedExamSubject && (
        <Card>
          <CardHeader>
            <CardTitle>
              Enter Marks - {selectedExamSubject.subject_name}
              <span className="text-sm font-normal text-gray-500 ml-2">
                (Total: {selectedExamSubject.total_marks}, Passing: {selectedExamSubject.passing_marks})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <>
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
                                placeholder="Enter marks"
                                className="w-24 mx-auto"
                                min="0"
                                max={selectedExamSubject.total_marks}
                                value={isAbsent ? '' : marks || ''}
                                onChange={(e) => updateMarks(student._id, parseInt(e.target.value) || 0, isAbsent)}
                                disabled={isAbsent}
                              />
                            </td>
                            <td className="p-3 text-center font-medium">{selectedExamSubject.total_marks}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${grade === 'A+' || grade === 'A' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' :
                                  grade === 'B+' || grade === 'B' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200' :
                                    grade === 'C' || grade === 'D' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200' :
                                      grade === 'AB' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200' :
                                        'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
                                }`}>
                                {grade || '-'}
                              </span>
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
                    Save as Draft
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
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
