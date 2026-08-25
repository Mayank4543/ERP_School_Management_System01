import apiClient from "../../client";
import { parseApiError } from '@/lib/api/utils/api-error';
export interface SchoolListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CreateSchoolPayload {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  state: string;
  city: string;
  pincode: string;
  board?: string;
  website?: string;
}

export interface UpdateSchoolPayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  state?: string;
  city?: string;
  pincode?: string;
  board?: string;
  website?: string;
}

export interface RejectSchoolPayload {
  reason: string;
}

export const superAdminSchoolService = {
  async getAllSchools(params: SchoolListParams = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    try {
      const response = await apiClient.get(
        `/super-admin/schools?${queryParams.toString()}`,
      );

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      console.error("Get schools error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch schools",
      };
    }
  },

  async getSchool(schoolId: string) {
    try {
      const response = await apiClient.get(`/super-admin/schools/${schoolId}`);

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      console.error("Get school error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to get school details",
      };
    }
  },

  async createSchool(schoolData: CreateSchoolPayload) {
    try {
      const response = await apiClient.post(
        "/super-admin/schools/create",
        schoolData,
      );
      if(!response.data.success) {
        return {
          success: false,
          message: response.data?.message || "Failed to create school",
        };
      }

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "School created successfully",
      };
    } catch (error:unknown) {
      const apiError = parseApiError(
        error,
        'Unable to create school. Please try again.',
      );

      return {
        success: false,
        message:apiError.message || "Failed to create school",
        code: apiError.code,
        fieldErrors:apiError.fieldErrors
      };
    }
  },

  async updateSchool(schoolId: string, schoolData: UpdateSchoolPayload) {
    try {
      const response = await apiClient.patch(
        `/super-admin/schools/${schoolId}`,
        schoolData,
      );
      if(!response.data.success) {
        return {
          success: false,
          message: response.data?.message || "Failed to update school",
        };
      }

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "School updated successfully",
      };
    } catch (error: any) {
      console.error("Update school error:", error);
      const apiError = parseApiError(
        error,
        'Unable to create school. Please try again.',
      );

      return {
        success: false,
        message: apiError.message || "Failed to create school",
        code: apiError.code,
        fieldErrors: apiError.fieldErrors
      };
    }
  },

  async deleteSchool(schoolId: string) {
    try {
      const response = await apiClient.delete(
        `/super-admin/schools/${schoolId}`,
      );

      return {
        success: true,
        message: response.data.message || "School deleted successfully",
      };
    } catch (error: any) {
      console.error("Delete school error:", error);
      const apiError = parseApiError(
        error,
        'Unable to delete school. Please try again.',
      );

      return {
        success: false,
        message: apiError.message || "Failed to delete school",
        code: apiError.code,
        fieldErrors: apiError.fieldErrors
      };
    }
  },

  async approveSchool(schoolId: string) {
    try {
      const response = await apiClient.post(
        `/super-admin/schools/${schoolId}/approve`,
      );

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "School approved successfully",
      };
    } catch (error: any) {
      console.error("Approve school error:", error);
      const apiError = parseApiError(
        error,
        'Unable to approve school. Please try again.',
      );

      return {
        success: false,
        message: apiError.message || "Failed to approve school",
        code: apiError.code,
        fieldErrors: apiError.fieldErrors
      };
    }
  },

  async rejectSchool(schoolId: string, payload: RejectSchoolPayload) {
    try {
      const response = await apiClient.post(
        `/super-admin/schools/${schoolId}/reject`,
        payload,
      );

      return {
        success: true,
        data: response.data.data || response.data,
        message:
          response.data.message || "School registration rejected successfully",
      };
    } catch (error: any) {
      console.error("Reject school error:", error);
      const apiError = parseApiError(
        error,
        'Unable to reject school. Please try again.',
      );

      return {
        success: false,
        message: apiError.message || "Failed to reject school",
        code: apiError.code,
        fieldErrors: apiError.fieldErrors
      };
    }
  },

  async getPendingSchools(
    params: {
      limit?: number;
      page?: number;
    } = {},
  ) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    try {
      const response = await apiClient.get(
        `/super-admin/schools/pending?${queryParams.toString()}`,
      );
      if(!response.data.success) {
        return {
          success: false,
          message: response.data?.message || "Failed to fetch pending schools",
        };
      }

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      
      const apiError = parseApiError(
        error,
        'Unable to fetch pending schools. Please try again.',
      );

      return {
        success: false,
        message: apiError.message || "Failed to fetch pending schools",
        code: apiError.code,
        fieldErrors: apiError.fieldErrors
      };
    }
  },
};
