import apiClient from '../client';

export interface Student {
  _id: string;
  user_id: string;
  school_id: string;
  academic_year_id: string;
  admission_no: string;
  roll_no: string;
  standard: number;
  section_id: string;
  status: 'active' | 'inactive' | 'transferred' | 'graduated';
  admission_date: string;
  blood_group?: string;
  religion?: string;
  caste?: string;
  category?: string;
  mother_tongue?: string;
  nationality?: string;
  previous_school?: string;
  transport_mode?: string;
  route_id?: string;
  parent_ids?: string[];
  medical_info?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    emergency_contact?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateStudentDto {
  user_id: string;
  school_id: string;
  academic_year_id: string;
  standard: number;
  section_id: string;
  roll_no: string;
  admission_no: string;
  admission_date: Date | string;
  blood_group?: string;
  religion?: string;
  caste?: string;
  category?: string;
  mother_tongue?: string;
  nationality?: string;
  previous_school?: string;
  transport_mode?: string;
  route_id?: string;
  parent_ids?: string[];
  medical_info?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    emergency_contact?: string;
  };
}

export interface StudentFilters {
  schoolId: string;
  page?: number;
  limit?: number;
  search?: string;
  standard?: number;
  section?: string;
  academic_year_id?: string;
  status?: 'active' | 'inactive';
}

export interface StudentResponse {
  success: boolean;
  data: Student[];
  page: number;
  total: number;
  totalPages: number;
}

const studentsService = {
  /**
   * Get all students with filters and pagination
   */
  async getAll(filters: StudentFilters): Promise<StudentResponse> {
    const response = await apiClient.get('/students', {
      params: {
        school_id: filters.schoolId,
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...(filters.search && { search: filters.search }),
        ...(filters.standard && { standard: filters.standard }),
        ...(filters.section && { section: filters.section }),
        ...(filters.status && { status: filters.status }),
        ...(filters.academic_year_id && { academic_year_id: filters.academic_year_id }),
      },
    });

    // Backend returns data in meta object, restructure it
    return {
      success: response.data.success,
      data: response.data.data,
      page: response.data.meta?.page || 1,
      total: response.data.meta?.total || 0,
      totalPages: response.data.meta?.totalPages || 0,
    };
  },

  /**
   * Get student by ID
   */
  async getById(id: string): Promise<Student> {
    const response = await apiClient.get(`/students/${id}`);
    return response.data.data;
  },

  /**
   * Get student by admission number
   */
  async getByAdmissionNo(admissionNo: string): Promise<Student> {
    const response = await apiClient.get(`/students/admission/${admissionNo}`);
    return response.data.data;
  },

  /**
   * Get student by user ID
   */
  async getByUserId(userId: string): Promise<Student> {
    const response = await apiClient.get(`/students/user/${userId}`);
    return response.data.data;
  },

  /**
   * Create new student
   */
  async create(data: CreateStudentDto): Promise<Student> {
    console.log('🔵 studentsService.create called with:', JSON.stringify(data, null, 2));
    const response = await apiClient.post('/students', data);
    return response.data.data;
  },

  /**
   * Update student
   */
  async update(id: string, data: Partial<Student>): Promise<Student> {
    const response = await apiClient.patch(`/students/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete student (soft delete)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/students/${id}`);
  },

  /**
   * Get students by class and section
   */
  async getByClass(
    schoolId: string,
    standard: number,
    sectionId: string,
    academicYearId?: string
  ): Promise<Student[]> {
    const response = await apiClient.get(`/students/class/${standard}/${sectionId}`, {
      params: {
        school_id: schoolId,
        ...(academicYearId && { academic_year_id: academicYearId }),
      },
    });
    return response.data.data;
  },

  /**
   * Export students to Excel
   */
  async exportToExcel(filters: StudentFilters): Promise<Blob> {
    const response = await apiClient.get('/students/export/excel', {
      params: {
        school_id: filters.schoolId,
        ...(filters.search && { search: filters.search }),
        ...(filters.standard && { standard: filters.standard }),
        ...(filters.section && { section: filters.section }),
      },
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Bulk upload students via Excel
   */
  async bulkUpload(file: File, schoolId: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('school_id', schoolId);

    const response = await apiClient.post('/students/import/excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get student statistics
   */
  async getStats(schoolId: string): Promise<any> {
    const response = await apiClient.get('/students/stats', {
      params: { school_id: schoolId },
    });
    return response.data.data;
  },
};

export { studentsService };
export default studentsService;
