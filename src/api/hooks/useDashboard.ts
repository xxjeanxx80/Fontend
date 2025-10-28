import { useQuery } from '@tanstack/react-query';
import { getLatestDashboardSnapshot } from '../dashboard.api';
import type { ApiResponse, DashboardSnapshot } from '../types';

export const useDashboardSnapshotQuery = () =>
  useQuery<ApiResponse<DashboardSnapshot>, unknown, DashboardSnapshot>({
    queryKey: ['dashboard', 'latest-snapshot'],
    queryFn: getLatestDashboardSnapshot,
    select: (response) => response.data,
  });
