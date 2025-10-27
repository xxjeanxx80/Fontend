import api from './client';
import type { ApiResponse, SystemSetting } from './types';

export interface CreateSystemSettingDto {
  key: string;
  value: string;
  description?: string;
}

export type UpdateSystemSettingDto = Partial<CreateSystemSettingDto>;

export const getSystemSettings = async (): Promise<ApiResponse<SystemSetting[]>> => {
  const response = await api.get<ApiResponse<SystemSetting[]>>('/system-settings');
  return response.data;
};

export const createSystemSetting = async (
  payload: CreateSystemSettingDto,
): Promise<ApiResponse<SystemSetting>> => {
  const response = await api.post<ApiResponse<SystemSetting>>('/system-settings', payload);
  return response.data;
};

export const updateSystemSetting = async (
  key: string,
  payload: UpdateSystemSettingDto,
): Promise<ApiResponse<SystemSetting>> => {
  const response = await api.patch<ApiResponse<SystemSetting>>(`/system-settings/${key}`, payload);
  return response.data;
};

export const deleteSystemSetting = async (
  key: string,
): Promise<ApiResponse<{ key: string }>> => {
  const response = await api.delete<ApiResponse<{ key: string }>>(`/system-settings/${key}`);
  return response.data;
};
