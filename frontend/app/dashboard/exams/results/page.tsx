"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Printer,
  FileText,
  Loader2,
  Eye,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import examsService from "@/lib/api/services/exams.service";

interface StudentResult {
  _id: string;
  student_id: string;
  roll_no: string;
  name: string;
  subjects: {
    subject_name: string;
    marks_obtained: number;
    total_marks: number;
    grade: string;
    percentage: number;
  }[];
  total_marks: number;
  total_max_marks: number;
  overall_percentage: number;
  overall_grade: string;
  rank: number;
  status: "pass" | "fail";
}

export default function ResultsPage() {
  const { user } = useAuth();
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("");
  const [exams, setExams] = useState<any[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [selectedExamData, setSelectedExamData] = useState<any>(null);

  useEffect(() => {
    fetchExams();
  }, [user?.school_id]);

  useEffect(() => {
    if (selectedExam && selectedStandard) {
      fetchResults();
    }
  }, [selectedExam, selectedStandard]);

  const fetchExams = async () => {
    if (!user?.school_id) return;

    try {
      const data = await examsService.getAll({
        schoolId: user.school_id,
        page: 1,
        limit: 50,
      });
      setExams(data?.data || []);
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Failed to fetch exams");
    }
  };

  const fetchResults = async () => {
    if (!selectedExam || !selectedStandard) return;

    try {
      setLoading(true);
      const res = await examsService.getClassResults(
        selectedExam,
        parseInt(selectedStandard)
      );

      const data = Array.isArray(res) ? res : res?.data || [];

      const processedResults: StudentResult[] = data.map(
        (result: any, index: number) => {
          const totalMarks =
            result.subjects?.reduce(
              (sum: number, sub: any) => sum + sub.marks_obtained,
              0
            ) || 0;

          const totalMaxMarks =
            result.subjects?.reduce(
              (sum: number, sub: any) => sum + sub.total_marks,
              0
            ) || 0;

          const percentage =
            totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;

          const grade = calculateOverallGrade(percentage);

          return {
            _id: result._id,
            student_id: result.student_id || result._id,
            roll_no: result.roll_no || `R${index + 1}`,
            name: result.name || `Student ${index + 1}`,
            subjects: result.subjects || [],
            total_marks: totalMarks,
            total_max_marks: totalMaxMarks,
            overall_percentage: percentage,
            overall_grade: grade,
            rank: index + 1,
            status: percentage >= 40 ? "pass" : "fail",
          };
        }
      );

      processedResults.sort(
        (a, b) => b.overall_percentage - a.overall_percentage
      );
      processedResults.forEach((result, index) => {
        result.rank = index + 1;
      });

      setResults(processedResults);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Failed to fetch results");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallGrade = (percentage: number): string => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  const handleExamChange = (examId: string) => {
    setSelectedExam(examId);
    const exam = exams?.find((e) => e._id === examId);
    setSelectedExamData(exam || null);
    setSelectedStandard("");
    setResults([]);
  };

  const handlePublishResults = async () => {
    if (!selectedExam) return;

    try {
      setPublishing(true);
      await examsService.publishResults(selectedExam);
      toast.success("Results published successfully!");

      setSelectedExamData((prev: any) => ({ ...prev, is_published: true }));
    } catch (error) {
      console.error("Error publishing results:", error);
      toast.error("Failed to publish results");
    } finally {
      setPublishing(false);
    }
  };

  const handleExportResults = async () => {
    if (!selectedExam) return;

    try {
      const blob = await examsService.exportResults(selectedExam);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${selectedExamData?.name || "exam"}_results.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Results exported successfully!");
    } catch (error) {
      console.error("Error exporting results:", error);
      toast.error("Failed to export results");
    }
  };

  // FIXED placement (must be above return)
  const getSubjectColumns = () => {
    if (!results.length) return [];
    return results[0]?.subjects?.map((subject) => subject.subject_name) || [];
  };

  const stats = {
    totalStudents: results.length,
    passedStudents: results.filter((r) => r.status === "pass").length,
    failedStudents: results.filter((r) => r.status === "fail").length,
    averagePercentage:
      results.length > 0
        ? (
          results.reduce((sum, r) => sum + r.overall_percentage, 0) /
          results.length
        ).toFixed(1)
        : "0",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Exam Results
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View and publish exam results
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportResults}
            disabled={!selectedExam || results.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>

          <Button variant="outline" disabled={!selectedExam || results.length === 0}>
            <Printer className="mr-2 h-4 w-4" />
            Print All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Select Exam & Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exam Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Exam</label>
              <Select value={selectedExam} onValueChange={handleExamChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam._id} value={exam._id}>
                      <div className="flex items-center gap-2">
                        {exam.name}
                        {exam.is_published && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Published
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Standard */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Standard</label>
              <Select
                value={selectedStandard}
                onValueChange={setSelectedStandard}
              >
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
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">
                {stats.passedStudents}
              </div>
              <p className="text-xs text-muted-foreground">Passed</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600">
                {stats.failedStudents}
              </div>
              <p className="text-xs text-muted-foreground">Failed</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">
                {stats.averagePercentage}%
              </div>
              <p className="text-xs text-muted-foreground">Class Average</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Table */}
      {selectedExam && selectedStandard && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {selectedExamData?.name || "Exam"} Results - Class{" "}
                  {selectedStandard}
                  {selectedExamData?.is_published && (
                    <Badge variant="secondary" className="ml-2">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Published
                    </Badge>
                  )}
                </CardTitle>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handlePublishResults}
                  disabled={
                    publishing ||
                    selectedExamData?.is_published ||
                    results.length === 0
                  }
                  size="sm"
                >
                  {publishing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : selectedExamData?.is_published ? (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  ) : (
                    <Eye className="mr-2 h-4 w-4" />
                  )}
                  {publishing
                    ? "Publishing..."
                    : selectedExamData?.is_published
                      ? "Published"
                      : "Publish Results"}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 dark:bg-gray-800">
                      <th className="text-left p-3">Rank</th>
                      <th className="text-left p-3">Roll No</th>
                      <th className="text-left p-3">Name</th>

                      {getSubjectColumns().map((subject) => (
                        <th key={subject} className="text-center p-3">
                          {subject}
                        </th>
                      ))}

                      <th className="text-center p-3">Total</th>
                      <th className="text-center p-3">%</th>
                      <th className="text-center p-3">Grade</th>
                      <th className="text-center p-3">Status</th>
                      <th className="text-center p-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((result) => (
                      <tr
                        key={result._id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="p-3 font-bold text-blue-600">
                          {result.rank}
                        </td>

                        <td className="p-3 font-medium">{result.roll_no}</td>

                        <td className="p-3">{result.name}</td>

                        {result.subjects?.map((subject, index) => (
                          <td key={index} className="p-3 text-center">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {subject.marks_obtained}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({subject.grade})
                              </span>
                            </div>
                          </td>
                        ))}

                        <td className="p-3 text-center font-bold">
                          {result.total_marks}/{result.total_max_marks}
                        </td>

                        <td className="p-3 text-center font-bold text-green-600">
                          {result.overall_percentage.toFixed(1)}%
                        </td>

                        <td className="p-3 text-center">
                          <Badge
                            variant={
                              result.overall_grade === "A+" ||
                                result.overall_grade === "A"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              result.overall_grade === "A+" ||
                                result.overall_grade === "A"
                                ? "bg-green-100 text-green-700"
                                : ""
                            }
                          >
                            {result.overall_grade}
                          </Badge>
                        </td>

                        <td className="p-3 text-center">
                          <Badge
                            variant={
                              result.status === "pass"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {result.status.toUpperCase()}
                          </Badge>
                        </td>

                        <td className="p-3 text-center">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-1 h-3 w-3" />
                            Marksheet
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No results available. Make sure marks have been entered.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
