import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import OwnerLayout from '../components/OwnerLayout';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useBookingsQuery, useCancelBookingMutation, useRescheduleBookingMutation } from '@/api/hooks/useBookings';
import type { Booking } from '@/api/types';
import { formatCurrency, formatDateTime } from '@/api/utils';
import { toast } from 'react-hot-toast';

const OwnerBookingsPage = () => {
  const canRender = useProtectedRoute('/owner/login', ['OWNER']);
  const router = useRouter();
  const querySpaId = useMemo(() => {
    const value = router.query.spaId;
    if (Array.isArray(value)) {
      return Number.parseInt(value[0] ?? '', 10);
    }
    if (typeof value === 'string') {
      return Number.parseInt(value, 10);
    }
    return undefined;
  }, [router.query.spaId]);

  const [spaIdInput, setSpaIdInput] = useState(querySpaId?.toString() ?? '');
  const [spaId, setSpaId] = useState<number | undefined>(querySpaId);
  const [rescheduleTarget, setRescheduleTarget] = useState<Booking | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (!canRender && !localStorage.getItem('access_token')) {
      void router.replace('/owner/login');
    }
  }, [canRender, router]);

  const hasSpaId = typeof spaId === 'number' && !Number.isNaN(spaId);

  const bookingsQuery = useBookingsQuery(hasSpaId ? { spaId } : undefined, {
    enabled: canRender && hasSpaId,
  });
  const bookings = bookingsQuery.data ?? [];

  const rescheduleMutation = useRescheduleBookingMutation(rescheduleTarget?.id ?? 0);
  const cancelMutation = useCancelBookingMutation(cancelTarget?.id ?? 0);

  const handleSelectSpa = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedId = Number.parseInt(spaIdInput, 10);
    if (!Number.isNaN(parsedId)) {
      setSpaId(parsedId);
      router.replace({ pathname: router.pathname, query: { spaId: parsedId } }, undefined, { shallow: true });
    }
  };

  const handleReschedule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rescheduleTarget) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const scheduledAt = String(formData.get('scheduledAt') ?? '');
    if (!scheduledAt) {
      toast.error('Select a new time');
      return;
    }
    rescheduleMutation.mutate(
      { scheduledAt },
      {
        onSuccess: () => {
          toast.success('Booking rescheduled');
          setRescheduleTarget(null);
        },
      },
    );
  };

  const handleCancel = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cancelTarget) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const reason = String(formData.get('reason') ?? '');
    cancelMutation.mutate(
      { reason },
      {
        onSuccess: () => {
          toast.success('Booking cancelled');
          setCancelTarget(null);
        },
      },
    );
  };

  if (!canRender) {
    return null;
  }

  return (
    <OwnerLayout
      title="Bookings"
      subtitle="Review upcoming appointments, adjust schedules, and keep guests informed."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleSelectSpa}>
          <div className="flex-1">
            <label htmlFor="spaId" className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Spa ID
            </label>
            <input
              id="spaId"
              name="spaId"
              type="number"
              value={spaIdInput}
              onChange={(event) => setSpaIdInput(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
          >
            Apply
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-navy-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-navy-900/60">
              <tr>
                <th className="px-6 py-4">Booking</th>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Scheduled</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600 dark:divide-slate-700 dark:text-slate-200">
              {bookingsQuery.isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm">
                    Loading bookings…
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm">
                    {hasSpaId
                      ? 'No bookings yet. Share your spa link to start receiving reservations.'
                      : 'Select a spa to review bookings.'}
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">#{booking.id}</div>
                      <div className="text-xs text-slate-500">{formatCurrency(booking.totalPrice ?? 0)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{booking.customer?.name ?? 'Walk-in guest'}</div>
                      <div className="text-xs text-slate-500">{booking.customer?.email ?? '—'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{booking.service?.name ?? 'Service TBD'}</div>
                      <div className="text-xs text-slate-500">{booking.locationType === 'AT_HOME' ? 'At home' : 'At spa'}</div>
                    </td>
                    <td className="px-6 py-4">{formatDateTime(booking.scheduledAt)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        {booking.status ?? 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-3">
                        <button
                          type="button"
                          className="text-xs font-semibold text-primary hover:underline"
                          onClick={() => setRescheduleTarget(booking)}
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          className="text-xs font-semibold text-rose-500 hover:underline"
                          onClick={() => setCancelTarget(booking)}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-navy-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Reschedule booking #{rescheduleTarget.id}</h2>
              <button type="button" onClick={() => setRescheduleTarget(null)} aria-label="Close" className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleReschedule}>
              <div>
                <label htmlFor="reschedule-time" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  New appointment time
                </label>
                <input
                  id="reschedule-time"
                  name="scheduledAt"
                  type="datetime-local"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRescheduleTarget(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring focus:ring-slate-200/60 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
                  disabled={rescheduleMutation.isLoading}
                >
                  {rescheduleMutation.isLoading ? 'Updating…' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-navy-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Cancel booking #{cancelTarget.id}</h2>
              <button type="button" onClick={() => setCancelTarget(null)} aria-label="Close" className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleCancel}>
              <div>
                <label htmlFor="cancel-reason" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Reason (optional)
                </label>
                <textarea
                  id="cancel-reason"
                  name="reason"
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-rose-400 focus:outline-none focus:ring focus:ring-rose-200/50 dark:border-slate-700 dark:bg-navy-800"
                  placeholder="Let the guest know why this appointment can’t go ahead"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCancelTarget(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring focus:ring-slate-200/60 dark:border-slate-700 dark:text-slate-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-rose-600 focus:outline-none focus:ring focus:ring-rose-400/40"
                  disabled={cancelMutation.isLoading}
                >
                  {cancelMutation.isLoading ? 'Cancelling…' : 'Confirm cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
};

export default OwnerBookingsPage;
