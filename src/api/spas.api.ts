import api from './client';
import type { ApiResponse, Spa } from './types';

export interface SpaFilters {
  search?: string;
  location?: string;
  category?: string;
}

export const getSpas = async (
  filters?: SpaFilters,
): Promise<ApiResponse<Spa[]>> => {
  const response = await api.get<ApiResponse<Spa[]>>('/spas', {
    params: filters,
  });
  return response.data;
};

export const getSpaById = async (id: number): Promise<ApiResponse<Spa>> => {
  const response = await api.get<ApiResponse<Spa>>(`/spas/${id}`);
  return response.data;
};
