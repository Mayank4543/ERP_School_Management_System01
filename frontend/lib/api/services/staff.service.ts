import apiClient from '../client';
import { Staff, CreateStaffDto, UpdateStaffDto } from '@/types';

export interface StaffFilters {
    search?: string;
    department?: string;
    designation?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export interface StaffResponse {
    success: boolean;
    data: Staff[];
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface StaffStats {
    totalStaff: number;
    present: number;
    absent: number;
    onLeave: number;
    activeStaff: number;
    inactiveStaff: number;
}

class StaffService {
    private readonly endpoint = '/users';

    // Get all staff members with filters
    async getAll(filters: StaffFilters = {}): Promise<StaffResponse> {
        try {
            // Build query parameters
            const params = new URLSearchParams();

            if (filters.search) {
                params.append('search', filters.search);
            }

            if (filters.page) {
                params.append('page', filters.page.toString());
            }

            if (filters.limit) {
                params.append('limit', filters.limit.toString());
            }

            console.log('🔍 Fetching users from backend...');
            const response = await apiClient.get(`${this.endpoint}?${params.toString()}`);
            console.log('📊 Raw API response:', response.data);

            // Filter the response to only include staff roles on frontend side
            // since the backend doesn't have role-based filtering built-in
            const allUsers = response.data.data || response.data || [];
            console.log('👥 All users received:', allUsers.length);

            if (allUsers.length > 0) {
                console.log('👤 Sample user structure:', allUsers[0]);
            }

            const staffRoles = ['admin', 'librarian', 'accountant', 'receptionist'];

            let filteredUsers = allUsers.filter((user: any) => {
                const userRole = user.usergroup_id?.toLowerCase();
                const isStaff = staffRoles.includes(userRole);
                if (isStaff) {
                    console.log(`✅ Found staff member: ${user.name} (${userRole})`);
                }
                return isStaff;
            });

            console.log(`🎯 Filtered staff members: ${filteredUsers.length} out of ${allUsers.length} total users`);

            // Apply frontend filters
            if (filters.department && filters.department !== 'all') {
                filteredUsers = filteredUsers.filter((user: any) =>
                    this.getUserDepartment(user.usergroup_id) === filters.department
                );
                console.log(`🏢 After department filter (${filters.department}): ${filteredUsers.length}`);
            }

            if (filters.designation && filters.designation !== 'all') {
                filteredUsers = filteredUsers.filter((user: any) =>
                    this.getUserDesignation(user.usergroup_id) === filters.designation
                );
                console.log(`💼 After designation filter (${filters.designation}): ${filteredUsers.length}`);
            }

            if (filters.status && filters.status !== 'all') {
                filteredUsers = filteredUsers.filter((user: any) =>
                    (filters.status === 'active' ? user.is_activated : !user.is_activated)
                );
                console.log(`📊 After status filter (${filters.status}): ${filteredUsers.length}`);
            }

            // Transform the filtered data
            const transformedData = filteredUsers.map((user: any) => {
                const staffMember = this.transformUserToStaff(user);
                console.log(`🔄 Transformed user ${user.name} to staff:`, staffMember);
                return staffMember;
            });

            console.log('✅ Final staff data:', transformedData);

            return {
                success: response.data.success !== false,
                data: transformedData,
                meta: {
                    page: filters.page || 1,
                    limit: filters.limit || 20,
                    total: transformedData.length,
                    totalPages: Math.ceil(transformedData.length / (filters.limit || 20))
                }
            };
        } catch (error) {
            console.error('❌ Error fetching staff:', error);
            console.error('📍 Error details:', error.response?.data);
            throw error;
        }
    }

    // Get staff member by ID
    async getById(id: string): Promise<Staff> {
        try {
            const response = await apiClient.get(`${this.endpoint}/${id}`);
            return this.transformUserToStaff(response.data.data);
        } catch (error) {
            console.error('Error fetching staff member:', error);
            throw error;
        }
    }

    // Create new staff member
    async create(data: CreateStaffDto): Promise<Staff> {
        try {
            // First, create the user record
            const userData = {
                name: data.name,
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                password: data.password,
                mobile_no: data.phone,
                usergroup_id: this.getDesignationRole(data.designation), // Map designation to role
                is_activated: true,
                roles: [this.getDesignationRole(data.designation)]
            };

            console.log('Creating user with data:', userData);
            const response = await apiClient.post(this.endpoint, userData);
            const createdUser = response.data.data;

            console.log('Created user:', createdUser);

            // Then create the user profile with additional staff information
            if (createdUser._id) {
                const profileData = {
                    school_id: createdUser.school_id,
                    firstname: data.firstName,
                    lastname: data.lastName,
                    gender: 'other', // Default value
                    address: data.address,
                    nationality: 'Indian', // Default value
                    profile_picture: data.profilePicture
                };

                console.log('Creating profile with data:', profileData);
                try {
                    await apiClient.post(`${this.endpoint}/${createdUser._id}/profile`, profileData);
                } catch (profileError) {
                    console.warn('Profile creation failed, but user was created:', profileError);
                }
            }

            // Fetch the complete user with profile to return
            const completeUser = await this.getById(createdUser._id);
            return completeUser;
        } catch (error) {
            console.error('Error creating staff member:', error);
            throw error;
        }
    }

    // Update staff member
    async update(id: string, data: UpdateStaffDto): Promise<Staff> {
        try {
            const userData = this.transformStaffToUser(data);
            const response = await apiClient.put(`${this.endpoint}/${id}`, userData);
            return this.transformUserToStaff(response.data.data);
        } catch (error) {
            console.error('Error updating staff member:', error);
            throw error;
        }
    }

    // Delete staff member
    async delete(id: string): Promise<void> {
        try {
            await apiClient.delete(`${this.endpoint}/${id}`);
        } catch (error) {
            console.error('Error deleting staff member:', error);
            throw error;
        }
    }

    // Get staff statistics
    async getStats(): Promise<StaffStats> {
        try {
            // Get all staff members for stats calculation
            const response = await this.getAll({ limit: 1000 });
            const staff = response.data;

            // Calculate stats from the data
            const totalStaff = staff.length;
            const activeStaff = staff.filter(s => s.status === 'active').length;
            const inactiveStaff = totalStaff - activeStaff;

            // For attendance stats, we'd need to call the attendance API
            // For now, using mock data similar to the attendance page
            const present = Math.floor(activeStaff * 0.9); // 90% present
            const absent = Math.floor(activeStaff * 0.05); // 5% absent
            const onLeave = activeStaff - present - absent;

            return {
                totalStaff,
                present,
                absent,
                onLeave,
                activeStaff,
                inactiveStaff
            };
        } catch (error) {
            console.error('Error fetching staff stats:', error);
            throw error;
        }
    }

    // Transform user data to staff format
    private transformUserToStaff(user: any): Staff {
        const profile = user.profile || {};

        return {
            id: user._id,
            employeeId: profile.employee_id || `EMP${user._id?.toString().slice(-6).toUpperCase()}` || user.email.split('@')[0].toUpperCase(),
            name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
            firstName: user.first_name || profile.firstname || '',
            lastName: user.last_name || profile.lastname || '',
            email: user.email,
            phone: user.mobile_no || profile.phone || '',
            designation: this.getUserDesignation(user.usergroup_id),
            department: profile.department || this.getUserDepartment(user.usergroup_id),
            status: user.is_activated ? 'active' : 'inactive',
            joiningDate: profile.joining_date || user.createdAt,
            profilePicture: user.profile_picture || profile.profile_picture,
            address: profile.address,
            qualification: profile.qualification,
            experience: profile.experience,
            salary: profile.salary,
            emergencyContact: profile.emergency_contact,
            roles: user.roles || [user.usergroup_id],
            permissions: user.permissions || [],
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    // Transform staff data to user format
    private transformStaffToUser(staff: Partial<CreateStaffDto | UpdateStaffDto>): any {
        const userData: any = {};

        if (staff.name) userData.name = staff.name;
        if (staff.firstName) userData.first_name = staff.firstName;
        if (staff.lastName) userData.last_name = staff.lastName;
        if (staff.email) userData.email = staff.email;
        if (staff.phone) userData.mobile_no = staff.phone;
        if (staff.designation) userData.usergroup_id = this.getDesignationRole(staff.designation);
        if ('status' in staff && staff.status !== undefined) userData.is_activated = staff.status === 'active';
        if (staff.profilePicture) userData.profile_picture = staff.profilePicture;

        // Handle password for new staff
        if ('password' in staff && staff.password) {
            userData.password = staff.password;
        }

        return userData;
    }

    // Map user roles to user-friendly designations
    private getUserDesignation(role: string): string {
        const designationMap: Record<string, string> = {
            'admin': 'Administrator',
            'librarian': 'Librarian',
            'accountant': 'Accountant',
            'receptionist': 'Receptionist',
            'office_staff': 'Office Staff',
            'security': 'Security Guard',
            'maintenance': 'Maintenance Staff',
            'nurse': 'School Nurse',
            'counselor': 'Counselor'
        };

        return designationMap[role.toLowerCase()] || role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Map user roles to departments
    private getUserDepartment(role: string): string {
        const departmentMap: Record<string, string> = {
            'admin': 'Administration',
            'librarian': 'Library',
            'accountant': 'Accounts',
            'receptionist': 'Front Office',
            'office_staff': 'Administration',
            'security': 'Security',
            'maintenance': 'Maintenance',
            'nurse': 'Medical',
            'counselor': 'Student Support'
        };

        return departmentMap[role.toLowerCase()] || 'Administration';
    }

    // Map designations back to user roles
    private getDesignationRole(designation: string): string {
        const roleMap: Record<string, string> = {
            'administrator': 'admin',
            'librarian': 'librarian',
            'accountant': 'accountant',
            'receptionist': 'receptionist',
            'office staff': 'admin', // Map to admin role
            'security guard': 'admin', // Map to admin role
            'maintenance staff': 'admin', // Map to admin role
            'school nurse': 'admin', // Map to admin role
            'counselor': 'admin' // Map to admin role
        };

        return roleMap[designation.toLowerCase()] || 'admin';
    }

    // Get available departments
    getDepartments(): string[] {
        return [
            'Administration',
            'Library',
            'Accounts',
            'Front Office',
            'Security',
            'Maintenance',
            'Medical',
            'Student Support'
        ];
    }

    // Get available designations
    getDesignations(): string[] {
        return [
            'Administrator',
            'Librarian',
            'Accountant',
            'Receptionist',
            'Office Staff',
            'Security Guard',
            'Maintenance Staff',
            'School Nurse',
            'Counselor'
        ];
    }
}

export const staffService = new StaffService();