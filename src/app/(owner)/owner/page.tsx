'use client';

import StatCard from '@/app/components/StatCard';

const OwnerDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Active services" value="12" description="Available across all locations" />
        <StatCard label="Team members" value="18" description="Including therapists and receptionists" />
        <StatCard label="Monthly revenue" value="$42,800" description="Tracked for the current month" />
      </div>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Next steps</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>• Approve two pending at-home service requests</li>
          <li>• Invite new staff to manage weekend shifts</li>
          <li>• Publish loyalty campaign for repeat customers</li>
        </ul>
      </section>
    </div>
  );
};

export default OwnerDashboardPage;
