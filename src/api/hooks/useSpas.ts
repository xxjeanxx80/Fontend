import { useQuery } from '@tanstack/react-query';
import { getSpaById, getSpas } from '../spas.api';
import type { ApiResponse, Spa } from '../types';
import type { SpaFilters } from '../spas.api';

export const useSpasQuery = (filters?: SpaFilters) =>
  useQuery<ApiResponse<Spa[]>, unknown, Spa[]>({
    queryKey: ['spas', filters],
    queryFn: () => getSpas(filters),
    select: (response) => response.data,
  });

export const useSpaQuery = (id?: number) =>
  useQuery<ApiResponse<Spa>, unknown, Spa | undefined>({
    queryKey: ['spas', id],
    enabled: typeof id === 'number',
    queryFn: () => getSpaById(id as number),
    select: (response) => response.data,
  });
