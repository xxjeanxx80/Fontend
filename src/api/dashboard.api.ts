import api from './client';
import type { ApiResponse, DashboardSnapshot } from './types';

export const getLatestDashboardSnapshot = async (): Promise<ApiResponse<DashboardSnapshot>> => {
  const response = await api.get<ApiResponse<DashboardSnapshot>>('/dashboard/snapshots/latest');
  return response.data;
};
