import api from './client';
import type { ApiResponse, LoyaltySummary } from './types';

export interface LoyaltyPointsPayload {
  points: number;
  history?: LoyaltySummary['history'];
}

export const getLoyaltyPoints = async (
  userId: number,
): Promise<ApiResponse<LoyaltyPointsPayload>> => {
  const response = await api.get<ApiResponse<LoyaltyPointsPayload>>(
    `/users/${userId}/loyalty/points`,
  );
  return response.data;
};

export const getLoyaltyRank = async (
  userId: number,
): Promise<ApiResponse<LoyaltySummary>> => {
  const response = await api.get<ApiResponse<LoyaltySummary>>(
    `/users/${userId}/loyalty/rank`,
  );
  return response.data;
};
