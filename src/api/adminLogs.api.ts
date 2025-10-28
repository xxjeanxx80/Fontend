import api from './client';
import type { AdminLog, ApiResponse } from './types';

export interface AdminLogFilters {
  level?: string;
  search?: string;
  limit?: number;
}

export const getAdminLogs = async (
  filters?: AdminLogFilters,
): Promise<ApiResponse<AdminLog[]>> => {
  const response = await api.get<ApiResponse<AdminLog[]>>('/admin/logs', {
    params: filters,
  });
  return response.data;
};
