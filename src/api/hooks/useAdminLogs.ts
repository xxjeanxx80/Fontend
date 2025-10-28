import { useQuery } from '@tanstack/react-query';
import { getAdminLogs } from '../adminLogs.api';
import type { AdminLogFilters } from '../adminLogs.api';
import type { AdminLog, ApiResponse } from '../types';

export const useAdminLogs = (filters?: AdminLogFilters) =>
  useQuery<ApiResponse<AdminLog[]>, unknown, AdminLog[]>({
    queryKey: ['admin-logs', filters],
    queryFn: () => getAdminLogs(filters),
    select: (response) => response.data,
  });
