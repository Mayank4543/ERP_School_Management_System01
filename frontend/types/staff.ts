export interface Staff {
    id: string;
    employeeId: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    designation: string;
    department: string;
    status: 'active' | 'inactive';
    joiningDate: string; // Always string for consistency
    profilePicture?: string;
    address?: string;
    qualification?: string;
    experience?: string;
    salary?: number;
    emergencyContact?: string;
    roles: string[];
    permissions: string[];
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface CreateStaffDto {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    designation: string;
    department?: string;
    joiningDate?: string; // Always string for date inputs
    profilePicture?: string;
    address?: string;
    qualification?: string;
    experience?: string;
    salary?: number;
    emergencyContact?: string;
}

export interface UpdateStaffDto {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    designation?: string;
    department?: string;
    status?: 'active' | 'inactive';
    profilePicture?: string;
    address?: string;
    qualification?: string;
    experience?: string;
    salary?: number;
    emergencyContact?: string;
}

export interface StaffAttendance {
    id: string;
    staffId: string;
    staffName: string;
    employeeId: string;
    department: string;
    designation: string;
    date: string;
    status: 'present' | 'absent' | 'on-leave';
    checkIn?: string;
    checkOut?: string;
    leaveType?: string;
    notes?: string;
}