import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../components/CustomerLayout';
import { useSpasQuery } from '@/api/hooks/useSpas';
import { useServicesQuery } from '@/api/hooks/useServices';
import { useStaffQuery } from '@/api/hooks/useStaff';
import { useCreateBookingMutation } from '@/api/hooks/useBookings';
import { extractErrorMessage, formatDateTime } from '@/api/utils';
import { toast } from 'react-hot-toast';
import { useStoredUser } from '@/hooks/useStoredUser';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const CreateBookingPage = () => {
  const router = useRouter();
  const canRender = useProtectedRoute();
  const user = useStoredUser();

  const spaIdFromQuery = useMemo(() => {
    const spaParam = router.query.spaId;
    if (!spaParam) {
      return undefined;
    }
    const parsed = Array.isArray(spaParam) ? parseInt(spaParam[0], 10) : parseInt(spaParam, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, [router.query.spaId]);

  const serviceIdFromQuery = useMemo(() => {
    const serviceParam = router.query.serviceId;
    if (!serviceParam) {
      return undefined;
    }
    const parsed = Array.isArray(serviceParam) ? parseInt(serviceParam[0], 10) : parseInt(serviceParam, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, [router.query.serviceId]);

  const [selectedSpa, setSelectedSpa] = useState<number | undefined>(spaIdFromQuery);
  const [selectedService, setSelectedService] = useState<number | undefined>(serviceIdFromQuery);
  const [selectedStaff, setSelectedStaff] = useState<number | undefined>();
  const [scheduledAt, setScheduledAt] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [notes, setNotes] = useState('');
  const [locationType, setLocationType] = useState<'AT_SPA' | 'AT_HOME'>('AT_SPA');

  const spasQuery = useSpasQuery();
  const servicesQuery = useServicesQuery(selectedSpa ? { spaId: selectedSpa } : undefined);
  const staffQuery = useStaffQuery(selectedSpa ? { spaId: selectedSpa } : undefined);

  const createBookingMutation = useCreateBookingMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id) {
      toast.error('You need to be logged in to create a booking.');
      router.push('/login');
      return;
    }
    if (!selectedSpa || !selectedService || !scheduledAt) {
      toast.error('Please select a spa, service, and appointment time.');
      return;
    }

    createBookingMutation.mutate(
      {
        spaId: selectedSpa,
        serviceId: selectedService,
        customerId: user.id,
        staffId: selectedStaff,
        scheduledAt,
        couponCode: couponCode || undefined,
        notes: [notes, locationType === 'AT_HOME' ? 'Location: at-home service' : 'Location: at-spa service']
          .filter(Boolean)
          .join(' · '),
      },
      {
        onSuccess: (response) => {
          toast.success('Booking created successfully!');
          const scheduledTime = response.data?.scheduledAt;
          if (scheduledTime) {
            toast.success(`See you on ${formatDateTime(scheduledTime)} ✨`);
          }
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

  return (
    <CustomerLayout
      title="Book a treatment"
      subtitle="Select your spa, treatment, and preferred specialist in just a few taps."
    >
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="spa" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Spa
            </label>
            <select
              id="spa"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
              value={selectedSpa ?? ''}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedSpa(value ? Number(value) : undefined);
                setSelectedService(undefined);
                setSelectedStaff(undefined);
              }}
            >
              <option value="">Select a spa</option>
              {(spasQuery.data ?? []).map((spa) => (
                <option key={spa.id} value={spa.id}>
                  {spa.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="service" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Service
            </label>
            <select
              id="service"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
              value={selectedService ?? ''}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedService(value ? Number(value) : undefined);
              }}
            >
              <option value="">Select a service</option>
              {(servicesQuery.data ?? []).map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="staff" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Preferred staff
            </label>
            <select
              id="staff"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
              value={selectedStaff ?? ''}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedStaff(value ? Number(value) : undefined);
              }}
            >
              <option value="">Let the spa assign</option>
              {(staffQuery.data ?? []).map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="scheduledAt" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Appointment time
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
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Service mode</label>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="radio"
                  name="locationType"
                  value="AT_SPA"
                  checked={locationType === 'AT_SPA'}
                  onChange={() => setLocationType('AT_SPA')}
                />
                At spa
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="radio"
                  name="locationType"
                  value="AT_HOME"
                  checked={locationType === 'AT_HOME'}
                  onChange={() => setLocationType('AT_HOME')}
                />
                At home
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="coupon" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Coupon code
            </label>
            <input
              id="coupon"
              type="text"
              placeholder="SUMMERGLOW"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Notes for the spa
          </label>
          <textarea
            id="notes"
            rows={4}
            placeholder="Let us know about any special requests, allergies, or preferred ambiance."
            className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={createBookingMutation.isPending}
        >
          {createBookingMutation.isPending ? 'Scheduling…' : 'Confirm booking'}
        </button>
      </form>
    </CustomerLayout>
  );
};

export default CreateBookingPage;
