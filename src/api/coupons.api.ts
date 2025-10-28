import api from './client';
import type { ApiResponse, Coupon } from './types';

export interface CouponFilters {
  isActive?: boolean;
  search?: string;
}

export interface CreateCouponDto {
  code: string;
  discountPercent: number;
  maxRedemptions?: number;
  expiresAt?: string;
  isActive?: boolean;
}

export type UpdateCouponDto = Partial<CreateCouponDto>;

export const getCoupons = async (
  filters?: CouponFilters,
): Promise<ApiResponse<Coupon[]>> => {
  const response = await api.get<ApiResponse<Coupon[]>>('/coupons', {
    params: filters,
  });
  return response.data;
};

export const createCoupon = async (
  payload: CreateCouponDto,
): Promise<ApiResponse<Coupon>> => {
  const response = await api.post<ApiResponse<Coupon>>('/coupons', payload);
  return response.data;
};

export const updateCoupon = async (
  id: number,
  payload: UpdateCouponDto,
): Promise<ApiResponse<Coupon>> => {
  const response = await api.patch<ApiResponse<Coupon>>(`/coupons/${id}`, payload);
  return response.data;
};

export const deleteCoupon = async (
  id: number,
): Promise<ApiResponse<{ id: number }>> => {
  const response = await api.delete<ApiResponse<{ id: number }>>(`/coupons/${id}`);
  return response.data;
};
