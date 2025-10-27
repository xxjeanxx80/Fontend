import Link from 'next/link';
import OwnerLayout from './components/OwnerLayout';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useDashboardSnapshotQuery } from '@/api/hooks/useDashboard';
import { formatCurrency } from '@/api/utils';

const OwnerDashboardPage = () => {
  const canRender = useProtectedRoute('/customer/login', ['OWNER']);
  const snapshotQuery = useDashboardSnapshotQuery();
  const snapshot = snapshotQuery.data;

  if (!canRender) {
    return null;
  }

  return (
    <OwnerLayout
      title="Owner dashboard"
      subtitle="Track your spa performance, keep tabs on bookings, and stay on top of payouts."
    >
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {snapshotQuery.isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`metric-skeleton-${index}`}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900"
            >
              <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-4 h-8 w-32 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          ))
        ) : (
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Total revenue</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
                {formatCurrency(snapshot?.totalRevenue ?? 0)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Completed bookings</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
                {snapshot?.completedBookings ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Average rating</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
                {(snapshot?.averageRating ?? 0).toFixed(1)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Pending payouts</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
                {snapshot?.pendingPayouts ?? 0}
              </p>
            </div>
          </>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Next steps</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Keep the momentum going with these quick actions.
          </p>
          <div className="mt-6 space-y-4">
            <Link
              href="/owner/spa"
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
            >
              <span>Update your spa profile</span>
              <span className="text-xs uppercase tracking-wide">View</span>
            </Link>
            <Link
              href="/owner/services"
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
            >
              <span>Refresh your service menu</span>
              <span className="text-xs uppercase tracking-wide">Manage</span>
            </Link>
            <Link
              href="/owner/staff"
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
            >
              <span>Assign this week&apos;s shifts</span>
              <span className="text-xs uppercase tracking-wide">Plan</span>
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Booking insights</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Get ready for upcoming guests and keep cancellations low.
          </p>
          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-slate-500">Upcoming bookings</dt>
              <dd className="text-base font-semibold text-slate-900 dark:text-white">{snapshot?.upcomingBookings ?? 0}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-slate-500">Completion rate</dt>
              <dd className="text-base font-semibold text-slate-900 dark:text-white">
                {snapshot && snapshot.completedBookings > 0
                  ? `${snapshot.completedBookings} completed`
                  : 'Awaiting data'}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </OwnerLayout>
  );
};

export default OwnerDashboardPage;
