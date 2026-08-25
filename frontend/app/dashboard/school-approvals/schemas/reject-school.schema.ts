import { z } from 'zod';

export const RejectSchoolSchema = z.object({
    reason: z
        .string()
        .trim()
        .min(3, 'Rejection reason must be at least 3 characters')
        .max(500, 'Rejection reason cannot exceed 500 characters'),
});

export type RejectSchoolFormValues = z.infer<typeof RejectSchoolSchema>;
