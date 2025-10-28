import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminTable, { AdminTableColumn } from '../components/AdminTable';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useSpasQuery } from '@/api/hooks/useSpas';
import { adminUpdateSpaApproval } from '@/api/spas.api';
import type { AdminUpdateSpaApprovalDto } from '@/api/spas.api';
import type { Spa } from '@/api/types';
import { toast } from 'react-hot-toast';
import { extractErrorMessage, formatDateTime } from '@/api/utils';

const AdminSpaApprovalsPage = () => {
  const canRender = useProtectedRoute('/login', ['ADMIN']);
  const queryClient = useQueryClient();
  const spaQuery = useSpasQuery({ status: 'PENDING' }, { enabled: canRender });

  const approvalMutation = useMutation({
    mutationFn: ({ spaId, payload }: { spaId: number; payload: AdminUpdateSpaApprovalDto }) =>
      adminUpdateSpaApproval(spaId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spas'] });
      toast.success('Spa approval updated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const handleApproval = useCallback(
    (spaId: number, isApproved: boolean) => {
      approvalMutation.mutate({ spaId, payload: { isApproved } });
    },
    [approvalMutation],
  );

  const columns: AdminTableColumn<Spa>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Spa',
        render: (spa) => (
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{spa.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-300">{spa.city ?? spa.address ?? '—'}</p>
          </div>
        ),
      },
      {
        key: 'ownerId',
        header: 'Owner',
        render: (spa) => spa.ownerId ?? '—',
      },
      {
        key: 'createdAt',
        header: 'Submitted',
        render: (spa) => (spa.createdAt ? formatDateTime(spa.createdAt) : '—'),
      },
      {
        key: 'isApproved',
        header: 'Status',
        render: (spa) => (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              spa.isApproved
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200'
            }`}
          >
            {spa.isApproved ? 'Approved' : 'Pending'}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (spa) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={approvalMutation.isPending}
              onClick={() => handleApproval(spa.id, true)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Approve
            </button>
            <button
              type="button"
              disabled={approvalMutation.isPending}
              onClick={() => handleApproval(spa.id, false)}
              className="rounded-lg border border-red-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-70 dark:text-red-300 dark:hover:bg-red-500/10"
            >
              Reject
            </button>
          </div>
        ),
      },
    ],
    [approvalMutation.isPending, handleApproval],
  );

  if (!canRender) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  return (
    <AdminLayout
      title="Spa approvals"
      subtitle="Review and approve new spa submissions before they go live on the marketplace."
    >
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Pending spas</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Approve trusted spas quickly to unlock revenue, or reject submissions that don&apos;t meet brand standards.
          </p>
        </div>
        <AdminTable
          data={spaQuery.data}
          columns={columns}
          isLoading={spaQuery.isLoading}
          emptyMessage="No pending spas right now"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminSpaApprovalsPage;
