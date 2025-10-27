import { FormEvent, useMemo, useState } from 'react';
import CustomerLayout from '../components/CustomerLayout';
import { useBookingsQuery } from '@/api/hooks/useBookings';
import { useCreateFeedbackMutation } from '@/api/hooks/useFeedbacks';
import { useStoredUser } from '@/hooks/useStoredUser';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { extractErrorMessage, formatDateTime } from '@/api/utils';
import { toast } from 'react-hot-toast';

const FeedbackPage = () => {
  const canRender = useProtectedRoute();
  const user = useStoredUser();
  const bookingsQuery = useBookingsQuery(user?.id ? { customerId: user.id } : undefined);
  const bookings = useMemo(
    () => (bookingsQuery.data ?? []).filter((booking) => booking.status === 'COMPLETED'),
    [bookingsQuery.data],
  );

  const [bookingId, setBookingId] = useState<number | undefined>();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const feedbackMutation = useCreateFeedbackMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id || !bookingId) {
      toast.error('Select a completed booking to share feedback.');
      return;
    }

    feedbackMutation.mutate(
      {
        bookingId,
        customerId: user.id,
        rating,
        comment: comment || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Thank you for sharing your experience!');
          setComment('');
          setBookingId(undefined);
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

  return (
    <CustomerLayout
      title="Share feedback"
      subtitle="Help spas deliver unforgettable experiences and earn bonus loyalty points for every review."
    >
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900"
      >
        <div>
          <label htmlFor="booking" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Choose a completed booking
          </label>
          <select
            id="booking"
            className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
            value={bookingId ?? ''}
            onChange={(event) => setBookingId(event.target.value ? Number(event.target.value) : undefined)}
            disabled={bookingsQuery.isLoading}
          >
            <option value="">Select booking</option>
            {bookings.map((booking) => (
              <option key={booking.id} value={booking.id}>
                #{booking.id} · {booking.spa?.name ?? 'Unknown spa'} · {formatDateTime(booking.scheduledAt)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Rating</label>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${
                  rating >= value
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-300'
                }`}
                onClick={() => setRating(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="comment" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Your experience
          </label>
          <textarea
            id="comment"
            rows={5}
            placeholder="Tell us what you loved and what could be better."
            className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={feedbackMutation.isPending}
        >
          {feedbackMutation.isPending ? 'Submitting…' : 'Submit feedback'}
        </button>
      </form>
    </CustomerLayout>
  );
};

export default FeedbackPage;
