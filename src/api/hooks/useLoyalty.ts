import { useQuery } from '@tanstack/react-query';
import { getLoyaltyPoints, getLoyaltyRank } from '../loyalty.api';
import type { ApiResponse, LoyaltySummary } from '../types';
import type { LoyaltyPointsPayload } from '../loyalty.api';

export const useLoyaltyPointsQuery = (userId?: number) =>
  useQuery<ApiResponse<LoyaltyPointsPayload>, unknown, LoyaltyPointsPayload | undefined>({
    queryKey: ['loyalty', 'points', userId],
    enabled: typeof userId === 'number',
    queryFn: () => getLoyaltyPoints(userId as number),
    select: (response) => response.data,
  });

export const useLoyaltyRankQuery = (userId?: number) =>
  useQuery<ApiResponse<LoyaltySummary>, unknown, LoyaltySummary | undefined>({
    queryKey: ['loyalty', 'rank', userId],
    enabled: typeof userId === 'number',
    queryFn: () => getLoyaltyRank(userId as number),
    select: (response) => response.data,
  });
