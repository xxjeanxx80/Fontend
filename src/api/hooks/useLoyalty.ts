import { useQuery } from '@tanstack/react-query';
import { getLoyaltyPoints, getLoyaltyRank } from '../loyalty.api';
import type { ApiResponse, LoyaltySummary } from '../types';
import type { LoyaltyPointsPayload } from '../loyalty.api';

export interface LoyaltyQueryOptions {
  enabled?: boolean;
  staleTime?: number;
}

export const useLoyaltyPointsQuery = (userId?: number, options: LoyaltyQueryOptions = {}) =>
  useQuery<ApiResponse<LoyaltyPointsPayload>, unknown, LoyaltyPointsPayload | undefined>({
    queryKey: ['loyalty', 'points', userId],
    enabled: typeof userId === 'number' && (options.enabled ?? true),
    queryFn: () => getLoyaltyPoints(userId as number),
    select: (response) => response.data,
    staleTime: options.staleTime,
  });

export const useLoyaltyRankQuery = (userId?: number, options: LoyaltyQueryOptions = {}) =>
  useQuery<ApiResponse<LoyaltySummary>, unknown, LoyaltySummary | undefined>({
    queryKey: ['loyalty', 'rank', userId],
    enabled: typeof userId === 'number' && (options.enabled ?? true),
    queryFn: () => getLoyaltyRank(userId as number),
    select: (response) => response.data,
    staleTime: options.staleTime,
  });
