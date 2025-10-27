import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  createCampaign,
  deleteCampaign,
  getCampaigns,
  updateCampaign,
  updateCampaignStatus,
} from '../campaigns.api';
import type {
  CampaignFilters,
  CreateCampaignDto,
  UpdateCampaignDto,
  UpdateCampaignStatusDto,
} from '../campaigns.api';
import type { ApiResponse, Campaign } from '../types';
import { extractErrorMessage } from '../utils';

export const useCampaigns = (filters?: CampaignFilters) =>
  useQuery<ApiResponse<Campaign[]>, unknown, Campaign[]>({
    queryKey: ['campaigns', filters],
    queryFn: () => getCampaigns(filters),
    select: (response) => response.data,
  });

export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Campaign>, unknown, CreateCampaignDto>({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign created');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useUpdateCampaignMutation = (campaignId: number) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Campaign>, unknown, UpdateCampaignDto>({
    mutationFn: (payload) => updateCampaign(campaignId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign updated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useDeleteCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<{ id: number }>, unknown, number>({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign removed');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useUpdateCampaignStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Campaign>,
    unknown,
    { campaignId: number; data: UpdateCampaignStatusDto }
  >({
    mutationFn: ({ campaignId, data }) => updateCampaignStatus(campaignId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign status updated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
