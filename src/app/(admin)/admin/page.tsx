'use client';

import StatCard from '@/app/components/StatCard';

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total users" value="8,532" description="Across customers, owners, and staff" />
        <StatCard label="Active bookings" value="412" description="Happening in the next 7 days" />
        <StatCard label="Pending spas" value="7" description="Awaiting approval" />
        <StatCard label="Support tickets" value="23" description="Needing response" />
      </div>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Platform health</h2>
        <p className="mt-2 text-sm text-slate-600">
          Monitor new registrations, track bookings per city, and keep payout operations running smoothly.
        </p>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
