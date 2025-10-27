import api from './client';
import type { ApiResponse, Campaign } from './types';

export interface CampaignFilters {
  isActive?: boolean;
  search?: string;
}

export interface CreateCampaignDto {
  name: string;
  description?: string;
  discountPercent: number;
  startsAt: string;
  endsAt?: string;
  isActive?: boolean;
}

export type UpdateCampaignDto = Partial<CreateCampaignDto>;

export interface UpdateCampaignStatusDto {
  isActive: boolean;
}

export const getCampaigns = async (
  filters?: CampaignFilters,
): Promise<ApiResponse<Campaign[]>> => {
  const response = await api.get<ApiResponse<Campaign[]>>('/campaigns', {
    params: filters,
  });
  return response.data;
};

export const createCampaign = async (
  payload: CreateCampaignDto,
): Promise<ApiResponse<Campaign>> => {
  const response = await api.post<ApiResponse<Campaign>>('/campaigns', payload);
  return response.data;
};

export const updateCampaign = async (
  id: number,
  payload: UpdateCampaignDto,
): Promise<ApiResponse<Campaign>> => {
  const response = await api.patch<ApiResponse<Campaign>>(`/campaigns/${id}`, payload);
  return response.data;
};

export const deleteCampaign = async (
  id: number,
): Promise<ApiResponse<{ id: number }>> => {
  const response = await api.delete<ApiResponse<{ id: number }>>(`/campaigns/${id}`);
  return response.data;
};

export const updateCampaignStatus = async (
  id: number,
  payload: UpdateCampaignStatusDto,
): Promise<ApiResponse<Campaign>> => {
  const response = await api.patch<ApiResponse<Campaign>>(
    `/admin/campaigns/${id}/status`,
    payload,
  );
  return response.data;
};
