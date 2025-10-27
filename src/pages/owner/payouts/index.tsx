import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import OwnerLayout from '../components/OwnerLayout';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { usePayoutsQuery } from '@/api/hooks/usePayouts';
import { formatCurrency, formatDateTime } from '@/api/utils';

const statusLabels: Record<string, string> = {
  REQUESTED: 'Requested',
  APPROVED: 'Approved',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
};

const OwnerPayoutsPage = () => {
  const canRender = useProtectedRoute('/customer/login');
  const router = useRouter();
  const querySpaId = useMemo(() => {
    const value = router.query.spaId;
    if (Array.isArray(value)) {
      return Number.parseInt(value[0] ?? '', 10);
    }
    if (typeof value === 'string') {
      return Number.parseInt(value, 10);
    }
    return undefined;
  }, [router.query.spaId]);

  const [spaIdInput, setSpaIdInput] = useState(querySpaId?.toString() ?? '');
  const [spaId, setSpaId] = useState<number | undefined>(querySpaId);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const payoutsQuery = usePayoutsQuery({ spaId, status: statusFilter || undefined });
  const payouts = payoutsQuery.data ?? [];

  const totalPending = payouts
    .filter((payout) => payout.status === 'REQUESTED' || payout.status === 'APPROVED')
    .reduce((acc, payout) => acc + payout.amount, 0);

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedId = Number.parseInt(spaIdInput, 10);
    if (!Number.isNaN(parsedId)) {
      setSpaId(parsedId);
      router.replace({ pathname: router.pathname, query: parsedId ? { spaId: parsedId } : undefined }, undefined, {
        shallow: true,
      });
    } else {
      setSpaId(undefined);
      router.replace({ pathname: router.pathname }, undefined, { shallow: true });
    }
  };

  if (!canRender) {
    return null;
  }

  return (
    <OwnerLayout
      title="Payouts"
      subtitle="Track settlement requests, approval progress, and completed transfers."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
        <form className="grid gap-4 md:grid-cols-4" onSubmit={handleFilterSubmit}>
          <div className="md:col-span-2">
            <label htmlFor="spaId" className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Spa ID
            </label>
            <input
              id="spaId"
              name="spaId"
              type="number"
              value={spaIdInput}
              onChange={(event) => setSpaIdInput(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
            />
          </div>
          <div>
            <label htmlFor="status" className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
            >
              <option value="">All</option>
              <option value="REQUESTED">Requested</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
            >
              Apply filters
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent payouts</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Monitor cash flow to keep operations running smoothly.
            </p>
          </div>
          <div className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Pending amount: {formatCurrency(totalPending)}
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-navy-900/60">
              <tr>
                <th className="px-6 py-4">Payout</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Requested</th>
                <th className="px-6 py-4">Processed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600 dark:divide-slate-700 dark:text-slate-200">
              {payoutsQuery.isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm">
                    Loading payouts…
                  </td>
                </tr>
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm">
                    {spaId ? 'No payout records yet.' : 'Filter by spa to view payout history.'}
                  </td>
                </tr>
              ) : (
                payouts.map((payout) => (
                  <tr key={payout.id}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">#{payout.id}</div>
                      <div className="text-xs text-slate-500">Spa #{payout.spaId ?? '—'}</div>
                    </td>
                    <td className="px-6 py-4">{formatCurrency(payout.amount)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          payout.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
                            : payout.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {statusLabels[payout.status] ?? payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatDateTime(payout.requestedAt)}</td>
                    <td className="px-6 py-4">{formatDateTime(payout.processedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </OwnerLayout>
  );
};

export default OwnerPayoutsPage;
