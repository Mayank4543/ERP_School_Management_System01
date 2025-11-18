'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Printer, FileText } from 'lucide-react';

export default function ResultsPage() {
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const results = [
    { rollNo: '1001', name: 'Rahul Kumar', math: 85, physics: 78, chemistry: 82, biology: 88, english: 90, total: 423, percentage: 84.6, grade: 'A', rank: 3 },
    { rollNo: '1002', name: 'Priya Sharma', math: 92, physics: 88, chemistry: 90, biology: 85, english: 95, total: 450, percentage: 90.0, grade: 'A+', rank: 1 },
    { rollNo: '1003', name: 'Amit Patel', math: 78, physics: 82, chemistry: 75, biology: 80, english: 85, total: 400, percentage: 80.0, grade: 'A', rank: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exam Results</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and publish exam results</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print All
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Excel
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Exam</label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="half-yearly">Half Yearly Exam</SelectItem>
                  <SelectItem value="terminal-1">First Terminal</SelectItem>
                  <SelectItem value="annual">Annual Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10-a">Class 10-A</SelectItem>
                  <SelectItem value="10-b">Class 10-B</SelectItem>
                  <SelectItem value="9-a">Class 9-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      {selectedExam && selectedClass && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Half Yearly Exam Results - Class 10-A</CardTitle>
              <Button>Publish Results</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-800">
                    <th className="text-left p-3">Rank</th>
                    <th className="text-left p-3">Roll No</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-center p-3">Math</th>
                    <th className="text-center p-3">Physics</th>
                    <th className="text-center p-3">Chemistry</th>
                    <th className="text-center p-3">Biology</th>
                    <th className="text-center p-3">English</th>
                    <th className="text-center p-3">Total</th>
                    <th className="text-center p-3">%</th>
                    <th className="text-center p-3">Grade</th>
                    <th className="text-center p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.rollNo} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-3 font-bold text-blue-600">{result.rank}</td>
                      <td className="p-3 font-medium">{result.rollNo}</td>
                      <td className="p-3">{result.name}</td>
                      <td className="p-3 text-center">{result.math}</td>
                      <td className="p-3 text-center">{result.physics}</td>
                      <td className="p-3 text-center">{result.chemistry}</td>
                      <td className="p-3 text-center">{result.biology}</td>
                      <td className="p-3 text-center">{result.english}</td>
                      <td className="p-3 text-center font-bold">{result.total}</td>
                      <td className="p-3 text-center font-bold text-green-600">{result.percentage}%</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          result.grade === 'A+' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {result.grade}
                        </span>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
