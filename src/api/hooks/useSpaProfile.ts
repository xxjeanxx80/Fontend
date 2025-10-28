import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  createSpa,
  getSpaById,
  updateSpa,
  updateSpaApproval,
} from '../spas.api';
import type {
  CreateSpaDto,
  UpdateSpaApprovalDto,
  UpdateSpaDto,
} from '../spas.api';
import type { ApiResponse, Spa } from '../types';
import { extractErrorMessage } from '../utils';

export interface SpaProfileQueryOptions {
  enabled?: boolean;
  staleTime?: number;
}

export const useSpaProfileQuery = (spaId?: number, options: SpaProfileQueryOptions = {}) =>
  useQuery<ApiResponse<Spa>, unknown, Spa | undefined>({
    queryKey: ['spa', spaId],
    enabled: typeof spaId === 'number' && (options.enabled ?? true),
    queryFn: () => getSpaById(spaId as number),
    select: (response) => response.data,
    staleTime: options.staleTime,
  });

export const useCreateSpaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Spa>, unknown, CreateSpaDto>({
    mutationFn: createSpa,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['spas'] });
      if (response.data?.id) {
        queryClient.setQueryData<Spa | undefined>(['spa', response.data.id], response.data);
      }
      toast.success('Spa submitted successfully');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useUpdateSpaMutation = (spaId: number) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Spa>, unknown, UpdateSpaDto>({
    mutationFn: (payload) => updateSpa(spaId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['spas'] });
      queryClient.invalidateQueries({ queryKey: ['spa', spaId] });
      queryClient.setQueryData<Spa | undefined>(['spa', spaId], response.data);
      toast.success('Spa details updated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useUpdateSpaApprovalMutation = (spaId: number) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Spa>, unknown, UpdateSpaApprovalDto>({
    mutationFn: (payload) => updateSpaApproval(spaId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['spas'] });
      queryClient.invalidateQueries({ queryKey: ['spa', spaId] });
      queryClient.setQueryData<Spa | undefined>(['spa', spaId], response.data);
      toast.success('Spa approval updated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
