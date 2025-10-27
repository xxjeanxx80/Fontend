import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/CustomerLayout';
import { useBookingQuery, useRescheduleBookingMutation } from '@/api/hooks/useBookings';
import { extractErrorMessage, formatDateTime } from '@/api/utils';
import { toast } from 'react-hot-toast';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const RescheduleBookingPage = () => {
  const router = useRouter();
  const canRender = useProtectedRoute();
  const bookingId = useMemo(() => {
    const idParam = router.query.id;
    if (!idParam) {
      return undefined;
    }
    const parsed = Array.isArray(idParam) ? parseInt(idParam[0], 10) : parseInt(idParam, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, [router.query.id]);

  const bookingQuery = useBookingQuery(bookingId);
  const booking = bookingQuery.data;
  const [scheduledAt, setScheduledAt] = useState('');

  const rescheduleMutation = useRescheduleBookingMutation(bookingId ?? 0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!bookingId) {
      return;
    }
    if (!scheduledAt) {
      toast.error('Choose a new appointment time.');
      return;
    }

    rescheduleMutation.mutate(
      { scheduledAt },
      {
        onSuccess: (response) => {
          toast.success('Booking rescheduled successfully.');
          toast.success(`New time: ${formatDateTime(response.data?.scheduledAt ?? scheduledAt)}`);
          router.push('/customer/bookings');
        },
        onError: (error) => {
          toast.error(extractErrorMessage(error));
        },
      },
    );
  };

  if (!canRender) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  if (!booking) {
    return (
      <CustomerLayout title="Loading booking details">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-navy-900">
          Fetching booking information…
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout
      title={`Reschedule booking #${booking.id}`}
      subtitle={`Original appointment on ${formatDateTime(booking.scheduledAt)} at ${booking.spa?.name ?? 'your selected spa'}.`}
    >
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900"
      >
        <div>
          <label htmlFor="scheduledAt" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            New appointment time
          </label>
          <input
            id="scheduledAt"
            type="datetime-local"
            className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={rescheduleMutation.isPending}
        >
          {rescheduleMutation.isPending ? 'Updating…' : 'Confirm new time'}
        </button>
      </form>
    </CustomerLayout>
  );
};

export default RescheduleBookingPage;
