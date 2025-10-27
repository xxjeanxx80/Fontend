import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getReports, resolveReport } from '../reports.api';
import type { ReportFilters, ResolveReportDto } from '../reports.api';
import type { ApiResponse, Report } from '../types';
import { extractErrorMessage } from '../utils';

export const useReports = (filters?: ReportFilters) =>
  useQuery<ApiResponse<Report[]>, unknown, Report[]>({
    queryKey: ['reports', filters],
    queryFn: () => getReports(filters),
    select: (response) => response.data,
  });

export const useResolveReportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Report>,
    unknown,
    { reportId: number; data: ResolveReportDto }
  >({
    mutationFn: ({ reportId, data }) => resolveReport(reportId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report resolved');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
