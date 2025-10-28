import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFeedback } from '../feedbacks.api';
import type { ApiResponse, Feedback } from '../types';
import type { CreateFeedbackDto } from '../feedbacks.api';

export const useCreateFeedbackMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Feedback>, unknown, CreateFeedbackDto>({
    mutationFn: createFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    },
  });
};
