import { type SchoolStatusValue } from '@/components/shared/SchoolStatusBadge';
import {
    superAdminSchoolService,
    type RejectSchoolPayload,
} from '@/lib/api/services/super-admin/school.service';

export interface SchoolApproval {
    _id: string;
    name: string;
    slug?: string;
    email?: string;
    phone?: string;
    board?: string;
    website?: string;
    state?: string;
    city?: string;
    pincode?: string;
    address?: string;
    status?: SchoolStatusValue;
    createdAt?: string;
    updatedAt?: string;
    rejection_reason?: string;
    rejected_at?: string;
    documents?: {
        license?: boolean;
        certificate?: boolean;
        identification?: boolean;
    };
}

export async function getSchoolApprovals(): Promise<SchoolApproval[]> {
    const response = await superAdminSchoolService.getPendingSchools();

    if (!response.success) {
        throw new Error(
            response.message || 'Failed to load pending schools'
        );
    }

    const schools = response.data?.schools;

    return Array.isArray(schools) ? schools : [];
}

export async function approveSchoolApproval(schoolId: string) {
    const response = await superAdminSchoolService.approveSchool(schoolId);

    if (!response.success) {
        throw new Error(response.message || 'Failed to approve school');
    }
    return response;
}

export async function rejectSchoolApproval(
    schoolId: string,
    payload: RejectSchoolPayload,
) {
    const response = await superAdminSchoolService.rejectSchool(schoolId, payload);

    if (!response.success) {
        throw new Error(response.message || 'Failed to reject school');
    }

    return response;
}
