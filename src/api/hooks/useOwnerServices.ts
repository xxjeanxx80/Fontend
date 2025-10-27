import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  createService,
  deleteService,
  updateService,
} from '../services.api';
import type {
  CreateServiceDto,
  UpdateServiceDto,
} from '../services.api';
import type { ApiResponse, Service } from '../types';
import { extractErrorMessage } from '../utils';

export const useCreateServiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Service>, unknown, CreateServiceDto>({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service created successfully');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useUpdateServiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Service>,
    unknown,
    { serviceId: number; data: UpdateServiceDto }
  >({
    mutationFn: ({ serviceId, data }) => updateService(serviceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service updated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useDeleteServiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<{ id: number }>, unknown, number>({
    mutationFn: (serviceId) => deleteService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service removed');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
