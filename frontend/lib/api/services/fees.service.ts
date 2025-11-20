import apiClient from '../client';
import { Fee, FeePayment } from '@/types';

export interface FeeFilters {
  schoolId: string;
  page?: number;
  limit?: number;
  academic_year_id?: string;
  standard?: number;
  fee_type?: string;
}

export interface CreateFeeData {
  school_id: string;
  name: string;
  amount: number;
  fee_type: string;
  academic_year_id: string;
  standard?: number;
  due_date?: string;
  description?: string;
}

export interface FeePaymentData {
  school_id: string;
  student_id: string;
  fee_id: string;
  amount_paid: number;
  payment_date: string;
  payment_mode: 'cash' | 'card' | 'cheque' | 'online' | 'upi';
  transaction_id?: string;
  remarks?: string;
}

export interface StudentFeeStatus {
  student_id: string;
  student_name: string;
  total_fee: number;
  paid_amount: number;
  pending_amount: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
}

const feesService = {
  /**
   * Get all fees
   */
  async getAll(filters: FeeFilters): Promise<any> {
    const response = await apiClient.get('/fees', {
      params: {
        school_id: filters.schoolId,
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...(filters.academic_year_id && { academic_year_id: filters.academic_year_id }),
        ...(filters.standard && { standard: filters.standard }),
        ...(filters.fee_type && { fee_type: filters.fee_type }),
      },
    });
    return response.data;
  },

  /**
   * Get fee by ID
   */
  async getById(id: string): Promise<Fee> {
    const response = await apiClient.get(`/fees/${id}`);
    return response.data.data;
  },

  /**
   * Create new fee
   */
  async create(data: CreateFeeData): Promise<Fee> {
    const response = await apiClient.post('/fees', data);
    return response.data.data;
  },

  /**
   * Update fee
   */
  async update(id: string, data: Partial<CreateFeeData>): Promise<Fee> {
    const response = await apiClient.patch(`/fees/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete fee
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/fees/${id}`);
  },

  /**
   * Record fee payment
   */
  async recordPayment(data: FeePaymentData): Promise<FeePayment> {
    const response = await apiClient.post('/fees/payment', data);
    return response.data.data;
  },

  /**
   * Get student fee details
   */
  async getStudentFees(studentId: string): Promise<StudentFeeStatus> {
    const response = await apiClient.get(`/fees/student/${studentId}`);
    return response.data.data;
  },

  /**
   * Get fee payment history
   */
  async getPaymentHistory(
    studentId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<FeePayment[]> {
    const response = await apiClient.get('/fees/payments', {
      params: {
        ...(studentId && { student_id: studentId }),
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      },
    });
    return response.data.data;
  },

  /**
   * Get fee defaulters
   */
  async getDefaulters(schoolId: string): Promise<StudentFeeStatus[]> {
    const response = await apiClient.get('/fees/defaulters', {
      params: { school_id: schoolId },
    });
    return response.data.data;
  },

  /**
   * Generate fee receipt
   */
  async generateReceipt(paymentId: string): Promise<Blob> {
    const response = await apiClient.get(`/fees/payment/${paymentId}/receipt`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Export fee report
   */
  async exportReport(filters: FeeFilters): Promise<Blob> {
    const response = await apiClient.get('/fees/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get fee collection summary
   */
  async getCollectionSummary(
    schoolId: string,
    startDate: string,
    endDate: string
  ): Promise<any> {
    const response = await apiClient.get('/fees/summary', {
      params: {
        school_id: schoolId,
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data.data;
  },
};

export default feesService;
