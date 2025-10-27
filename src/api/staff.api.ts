import api from './client';
import type { ApiResponse, Staff, StaffShift, StaffTimeOff } from './types';

export interface StaffFilters {
  spaId?: number;
}

export interface CreateStaffDto {
  name: string;
  spaId: number;
  email?: string;
  phone?: string;
  skills?: string[];
}

export type UpdateStaffDto = Partial<CreateStaffDto>;

export interface AssignShiftDto {
  startTime: string;
  endTime: string;
}

export interface RequestTimeOffDto {
  startAt: string;
  endAt: string;
  reason?: string;
}

export const getStaff = async (
  filters?: StaffFilters,
): Promise<ApiResponse<Staff[]>> => {
  const response = await api.get<ApiResponse<Staff[]>>('/staff', {
    params: filters,
  });
  return response.data;
};

export const createStaff = async (
  payload: CreateStaffDto,
): Promise<ApiResponse<Staff>> => {
  const response = await api.post<ApiResponse<Staff>>('/staff', payload);
  return response.data;
};

export const updateStaff = async (
  id: number,
  payload: UpdateStaffDto,
): Promise<ApiResponse<Staff>> => {
  const response = await api.patch<ApiResponse<Staff>>(`/staff/${id}`, payload);
  return response.data;
};

export const deleteStaff = async (id: number): Promise<ApiResponse<{ id: number }>> => {
  const response = await api.delete<ApiResponse<{ id: number }>>(`/staff/${id}`);
  return response.data;
};

export const assignStaffShift = async (
  id: number,
  payload: AssignShiftDto,
): Promise<ApiResponse<StaffShift>> => {
  const response = await api.post<ApiResponse<StaffShift>>(`/staff/${id}/shifts`, payload);
  return response.data;
};

export const requestStaffTimeOff = async (
  id: number,
  payload: RequestTimeOffDto,
): Promise<ApiResponse<StaffTimeOff>> => {
  const response = await api.post<ApiResponse<StaffTimeOff>>(`/staff/${id}/time-off`, payload);
  return response.data;
};
