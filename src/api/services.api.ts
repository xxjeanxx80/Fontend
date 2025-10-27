import api from './client';
import type { ApiResponse, Service } from './types';

export interface ServiceFilters {
  spaId?: number;
  category?: string;
}

export const getServices = async (
  filters?: ServiceFilters,
): Promise<ApiResponse<Service[]>> => {
  const response = await api.get<ApiResponse<Service[]>>('/services', {
    params: filters,
  });
  return response.data;
};
