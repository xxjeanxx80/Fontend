import { useQuery } from '@tanstack/react-query';
import { getPayouts } from '../payouts.api';
import type { ApiResponse, Payout } from '../types';
import type { PayoutFilters } from '../payouts.api';

export const usePayoutsQuery = (filters?: PayoutFilters) =>
  useQuery<ApiResponse<Payout[]>, unknown, Payout[]>({
    queryKey: ['payouts', filters],
    queryFn: () => getPayouts(filters),
    select: (response) => response.data,
  });
