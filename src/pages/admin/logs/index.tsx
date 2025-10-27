import { useMemo, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminTable, { AdminTableColumn } from '../components/AdminTable';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAdminLogs } from '@/api/hooks/useAdminLogs';
import type { AdminLog } from '@/api/types';
import { formatDateTime } from '@/api/utils';

const levelLabels: Record<string, string> = {
  INFO: 'Info',
  WARN: 'Warning',
  ERROR: 'Error',
};

const levelStyles: Record<string, string> = {
  INFO: 'bg-slate-200 text-slate-700 dark:bg-slate-700/60 dark:text-slate-200',
  WARN: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
  ERROR: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
};

const AdminLogsPage = () => {
  const canRender = useProtectedRoute('/customer/login', ['ADMIN']);
  const [levelFilter, setLevelFilter] = useState<string>('');
  const logsQuery = useAdminLogs(levelFilter ? { level: levelFilter, limit: 100 } : { limit: 100 });

  const columns: AdminTableColumn<AdminLog>[] = useMemo(
    () => [
      {
        key: 'createdAt',
        header: 'Timestamp',
        render: (log) => formatDateTime(log.createdAt),
      },
      {
        key: 'level',
        header: 'Level',
        render: (log) => (
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${levelStyles[log.level] ?? levelStyles.INFO}`}>
            {levelLabels[log.level] ?? log.level}
          </span>
        ),
      },
      {
        key: 'message',
        header: 'Message',
        render: (log) => (
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-200">{log.message}</p>
            {log.context && <p className="text-xs text-slate-500 dark:text-slate-300">{log.context}</p>}
          </div>
        ),
      },
      {
        key: 'actorEmail',
        header: 'Actor',
        render: (log) => log.actorEmail ?? 'System',
      },
    ],
    [],
  );

  if (!canRender) {
    return null;
  }

  return (
    <AdminLayout title="System logs" subtitle="Review platform events for auditing and monitoring.">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-navy-900 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Activity feed</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Filter by level to focus on warnings and errors when troubleshooting.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="log-level" className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Level
            </label>
            <select
              id="log-level"
              value={levelFilter}
              onChange={(event) => setLevelFilter(event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100"
            >
              <option value="">All</option>
              <option value="INFO">Info</option>
              <option value="WARN">Warning</option>
              <option value="ERROR">Error</option>
            </select>
          </div>
        </div>
        <AdminTable
          data={logsQuery.data}
          columns={columns}
          isLoading={logsQuery.isLoading}
          emptyMessage="No logs found for the selected filter."
        />
      </div>
    </AdminLayout>
  );
};

export default AdminLogsPage;
