import api from './client';
import type { ApiResponse, Service } from './types';

export interface ServiceFilters {
  spaId?: number;
  category?: string;
}

export interface CreateServiceDto {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  serviceType: 'AT_SPA' | 'AT_HOME';
  spaId: number;
  availableAtHome?: boolean;
}

export type UpdateServiceDto = Partial<CreateServiceDto>;

export const getServices = async (
  filters?: ServiceFilters,
): Promise<ApiResponse<Service[]>> => {
  const response = await api.get<ApiResponse<Service[]>>('/services', {
    params: filters,
  });
  return response.data;
};

export const createService = async (
  payload: CreateServiceDto,
): Promise<ApiResponse<Service>> => {
  const response = await api.post<ApiResponse<Service>>('/services', payload);
  return response.data;
};

export const updateService = async (
  id: number,
  payload: UpdateServiceDto,
): Promise<ApiResponse<Service>> => {
  const response = await api.patch<ApiResponse<Service>>(`/services/${id}`, payload);
  return response.data;
};

export const deleteService = async (id: number): Promise<ApiResponse<{ id: number }>> => {
  const response = await api.delete<ApiResponse<{ id: number }>>(`/services/${id}`);
  return response.data;
};
