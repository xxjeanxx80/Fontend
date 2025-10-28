import api from './client';
import type { ApiResponse, Report, ReportTargetType } from './types';

export interface ReportFilters {
  status?: string;
  targetType?: ReportTargetType;
  search?: string;
}

export interface ResolveReportDto {
  notes?: string;
}

export const getReports = async (
  filters?: ReportFilters,
): Promise<ApiResponse<Report[]>> => {
  const response = await api.get<ApiResponse<Report[]>>('/reports', {
    params: filters,
  });
  return response.data;
};

export const resolveReport = async (
  id: number,
  payload: ResolveReportDto,
): Promise<ApiResponse<Report>> => {
  const response = await api.patch<ApiResponse<Report>>(`/reports/${id}/resolve`, payload);
  return response.data;
};
