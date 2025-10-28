'use client';

import EmptyState from '@/app/common/EmptyState';

const CustomerBookingsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Your bookings</h2>
      <EmptyState
        title="No bookings yet"
        description="When you book a treatment the appointment details will live here for quick access."
      />
    </div>
  );
};

export default CustomerBookingsPage;
