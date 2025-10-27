import api from './client';
import type { ApiResponse, Staff } from './types';

export interface StaffFilters {
  spaId?: number;
}

export const getStaff = async (
  filters?: StaffFilters,
): Promise<ApiResponse<Staff[]>> => {
  const response = await api.get<ApiResponse<Staff[]>>('/staff', {
    params: filters,
  });
  return response.data;
};
