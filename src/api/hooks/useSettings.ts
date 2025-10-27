import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  createSystemSetting,
  deleteSystemSetting,
  getSystemSettings,
  updateSystemSetting,
} from '../systemSettings.api';
import type {
  CreateSystemSettingDto,
  UpdateSystemSettingDto,
} from '../systemSettings.api';
import type { ApiResponse, SystemSetting } from '../types';
import { extractErrorMessage } from '../utils';

export const useSettings = () =>
  useQuery<ApiResponse<SystemSetting[]>, unknown, SystemSetting[]>({
    queryKey: ['system-settings'],
    queryFn: getSystemSettings,
    select: (response) => response.data,
  });

export const useCreateSystemSettingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<SystemSetting>, unknown, CreateSystemSettingDto>({
    mutationFn: createSystemSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast.success('Setting created');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useUpdateSystemSettingMutation = (key: string) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<SystemSetting>, unknown, UpdateSystemSettingDto>({
    mutationFn: (payload) => updateSystemSetting(key, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast.success('Setting updated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useDeleteSystemSettingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<{ key: string }>, unknown, string>({
    mutationFn: deleteSystemSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast.success('Setting deleted');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
