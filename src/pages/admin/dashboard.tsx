import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import AdminLayout from './components/AdminLayout';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useDashboardSnapshotQuery } from '@/api/hooks/useDashboard';
import { formatCurrency } from '@/api/utils';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AdminDashboardPage = () => {
  const router = useRouter();
  const canRender = useProtectedRoute('/login', ['ADMIN']);
  const snapshotQuery = useDashboardSnapshotQuery();
  const snapshot = snapshotQuery.data;

  if (!canRender) {
    return null;
  }

  const metrics = [
    {
      label: 'Total users',
      value: snapshot?.totalUsers ?? 0,
      formatter: (value: number) => value.toLocaleString(),
    },
    {
      label: 'Total bookings',
      value: snapshot?.totalBookings ?? snapshot?.completedBookings ?? 0,
      formatter: (value: number) => value.toLocaleString(),
    },
    {
      label: 'Active spas',
      value: snapshot?.activeSpas ?? 0,
      formatter: (value: number) => value.toLocaleString(),
    },
    {
      label: 'Revenue',
      value: snapshot?.totalRevenue ?? 0,
      formatter: (value: number) => formatCurrency(value),
    },
  ];

  const bookingsTrend = snapshot?.bookingsTrend ?? [];
  const revenueBreakdown = snapshot?.revenueBreakdown ?? [];

  const trendOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#6366f1', '#f97316'],
    xaxis: {
      categories: bookingsTrend.map((item) => item.period),
      labels: {
        style: {
          colors: '#94a3b8',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#94a3b8',
        },
      },
    },
    grid: {
      borderColor: '#e2e8f0',
    },
    theme: { mode: 'light' },
  };

  const trendSeries = [
    {
      name: 'Bookings',
      data: bookingsTrend.map((item) => item.bookings ?? 0),
    },
    {
      name: 'Revenue',
      data: bookingsTrend.map((item) => item.revenue ?? 0),
    },
  ];

  const donutOptions = {
    chart: {
      type: 'donut',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
    },
    labels: revenueBreakdown.map((item) => item.label),
    colors: ['#6366f1', '#22d3ee', '#f97316', '#34d399', '#a855f7'],
    legend: {
      position: 'bottom',
      labels: { colors: '#94a3b8' },
    },
    dataLabels: { enabled: false },
    theme: { mode: 'light' },
  };

  const donutSeries = revenueBreakdown.map((item) => item.value);

  return (
    <AdminLayout
      title="Platform dashboard"
      subtitle="Monitor growth, approvals, marketing campaigns, and platform health at a glance."
    >
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {snapshotQuery.isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`metric-skeleton-${index}`}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900"
              >
                <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mt-4 h-8 w-32 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            ))
          : metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900"
              >
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">{metric.label}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
                  {metric.formatter(metric.value)}
                </p>
              </div>
            ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Bookings & revenue</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">12-week trend across the platform</p>
            </div>
          </div>
          <div className="mt-6">
            {bookingsTrend.length > 0 ? (
              <ApexChart options={trendOptions} series={trendSeries} type="area" height={320} />
            ) : (
              <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300">
                Trend data will appear once bookings start rolling in.
              </div>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue breakdown</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Track where revenue is generated.</p>
          <div className="mt-6">
            {revenueBreakdown.length > 0 ? (
              <ApexChart options={donutOptions} series={donutSeries} type="donut" height={320} />
            ) : (
              <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300">
                No breakdown data available yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Operational highlights</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-200">
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">{snapshot?.pendingPayouts ?? 0}</span>{' '}
              payouts pending review
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">{snapshot?.upcomingBookings ?? 0}</span>{' '}
              upcoming bookings in the next 7 days
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">{snapshot?.averageRating?.toFixed(1) ?? '0.0'}</span>{' '}
              average rating across all spas
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">{snapshot?.newUsersThisMonth ?? 0}</span>{' '}
              new users joined this month
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Next best actions</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Keep the marketplace healthy by acting on these quick wins.
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-navy-950/40">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Review pending spa approvals</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">Approve trusted partners faster to unlock new bookings.</p>
              <button
                type="button"
                onClick={() => router.push('/admin/spas')}
                className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
              >
                Go to spa queue
              </button>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-navy-950/40">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Launch a seasonal campaign</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">Boost conversions with timely offers for loyal guests.</p>
              <button
                type="button"
                onClick={() => router.push('/admin/campaigns')}
                className="mt-3 inline-flex items-center justify-center rounded-lg border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary/10 focus:outline-none focus:ring focus:ring-primary/40"
              >
                Manage campaigns
              </button>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
