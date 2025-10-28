import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getBookings,
  rescheduleBooking,
} from '../bookings.api';
import type {
  ApiResponse,
  Booking,
} from '../types';
import type {
  BookingFilters,
  CancelBookingDto,
  CreateBookingDto,
  RescheduleBookingDto,
} from '../bookings.api';

export interface UseQueryOptions {
  enabled?: boolean;
  staleTime?: number;
}

export const useBookingsQuery = (filters?: BookingFilters, options: UseQueryOptions = {}) =>
  useQuery<ApiResponse<Booking[]>, unknown, Booking[]>({
    queryKey: ['bookings', filters],
    queryFn: () => getBookings(filters),
    select: (response) => response.data,
    enabled: options.enabled ?? true,
    staleTime: options.staleTime,
  });

export const useBookingQuery = (id?: number, options: UseQueryOptions = {}) =>
  useQuery<ApiResponse<Booking>, unknown, Booking | undefined>({
    queryKey: ['bookings', id],
    enabled: typeof id === 'number' && (options.enabled ?? true),
    queryFn: () => getBookingById(id as number),
    select: (response) => response.data,
    staleTime: options.staleTime,
  });

export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Booking>, unknown, CreateBookingDto>({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useRescheduleBookingMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Booking>, unknown, RescheduleBookingDto>({
    mutationFn: (payload) => rescheduleBooking(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', id] });
    },
  });
};

export const useCancelBookingMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Booking>, unknown, CancelBookingDto>({
    mutationFn: (payload) => cancelBooking(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', id] });
    },
  });
};
