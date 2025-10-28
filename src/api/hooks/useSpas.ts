import { useQuery } from '@tanstack/react-query';
import { getSpaById, getSpas } from '../spas.api';
import type { ApiResponse, Spa } from '../types';
import type { SpaFilters } from '../spas.api';

export interface SpaQueryOptions {
  enabled?: boolean;
  staleTime?: number;
}

export const useSpasQuery = (filters?: SpaFilters, options: SpaQueryOptions = {}) =>
  useQuery<ApiResponse<Spa[]>, unknown, Spa[]>({
    queryKey: ['spas', filters],
    queryFn: () => getSpas(filters),
    select: (response) => response.data,
    enabled: options.enabled ?? true,
    staleTime: options.staleTime,
  });

export const useSpaQuery = (id?: number, options: SpaQueryOptions = {}) =>
  useQuery<ApiResponse<Spa>, unknown, Spa | undefined>({
    queryKey: ['spa', id],
    enabled: typeof id === 'number' && (options.enabled ?? true),
    queryFn: () => getSpaById(id as number),
    select: (response) => response.data,
    staleTime: options.staleTime,
  });
