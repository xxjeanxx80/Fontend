import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  assignStaffShift,
  createStaff,
  deleteStaff,
  requestStaffTimeOff,
  updateStaff,
} from '../staff.api';
import type {
  AssignShiftDto,
  CreateStaffDto,
  RequestTimeOffDto,
  UpdateStaffDto,
} from '../staff.api';
import type { ApiResponse, Staff, StaffShift, StaffTimeOff } from '../types';
import { extractErrorMessage } from '../utils';

export const useCreateStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Staff>, unknown, CreateStaffDto>({
    mutationFn: createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff member created');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useUpdateStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Staff>,
    unknown,
    { staffId: number; data: UpdateStaffDto }
  >({
    mutationFn: ({ staffId, data }) => updateStaff(staffId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff member updated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useDeleteStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<{ id: number }>, unknown, number>({
    mutationFn: (staffId) => deleteStaff(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff member removed');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useAssignShiftMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<StaffShift>,
    unknown,
    { staffId: number; data: AssignShiftDto }
  >({
    mutationFn: ({ staffId, data }) => assignStaffShift(staffId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Shift assigned');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useRequestTimeOffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<StaffTimeOff>,
    unknown,
    { staffId: number; data: RequestTimeOffDto }
  >({
    mutationFn: ({ staffId, data }) => requestStaffTimeOff(staffId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Time-off request submitted');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
