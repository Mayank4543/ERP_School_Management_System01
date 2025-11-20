'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileEdit, Download, Upload, Search } from 'lucide-react';

export default function MarksEntryPage() {
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const students = [
    { id: '1', rollNo: '1001', name: 'Rahul Kumar', marks: '', total: 100 },
    { id: '2', rollNo: '1002', name: 'Priya Sharma', marks: '', total: 100 },
    { id: '3', rollNo: '1003', name: 'Amit Patel', marks: '', total: 100 },
    { id: '4', rollNo: '1004', name: 'Sneha Reddy', marks: '', total: 100 },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marks Entry Table */}
      {selectedExam && selectedClass && selectedSubject && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Marks - Mathematics (Half Yearly Exam - Class 10-A)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Roll No</th>
                    <th className="text-left p-3">Student Name</th>
                    <th className="text-center p-3">Marks Obtained</th>
                    <th className="text-center p-3">Total Marks</th>
                    <th className="text-center p-3">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-3 font-medium">{student.rollNo}</td>
                      <td className="p-3">{student.name}</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          placeholder="Enter marks"
                          className="w-24 mx-auto"
                          min="0"
                          max={student.total}
                        />
                      </td>
                      <td className="p-3 text-center">{student.total}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">-</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">Save as Draft</Button>
              <Button>
                <FileEdit className="mr-2 h-4 w-4" />
                Submit Marks
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
