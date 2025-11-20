import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get default avatar path based on user role
 */
export function getDefaultAvatar(role?: string): string {
  const roleMap: Record<string, string> = {
    'admin': '/avatars/default-admin.svg',
    'administrator': '/avatars/default-admin.svg',
    'super_admin': '/avatars/default-admin.svg',
    'superadmin': '/avatars/default-admin.svg',
    'teacher': '/avatars/default-teacher.svg',
    'instructor': '/avatars/default-teacher.svg',
    'student': '/avatars/default-student.svg',
    'pupil': '/avatars/default-student.svg',
  };
  
  const normalizedRole = role?.toLowerCase().replace(/[\s-_]/g, '') || 'user';
  return roleMap[normalizedRole] || '/avatars/default-user.svg';
}
