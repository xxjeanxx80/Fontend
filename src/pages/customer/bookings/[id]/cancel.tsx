import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/CustomerLayout';
import { useBookingQuery, useCancelBookingMutation } from '@/api/hooks/useBookings';
import { extractErrorMessage, formatDateTime } from '@/api/utils';
import { toast } from 'react-hot-toast';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const CancelBookingPage = () => {
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
  const [reason, setReason] = useState('');

  const cancelMutation = useCancelBookingMutation(bookingId ?? 0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!bookingId) {
      return;
    }

    cancelMutation.mutate(
      { reason: reason || undefined },
      {
        onSuccess: () => {
          toast.success('Booking cancelled successfully.');
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
      title={`Cancel booking #${booking.id}`}
      subtitle={`This appointment is scheduled on ${formatDateTime(booking.scheduledAt)} at ${booking.spa?.name ?? 'your selected spa'}.`}
    >
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-2xl border border-rose-200 bg-white p-6 shadow-sm dark:border-rose-900 dark:bg-navy-900"
      >
        <div>
          <label htmlFor="reason" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Cancellation reason (optional)
          </label>
          <textarea
            id="reason"
            rows={4}
            placeholder="Tell us why you need to cancel so we can improve future experiences."
            className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>
        <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600 dark:bg-rose-900/30 dark:text-rose-200">
          <p className="font-semibold">Heads up:</p>
          <p className="mt-1">
            Cancelling within 24 hours of your appointment may be subject to spa-specific policies. Reach out to the spa if you
            need assistance.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:text-slate-300"
          >
            Go back
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-rose-600 focus:outline-none focus:ring focus:ring-rose-400/60 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? 'Cancelling…' : 'Confirm cancellation'}
          </button>
        </div>
      </form>
    </CustomerLayout>
  );
};

export default CancelBookingPage;
