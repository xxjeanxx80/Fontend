import Link from 'next/link';
import CustomerLayout from '../components/CustomerLayout';
import { useBookingsQuery } from '@/api/hooks/useBookings';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useStoredUser } from '@/hooks/useStoredUser';
import { formatCurrency, formatDateTime } from '@/api/utils';

const BookingHistoryPage = () => {
  const canRender = useProtectedRoute();
  const user = useStoredUser();
  const bookingsQuery = useBookingsQuery(user?.id ? { customerId: user.id } : undefined);
  const bookings = bookingsQuery.data ?? [];

  if (!canRender) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  return (
    <CustomerLayout
      title="My bookings"
      subtitle="Review upcoming appointments, manage changes, and relive your favourite spa moments."
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-navy-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-4">Booking</th>
                <th className="px-6 py-4">Date &amp; time</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Staff</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600 dark:divide-slate-700 dark:text-slate-200">
              {bookingsQuery.isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm">
                    Loading your bookings…
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm">
                    You haven’t booked a treatment yet.{' '}
                    <Link href="/customer/spas" className="font-semibold text-primary hover:underline">
                      Explore spas
                    </Link>{' '}
                    to plan your first visit.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">#{booking.id}</div>
                      <div className="text-xs text-slate-500">
                        {booking.spa?.name ?? 'Unknown spa'}
                      </div>
                    </td>
                    <td className="px-6 py-4">{formatDateTime(booking.scheduledAt)}</td>
                    <td className="px-6 py-4">
                      <div>{booking.service?.name ?? 'Service TBD'}</div>
                      {booking.locationType && (
                        <div className="text-xs text-slate-500">{booking.locationType === 'AT_HOME' ? 'At home' : 'At spa'}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">{booking.staff?.name ?? 'Assigned soon'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        {booking.status ?? 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatCurrency(booking.totalPrice ?? 0)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-3">
                        <Link
                          href={`/customer/bookings/${booking.id}/reschedule`}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Reschedule
                        </Link>
                        <Link
                          href={`/customer/bookings/${booking.id}/cancel`}
                          className="text-xs font-semibold text-rose-500 hover:underline"
                        >
                          Cancel
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default BookingHistoryPage;
