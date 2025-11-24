import apiClient from './client';

// Re-export the client as the default api
export default apiClient;

// Export common API utilities
export { apiClient };

// Export types for responses
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  success?: boolean;
}

// Export error types
export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}