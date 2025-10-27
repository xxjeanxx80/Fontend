import { FormEvent, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminManagementTabs from '../components/AdminManagementTabs';
import AdminModal from '../components/AdminModal';
import AdminTable, { AdminTableColumn } from '../components/AdminTable';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useReports, useResolveReportMutation } from '@/api/hooks/useReports';
import type { Report } from '@/api/types';
import { formatDateTime } from '@/api/utils';

const statusStyles: Record<string, string> = {
  OPEN: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
  IN_REVIEW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200',
  RESOLVED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
};

const AdminReportsPage = () => {
  const canRender = useProtectedRoute('/login', ['ADMIN']);
  const reportsQuery = useReports();
  const resolveMutation = useResolveReportMutation();

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const openResolveModal = (report: Report) => {
    setSelectedReport(report);
    setResolutionNotes(report.notes ?? '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setResolutionNotes('');
    setModalOpen(false);
  };

  const handleResolve = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedReport) {
      return;
    }
    resolveMutation.mutate(
      { reportId: selectedReport.id, data: { notes: resolutionNotes || undefined } },
      {
        onSuccess: closeModal,
      },
    );
  };

  const columns: AdminTableColumn<Report>[] = [
    {
      key: 'targetType',
      header: 'Target',
      render: (report) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{report.targetType}</p>
          <p className="text-xs text-slate-500 dark:text-slate-300">ID: {report.targetId}</p>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (report) => (
        <div>
          <p className="text-sm text-slate-700 dark:text-slate-200">{report.reason}</p>
          {report.reporterName && (
            <p className="text-xs text-slate-500 dark:text-slate-300">Reported by {report.reporterName}</p>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (report) => formatDateTime(report.createdAt),
    },
    {
      key: 'status',
      header: 'Status',
      render: (report) => (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[report.status ?? 'OPEN'] ?? statusStyles.OPEN}`}>
          {report.status ?? 'OPEN'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (report) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openResolveModal(report)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring focus:ring-primary/40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Resolve
          </button>
        </div>
      ),
    },
  ];

  if (!canRender) {
    return null;
  }

  return (
    <AdminLayout title="Reports" subtitle="Monitor abuse reports, track follow-ups, and close the loop with notes.">
      <div className="space-y-6">
        <AdminManagementTabs />
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Community reports</h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Review feedback from guests and spa owners. Add resolution notes to keep stakeholders informed.
          </p>
        </div>
        <AdminTable
          data={reportsQuery.data}
          columns={columns}
          isLoading={reportsQuery.isLoading}
          emptyMessage="No reports at the moment."
        />
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Resolve report"
        description={selectedReport ? `Add context for resolving the report about ${selectedReport.targetType}.` : ''}
        footer={
          <>
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring focus:ring-primary/40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="resolve-report-form"
              disabled={resolveMutation.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Mark as resolved
            </button>
          </>
        }
      >
        <form id="resolve-report-form" onSubmit={handleResolve} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Resolution notes</label>
            <textarea
              rows={4}
              value={resolutionNotes}
              onChange={(event) => setResolutionNotes(event.target.value)}
              placeholder="Share what happened and how the team responded."
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100"
            />
          </div>
        </form>
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminReportsPage;
