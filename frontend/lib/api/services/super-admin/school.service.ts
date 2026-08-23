import apiClient from "../../client";

export interface SchoolListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
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

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "School created successfully",
      };
    } catch (error: any) {
      console.error("Create school error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to create school",
      };
    }
  },

  async updateSchool(schoolId: string, schoolData: UpdateSchoolPayload) {
    try {
      const response = await apiClient.patch(
        `/super-admin/schools/${schoolId}`,
        schoolData,
      );

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "School updated successfully",
      };
    } catch (error: any) {
      console.error("Update school error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to update school",
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

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete school",
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

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to approve school",
      };
    }
  },

  async rejectSchool(schoolId: string) {
    try {
      const response = await apiClient.post(
        `/super-admin/schools/${schoolId}/reject`,
      );

      return {
        success: true,
        data: response.data.data || response.data,
        message:
          response.data.message || "School registration rejected successfully",
      };
    } catch (error: any) {
      console.error("Reject school error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to reject school",
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

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      console.error("Get pending schools error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch pending schools",
      };
    }
  },
};
