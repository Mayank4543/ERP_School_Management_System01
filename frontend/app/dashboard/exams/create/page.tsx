'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import examsService, { CreateExamData } from '@/lib/api/services/exams.service';
import sectionsService from '@/lib/api/services/sections.service';
import Link from 'next/link';

interface ExamSubject {
  subject_id: string;
  subject_name: string;
  date: string;
  start_time: string;
  end_time: string;
  total_marks: number;
  passing_marks: number;
}

export default function CreateExamPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingStandards, setLoadingStandards] = useState(false);
  const [availableStandards, setAvailableStandards] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    exam_type: '',
    start_date: '',
    end_date: '',
    description: '',
    standard: 0, // Changed to single standard instead of array
  });
  const [subjects, setSubjects] = useState<ExamSubject[]>([]);

  const examTypes = [
    { value: 'midterm', label: 'Mid-Term' },
    { value: 'final', label: 'Final' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'half-yearly', label: 'Half-Yearly' },
    { value: 'annual', label: 'Annual' },
    { value: 'other', label: 'Other' },
  ];

  const predefinedSubjects = [
    { id: '1', name: 'Mathematics' },
    { id: '2', name: 'Physics' },
    { id: '3', name: 'Chemistry' },
    { id: '4', name: 'Biology' },
    { id: '5', name: 'English' },
    { id: '6', name: 'Hindi' },
    { id: '7', name: 'History' },
    { id: '8', name: 'Geography' },
    { id: '9', name: 'Computer Science' },
    { id: '10', name: 'Physical Education' },
  ];

  // Fetch available standards on component mount
  useEffect(() => {
    const fetchStandards = async () => {
      try {
        setLoadingStandards(true);
        console.log('🔍 [EXAM CREATE] Fetching available standards...');

        // Using current academic year for now - should be dynamic in production
        const standards = await sectionsService.getUniqueStandards('674b8b4c7b8fbbbed64b5ef4');

        console.log('📚 [EXAM CREATE] Available standards:', standards);
        setAvailableStandards(standards);
      } catch (error) {
        console.error('❌ [EXAM CREATE] Error fetching standards:', error);
        toast.error('Failed to fetch available standards');
      } finally {
        setLoadingStandards(false);
      }
    };

    fetchStandards();
  }, []);

  const addSubject = () => {
    setSubjects([...subjects, {
      subject_id: '',
      subject_name: '',
      date: '',
      start_time: '09:00',
      end_time: '12:00',
      total_marks: 100,
      passing_marks: 40,
    }]);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index: number, field: keyof ExamSubject, value: any) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };

    if (field === 'subject_id') {
      const selectedSubject = predefinedSubjects.find(s => s.id === value);
      if (selectedSubject) {
        updated[index].subject_name = selectedSubject.name;
      }
    }

    setSubjects(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.school_id) {
      toast.error('School ID not found');
      return;
    }

    if (subjects.length === 0) {
      toast.error('Please add at least one subject');
      return;
    }

    if (!formData.standard || formData.standard === 0) {
      toast.error('Please select a standard/class');
      return;
    }

    try {
      setLoading(true);

      const examData: CreateExamData = {
        ...formData,
        school_id: user.school_id,
        academic_year_id: '674b8b4c7b8fbbbed64b5ef4', // Current academic year - should be dynamic in production
        standard: formData.standard,
        subjects,
      };

      console.log('Creating exam with data:', examData);
      const result = await examsService.create(examData);
      console.log('Exam creation result:', result);

      toast.success('Exam created successfully!');
      router.push('/dashboard/exams');
    } catch (error) {
      console.error('Error creating exam:', error);
      toast.error('Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Exam</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Set up a new examination with subjects and schedule</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Exam Name *</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Half Yearly Exam 2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam_type">Exam Type *</Label>
                <Select value={formData.exam_type} onValueChange={(value) => setFormData({ ...formData, exam_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="standard">Standard/Class *</Label>
              <Select
                value={formData.standard.toString()}
                onValueChange={(value) => setFormData({ ...formData, standard: parseInt(value) })}
                disabled={loadingStandards}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingStandards ? "Loading standards..." : "Select standard/class"} />
                </SelectTrigger>
                <SelectContent>
                  {availableStandards.map(standard => (
                    <SelectItem key={standard} value={standard.toString()}>
                      Class {standard}
                    </SelectItem>
                  ))}
                  {!loadingStandards && availableStandards.length === 0 && (
                    <SelectItem value="" disabled>
                      No standards available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {!loadingStandards && availableStandards.length === 0 && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  No standards found. Please create sections first in the Classes section.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description for the exam"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Subjects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Exam Subjects</CardTitle>
              <Button type="button" onClick={addSubject} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {subjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No subjects added yet. Click "Add Subject" to start.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {subjects.map((subject, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Subject {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSubject(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Subject *</Label>
                        <Select
                          value={subject.subject_id}
                          onValueChange={(value) => updateSubject(index, 'subject_id', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {predefinedSubjects.map(subj => (
                              <SelectItem key={subj.id} value={subj.id}>{subj.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Exam Date *</Label>
                        <Input
                          type="date"
                          value={subject.date}
                          onChange={(e) => updateSubject(index, 'date', e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={subject.start_time}
                            onChange={(e) => updateSubject(index, 'start_time', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={subject.end_time}
                            onChange={(e) => updateSubject(index, 'end_time', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Total Marks *</Label>
                        <Input
                          type="number"
                          value={subject.total_marks}
                          onChange={(e) => updateSubject(index, 'total_marks', parseInt(e.target.value))}
                          min="1"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Passing Marks *</Label>
                        <Input
                          type="number"
                          value={subject.passing_marks}
                          onChange={(e) => updateSubject(index, 'passing_marks', parseInt(e.target.value))}
                          min="1"
                          max={subject.total_marks}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/exams">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Exam'}
          </Button>
        </div>
      </form>
    </div>
  );
}