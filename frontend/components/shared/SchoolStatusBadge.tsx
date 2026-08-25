import { CheckCircle, Clock, PauseCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type SchoolStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type SchoolStatusValue = SchoolStatus | boolean | undefined;

const statusLabels: Record<SchoolStatus, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    suspended: 'Suspended',
};

const statusStyles: Record<SchoolStatus, string> = {
    pending: 'border-yellow-200 bg-yellow-100 text-yellow-800',
    approved: 'border-green-200 bg-green-100 text-green-800',
    rejected: 'border-red-200 bg-red-100 text-red-800',
    suspended: 'border-gray-200 bg-gray-100 text-gray-800',
};

const statusIcons: Record<SchoolStatus, typeof Clock> = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
    suspended: PauseCircle,
};

export function normalizeSchoolStatus(status: SchoolStatusValue): SchoolStatus {
    if (typeof status === 'boolean') {
        return status ? 'approved' : 'pending';
    }

    return status || 'pending';
}

interface SchoolStatusBadgeProps {
    status: SchoolStatusValue;
    className?: string;
}

export function SchoolStatusBadge({ status, className }: SchoolStatusBadgeProps) {
    const normalizedStatus = normalizeSchoolStatus(status);
    const StatusIcon = statusIcons[normalizedStatus];

    return (
        <Badge className={`${statusStyles[normalizedStatus]} ${className || ''}`}>
            <StatusIcon className="h-3 w-3" />
            {statusLabels[normalizedStatus]}
        </Badge>
    );
}
