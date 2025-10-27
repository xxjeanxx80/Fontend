import api from './client';
import type { ApiResponse, Spa } from './types';

export interface SpaFilters {
  search?: string;
  location?: string;
  category?: string;
}

export interface CreateSpaDto {
  name: string;
  description?: string;
  address?: string;
}

export type UpdateSpaDto = Partial<CreateSpaDto>;

export interface UpdateSpaApprovalDto {
  isApproved: boolean;
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

export const createSpa = async (payload: CreateSpaDto): Promise<ApiResponse<Spa>> => {
  const response = await api.post<ApiResponse<Spa>>('/spas', payload);
  return response.data;
};

export const updateSpa = async (
  id: number,
  payload: UpdateSpaDto,
): Promise<ApiResponse<Spa>> => {
  const response = await api.patch<ApiResponse<Spa>>(`/spas/${id}`, payload);
  return response.data;
};

export const updateSpaApproval = async (
  id: number,
  payload: UpdateSpaApprovalDto,
): Promise<ApiResponse<Spa>> => {
  const response = await api.patch<ApiResponse<Spa>>(`/spas/${id}/approval`, payload);
  return response.data;
};
