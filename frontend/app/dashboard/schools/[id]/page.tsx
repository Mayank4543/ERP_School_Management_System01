'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, Mail, MapPin, Phone, Users, GraduationCap, UserCheck, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { getSchoolById, type SchoolListItem } from '../api';
import { SchoolFormDialog } from '../components/SchoolFormDialog';
export default function SchoolDetailPage() {
    const params = useParams();
    const router = useRouter();

    const [school, setSchool] = useState<SchoolListItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);


    useEffect(() => {
        const id = params?.id;
        if (!id) return;

        fetchSchool(id as string);
    }, [params?.id]);



    const fetchSchool = async (schoolId: string) => {
        try {
            setLoading(true);
            const data = await getSchoolById(schoolId);
            setSchool(data);
        } catch (error) {
            console.error('Failed to load school details:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to load school details');
            router.push('/dashboard/schools');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date?: string) => {
        if (!date) return 'N/A';

        const value = new Date(date);
        if (Number.isNaN(value.getTime())) return 'N/A';

        return value.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };



    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-64 animate-pulse rounded bg-gray-200" />
            </div>
        );
    }

    if (!school) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-gray-500">School not found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => router.back()} className="px-0 text-gray-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm font-medium uppercase tracking-wide text-purple-600">School profile</p>
                    <h1 className="text-3xl font-bold text-gray-900">{school.name}</h1>
                </div>
                <Button variant="outline" onClick={() => setEditOpen(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit School
                </Button>

            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Users</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-600">{school.user_count || 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">{school.student_count || 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Teachers</CardTitle>
                        <UserCheck className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-purple-600">{school.teacher_count || 0}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>School information</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <InfoRow
                                icon={<Building2 className="h-4 w-4 text-gray-500" />}
                                label="School"
                                value={school.name}
                            />

                            <InfoRow
                                icon={<Mail className="h-4 w-4 text-gray-500" />}
                                label="Email"
                                value={school.email}
                            />

                            <InfoRow
                                icon={<Phone className="h-4 w-4 text-gray-500" />}
                                label="Phone"
                                value={school.phone || 'Not provided'}
                            />

                            <InfoRow
                                icon={<MapPin className="h-4 w-4 text-gray-500" />}
                                label="Address"
                                value={school.address || 'Not provided'}
                            />
                        </div>

                        <div className="space-y-4">
                            <InfoRow
                                label="State"
                                value={school.state || 'Not provided'}
                            />

                            <InfoRow
                                label="City"
                                value={school.city || 'Not provided'}
                            />

                            <InfoRow
                                label="Pincode"
                                value={school.pincode || 'Not provided'}
                            />

                            <InfoRow
                                label="Board"
                                value={school.board || 'Not provided'}
                            />

                            <InfoRow
                                label="Website"
                                value={school.website || 'Not provided'}
                            />

                            <InfoRow
                                label="Created"
                                value={formatDate(school.createdAt)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/schools">Back to list</Link>
                </Button>
            </div>
            <SchoolFormDialog
                school={school}
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onUpdated={(updatedSchool) => {
                    setSchool(updatedSchool);
                    setEditOpen(false);
                }}
            />
        </div>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon?: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            {icon && <div className="mt-0.5">{icon}</div>}
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium text-gray-900">{value}</p>
            </div>
        </div>
    );
}

