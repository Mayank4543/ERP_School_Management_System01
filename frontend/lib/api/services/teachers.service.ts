import apiClient from '../client';
import { Teacher } from '@/types';

export interface TeacherFilters {
  schoolId: string;
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  subject?: string;
  status?: 'active' | 'inactive';
}

export interface TeacherResponse {
  success: boolean;
  data: Teacher[];
  page: number;
  total: number;
  totalPages: number;
}

const teachersService = {
  /**
   * Get all teachers
   */
  async getAll(filters: TeacherFilters): Promise<TeacherResponse> {
    const response = await apiClient.get('/teachers', {
      params: {
        school_id: filters.schoolId,
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...(filters.search && { search: filters.search }),
        ...(filters.department && { department: filters.department }),
        ...(filters.subject && { subject: filters.subject }),
        ...(filters.status && { status: filters.status }),
      },
    });
    
    // Transform the backend data to match our frontend Teacher interface
    const transformedData = response.data.data.map((teacher: any) => {
      const nameParts = teacher.user_id?.name?.split(' ') || [];
      return {
        ...teacher,
        // Store the user_id for future reference
        user_id: teacher.user_id?._id || teacher.user_id,
        // Extract user information if populated
        first_name: nameParts[0] || '',
        middle_name: nameParts[1] || '',
        last_name: nameParts.slice(2).join(' ') || (nameParts.length === 2 ? nameParts[1] : ''),
        email: teacher.user_id?.email || '',
        phone: teacher.user_id?.mobile_no || '',
        // Extract profile information if available
        gender: teacher.user_id?.profile?.gender || '',
        date_of_birth: teacher.user_id?.profile?.date_of_birth || '',
        blood_group: teacher.user_id?.profile?.blood_group || '',
        address: teacher.user_id?.profile?.address || '',
        city: teacher.user_id?.profile?.city || '',
        state: teacher.user_id?.profile?.state || '',
        country: teacher.user_id?.profile?.country || '',
        pincode: teacher.user_id?.profile?.pincode || '',
        // Map other fields as needed
        is_active: teacher.status === 'active',
      };
    });

    return {
      success: response.data.success || true,
      data: transformedData,
      page: response.data.page || filters.page || 1,
      total: response.data.total || 0,
      totalPages: response.data.totalPages || 0,
    };
  },

  /**
   * Get teacher by ID
   */
  async getById(id: string): Promise<Teacher> {
    const response = await apiClient.get(`/teachers/${id}`);
    const teacher = response.data.data;
    
    // Transform the backend data to match our frontend Teacher interface
    const nameParts = teacher.user_id?.name?.split(' ') || [];
    return {
      ...teacher,
      // Store the user_id for future reference
      user_id: teacher.user_id?._id || teacher.user_id,
      // Extract user information if populated
      first_name: nameParts[0] || '',
      middle_name: nameParts[1] || '',
      last_name: nameParts.slice(2).join(' ') || (nameParts.length === 2 ? nameParts[1] : ''),
      email: teacher.user_id?.email || '',
      phone: teacher.user_id?.mobile_no || '',
      // Extract profile information if available
      gender: teacher.user_id?.profile?.gender || '',
      date_of_birth: teacher.user_id?.profile?.date_of_birth || '',
      blood_group: teacher.user_id?.profile?.blood_group || '',
      address: teacher.user_id?.profile?.address || '',
      city: teacher.user_id?.profile?.city || '',
      state: teacher.user_id?.profile?.state || '',
      country: teacher.user_id?.profile?.country || '',
      pincode: teacher.user_id?.profile?.pincode || '',
      // Map other fields
      is_active: teacher.status === 'active',
    };
  },

  /**
   * Get teacher by employee ID
   */
  async getByEmployeeId(employeeId: string): Promise<Teacher> {
    const response = await apiClient.get(`/teachers/employee/${employeeId}`);
    return response.data.data;
  },

  /**
   * Create new teacher
   */
  async create(data: Partial<Teacher>): Promise<Teacher> {
    // First create the user account
    const userData = {
      name: `${data.first_name} ${data.middle_name ? data.middle_name + ' ' : ''}${data.last_name}`,
      email: data.email,
      password: 'Teacher@123', // Default password - should be changed on first login
      mobile_no: data.phone,
      usergroup_id: 'teacher',
      school_id: data.school_id,
      is_activated: true,
    };

    const userResponse = await apiClient.post('/users', userData);
    const user = userResponse.data.data;

    // Create user profile with additional personal information
    const profileData = {
      first_name: data.first_name,
      middle_name: data.middle_name || '',
      last_name: data.last_name,
      gender: data.gender,
      date_of_birth: data.date_of_birth,
      blood_group: data.blood_group,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
    };

    await apiClient.post(`/users/${user._id}/profile`, profileData);

    // Then create the teacher record
    const teacherData = {
      user_id: user._id,
      school_id: data.school_id,
      employee_id: data.employee_id,
      joining_date: data.joining_date,
      designation: data.designation,
      department: data.department,
      subjects: data.subjects || [],
      qualification: data.qualification,
      experience_years: data.experience_years,
    };

    const response = await apiClient.post('/teachers', teacherData);
    return response.data.data;
  },

  /**
   * Update teacher
   */
  async update(id: string, data: Partial<Teacher>): Promise<Teacher> {
    // First get the current teacher data directly from backend to get the user_id
    const currentResponse = await apiClient.get(`/teachers/${id}`);
    const currentTeacher = currentResponse.data.data;
    const userId = currentTeacher.user_id?._id || currentTeacher.user_id;
    
    if (!userId) {
      throw new Error('Unable to find associated user for this teacher');
    }
    
    // Update user information if name or contact details changed
    if (data.first_name || data.last_name || data.email || data.phone) {
      const userData: any = {};
      
      if (data.first_name || data.last_name) {
        const currentName = currentTeacher.user_id?.name || '';
        const nameParts = currentName.split(' ');
        userData.name = `${data.first_name || nameParts[0] || ''} ${data.middle_name || nameParts[1] || ''} ${data.last_name || nameParts.slice(2).join(' ') || nameParts.slice(1).join(' ') || ''}`.trim();
      }
      
      if (data.email) userData.email = data.email;
      if (data.phone) userData.mobile_no = data.phone;
      
      if (Object.keys(userData).length > 0) {
        await apiClient.put(`/users/${userId}`, userData);
      }
    }

    // Update user profile if personal information changed
    const profileData: any = {};
    if (data.first_name) profileData.first_name = data.first_name;
    if (data.middle_name !== undefined) profileData.middle_name = data.middle_name;
    if (data.last_name) profileData.last_name = data.last_name;
    if (data.gender) profileData.gender = data.gender;
    if (data.date_of_birth) profileData.date_of_birth = data.date_of_birth;
    if (data.blood_group !== undefined) profileData.blood_group = data.blood_group;
    if (data.address !== undefined) profileData.address = data.address;
    if (data.city !== undefined) profileData.city = data.city;
    if (data.state !== undefined) profileData.state = data.state;
    if (data.country !== undefined) profileData.country = data.country;
    if (data.pincode !== undefined) profileData.pincode = data.pincode;

    if (Object.keys(profileData).length > 0) {
      await apiClient.put(`/users/${userId}/profile`, profileData);
    }

    // Update teacher-specific information
    const teacherData: any = {};
    if (data.employee_id) teacherData.employee_id = data.employee_id;
    if (data.joining_date) teacherData.joining_date = data.joining_date;
    if (data.designation !== undefined) teacherData.designation = data.designation;
    if (data.department !== undefined) teacherData.department = data.department;
    if (data.subjects !== undefined) teacherData.subjects = data.subjects;
    if (data.qualification !== undefined) teacherData.qualification = data.qualification;
    if (data.experience_years !== undefined) teacherData.experience_years = data.experience_years;
    if (data.is_active !== undefined) teacherData.status = data.is_active ? 'active' : 'inactive';

    if (Object.keys(teacherData).length > 0) {
      const response = await apiClient.patch(`/teachers/${id}`, teacherData);
      return response.data.data;
    }

    // If no teacher data to update, return the transformed current teacher
    return this.getById(id);
  },

  /**
   * Delete teacher
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/teachers/${id}`);
  },

  /**
   * Export teachers to Excel
   */
  async exportToExcel(filters: TeacherFilters): Promise<Blob> {
    const response = await apiClient.get('/teachers/export/excel', {
      params: {
        school_id: filters.schoolId,
        ...(filters.search && { search: filters.search }),
      },
      responseType: 'blob',
    });
    return response.data;
  },
};

export default teachersService;
