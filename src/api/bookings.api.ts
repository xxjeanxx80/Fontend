import api from './client';
import type { ApiResponse, Booking } from './types';

export interface BookingFilters {
  status?: string;
  customerId?: number;
  spaId?: number;
}

export interface CreateBookingDto {
  spaId: number;
  serviceId: number;
  customerId: number;
  staffId?: number;
  scheduledAt: string;
  couponCode?: string;
  notes?: string;
}

export interface RescheduleBookingDto {
  scheduledAt: string;
}

export interface CancelBookingDto {
  reason?: string;
}

export const getBookings = async (
  filters?: BookingFilters,
): Promise<ApiResponse<Booking[]>> => {
  const response = await api.get<ApiResponse<Booking[]>>('/bookings', {
    params: filters,
  });
  return response.data;
};

export const getBookingById = async (
  id: number,
): Promise<ApiResponse<Booking>> => {
  const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
  return response.data;
};

export const createBooking = async (
  payload: CreateBookingDto,
): Promise<ApiResponse<Booking>> => {
  const response = await api.post<ApiResponse<Booking>>('/bookings', payload);
  return response.data;
};

export const rescheduleBooking = async (
  id: number,
  payload: RescheduleBookingDto,
): Promise<ApiResponse<Booking>> => {
  const response = await api.patch<ApiResponse<Booking>>(
    `/bookings/${id}/reschedule`,
    payload,
  );
  return response.data;
};

export const cancelBooking = async (
  id: number,
  payload: CancelBookingDto,
): Promise<ApiResponse<Booking>> => {
  const response = await api.patch<ApiResponse<Booking>>(
    `/bookings/${id}/cancel`,
    payload,
  );
  return response.data;
};
