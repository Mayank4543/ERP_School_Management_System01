import { superAdminSchoolService, type CreateSchoolPayload, type UpdateSchoolPayload } from '@/lib/api/services/super-admin/school.service';

export enum SchoolStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    SUSPENDED = 'suspended',
}

export interface SchoolListItem {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    state?: string;
    city?: string;
    pincode?: string;
    board?: string;
    website?: string;
    status: SchoolStatus;
    user_count?: number;
    student_count?: number;
    teacher_count?: number;
    createdAt?: string;
}

export async function getSchools(): Promise<SchoolListItem[]> {
    const response = await superAdminSchoolService.getAllSchools({ limit: 100 });

    if (response.success && response.data?.schools) {
        return (response.data.schools as Array<SchoolListItem & { status: SchoolStatus | boolean }>).map((school) => ({
            ...school,
            status: typeof school.status === 'boolean'
                ? school.status ? SchoolStatus.APPROVED : SchoolStatus.PENDING
                : school.status,
        }));
    }

    throw new Error(response.message || 'Failed to load schools');
}
export async function getSchoolById(schoolId: string): Promise<SchoolListItem> {
    const response = await superAdminSchoolService.getSchool(schoolId);
    if (response.success && response.data) {
        return response.data as SchoolListItem;
    }

    throw new Error(response.message || 'School not found');
}
export async function createSchool(data: CreateSchoolPayload): Promise<{ success: boolean; message?: string; data?: SchoolListItem }> {
    return superAdminSchoolService.createSchool(data);
}
export async function updateSchool(schoolId: string, data: Partial<UpdateSchoolPayload>): Promise<{ success: boolean; message?: string; data?: SchoolListItem }> {
    return superAdminSchoolService.updateSchool(schoolId, data);
}
export const deleteSchool = async (schoolId: string): Promise<{ success: boolean; message?: string }> => {
    return superAdminSchoolService.deleteSchool(schoolId);
}