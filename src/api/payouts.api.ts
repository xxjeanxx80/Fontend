import api from './client';
import type { ApiResponse, Payout } from './types';

export interface PayoutFilters {
  spaId?: number;
  ownerId?: number;
  status?: string;
}

export const getPayouts = async (
  filters?: PayoutFilters,
): Promise<ApiResponse<Payout[]>> => {
  const response = await api.get<ApiResponse<Payout[]>>('/payouts', {
    params: filters,
  });
  return response.data;
};
