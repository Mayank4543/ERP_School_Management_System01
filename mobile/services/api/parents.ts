import { apiClient } from './client';

export const parentsService = {
  async getChildren(parentId: string): Promise<any> {
    // This endpoint needs to be implemented in backend
    // For now, we'll use a workaround
    return apiClient.get('/students', {
      params: { parent_id: parentId },
    });
  },

  async getChildAttendance(childId: string): Promise<any> {
    return apiClient.get(`/attendance/user/${childId}`);
  },

  async getChildExams(childId: string): Promise<any> {
    return apiClient.get('/exams', {
      params: { student_id: childId },
    });
  },

  async getChildFees(childId: string): Promise<any> {
    return apiClient.get('/fees', {
      params: { student_id: childId },
    });
  },

  async payFee(feeId: string, paymentData: any): Promise<any> {
    return apiClient.post('/fees/pay', {
      fee_id: feeId,
      ...paymentData,
    });
  },
};



