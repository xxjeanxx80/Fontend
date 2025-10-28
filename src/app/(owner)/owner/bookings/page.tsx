'use client';

import EmptyState from '@/app/common/EmptyState';

const OwnerBookingsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Bookings overview</h2>
      <EmptyState
        title="No booking data yet"
        description="When customers book at your spa, you will be able to approve or decline them here."
      />
    </div>
  );
};

export default OwnerBookingsPage;
