'use client';

import EmptyState from '@/app/common/EmptyState';

const AdminBookingsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Marketplace bookings</h2>
      <EmptyState
        title="No anomalies detected"
        description="Live booking streams look healthy. Alerts will appear here if approval times spike or cancellations increase."
      />
    </div>
  );
};

export default AdminBookingsPage;
