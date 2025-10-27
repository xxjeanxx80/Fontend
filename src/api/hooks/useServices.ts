import { useQuery } from '@tanstack/react-query';
import { getServices } from '../services.api';
import type { ApiResponse, Service } from '../types';
import type { ServiceFilters } from '../services.api';

export const useServicesQuery = (filters?: ServiceFilters) =>
  useQuery<ApiResponse<Service[]>, unknown, Service[]>({
    queryKey: ['services', filters],
    queryFn: () => getServices(filters),
    select: (response) => response.data,
  });
