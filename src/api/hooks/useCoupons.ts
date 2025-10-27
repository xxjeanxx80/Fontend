import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createCoupon, deleteCoupon, getCoupons, updateCoupon } from '../coupons.api';
import type { CouponFilters, CreateCouponDto, UpdateCouponDto } from '../coupons.api';
import type { ApiResponse, Coupon } from '../types';
import { extractErrorMessage } from '../utils';

export const useCoupons = (filters?: CouponFilters) =>
  useQuery<ApiResponse<Coupon[]>, unknown, Coupon[]>({
    queryKey: ['coupons', filters],
    queryFn: () => getCoupons(filters),
    select: (response) => response.data,
  });

export const useCreateCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Coupon>, unknown, CreateCouponDto>({
    mutationFn: createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon created');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useUpdateCouponMutation = (couponId: number) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Coupon>, unknown, UpdateCouponDto>({
    mutationFn: (payload) => updateCoupon(couponId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon updated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<{ id: number }>, unknown, number>({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon removed');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
