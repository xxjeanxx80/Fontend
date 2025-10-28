'use client';

import StatCard from '@/app/components/StatCard';
import EmptyState from '@/app/common/EmptyState';

const CustomerDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Upcoming bookings" value="3" description="Scheduled for the next two weeks" />
        <StatCard label="Loyalty points" value="1,280" description="You are 220 points away from Gold" />
        <StatCard label="Favourite spas" value="5" description="Reorder your go-to experiences" />
      </div>
      <EmptyState
        title="No recent activity"
        description="Bookings you make will appear here so you can manage reschedules, cancellations, and reviews."
      />
    </div>
  );
};

export default CustomerDashboardPage;
