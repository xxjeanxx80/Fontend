import { useQuery } from '@tanstack/react-query';
import { getStaff } from '../staff.api';
import type { ApiResponse, Staff } from '../types';
import type { StaffFilters } from '../staff.api';

export const useStaffQuery = (filters?: StaffFilters) =>
  useQuery<ApiResponse<Staff[]>, unknown, Staff[]>({
    queryKey: ['staff', filters],
    queryFn: () => getStaff(filters),
    select: (response) => response.data,
  });
