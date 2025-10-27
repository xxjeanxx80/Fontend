import api from './client';
import type { ApiResponse, Feedback } from './types';

export interface CreateFeedbackDto {
  bookingId: number;
  customerId: number;
  rating: number;
  comment?: string;
}

export const createFeedback = async (
  payload: CreateFeedbackDto,
): Promise<ApiResponse<Feedback>> => {
  const response = await api.post<ApiResponse<Feedback>>('/feedbacks', payload);
  return response.data;
};
