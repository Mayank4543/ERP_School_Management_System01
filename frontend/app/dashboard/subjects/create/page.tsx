'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateSubjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: '',
    description: '',
    classes: [] as string[],
    teachers: [] as string[],
  });

  const classes = ['6', '7', '8', '9', '10', '11', '12'];
  const teachers = [
    { id: '1', name: 'Mr. Sharma' },
    { id: '2', name: 'Ms. Gupta' },
    { id: '3', name: 'Dr. Kumar' },
    { id: '4', name: 'Ms. Patel' },
  ];

  const handleClassToggle = (cls: string) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(cls)
        ? prev.classes.filter(c => c !== cls)
        : [...prev.classes, cls]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Subject created successfully');
      router.push('/dashboard/subjects');
    } catch (error) {
      toast.error('Failed to create subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Subject</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Add a new subject to the curriculum</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Subject Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Mathematics"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Subject Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g., MATH101"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Subject Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Core">Core Subject</SelectItem>
                  <SelectItem value="Elective">Elective</SelectItem>
                  <SelectItem value="Language">Language</SelectItem>
                  <SelectItem value="Activity">Co-curricular Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the subject..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Applicable to Classes *</Label>
              <div className="flex flex-wrap gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {classes.map((cls) => (
                  <div key={cls} className="flex items-center space-x-2">
                    <Checkbox
                      id={`class-${cls}`}
                      checked={formData.classes.includes(cls)}
                      onCheckedChange={() => handleClassToggle(cls)}
                    />
                    <label
                      htmlFor={`class-${cls}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Class {cls}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assign Teachers</Label>
              <div className="space-y-2">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`teacher-${teacher.id}`}
                      checked={formData.teachers.includes(teacher.id)}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          teachers: checked
                            ? [...prev.teachers, teacher.id]
                            : prev.teachers.filter(t => t !== teacher.id)
                        }));
                      }}
                    />
                    <label
                      htmlFor={`teacher-${teacher.id}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {teacher.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Creating...' : 'Create Subject'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
