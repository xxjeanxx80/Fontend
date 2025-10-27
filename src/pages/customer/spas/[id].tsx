import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import CustomerLayout from '../components/CustomerLayout';
import { useSpaQuery } from '@/api/hooks/useSpas';
import { useServicesQuery } from '@/api/hooks/useServices';
import { formatCurrency } from '@/api/utils';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const SpaDetailPage = () => {
  const router = useRouter();
  const canRender = useProtectedRoute();
  const spaId = useMemo(() => {
    const idParam = router.query.id;
    if (!idParam) {
      return undefined;
    }
    const parsed = Array.isArray(idParam) ? parseInt(idParam[0], 10) : parseInt(idParam, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, [router.query.id]);

  const spaQuery = useSpaQuery(spaId);
  const servicesQuery = useServicesQuery(spaId ? { spaId } : undefined);

  const spa = spaQuery.data;
  const services = servicesQuery.data ?? [];

  if (!canRender) {
    return null;
  }

  if (!spa) {
    return (
      <CustomerLayout title="Loading spa details">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-navy-900">
          Fetching spa information…
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout
      title={spa.name}
      subtitle={spa.shortDescription ?? spa.description ?? 'Explore services, reviews, and loyalty perks.'}
    >
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-navy-900">
        <div className="relative h-80 w-full">
          <Image
            src={spa.heroImageUrl ?? '/demo/customer/spa-detail-hero.png'}
            alt={spa.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        <div className="grid gap-8 p-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">About this spa</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {spa.description ?? 'Experience signature treatments delivered by certified therapists in a calming environment designed for modern lifestyles.'}
              </p>
              {spa.amenities && spa.amenities.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {spa.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
            </section>
            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Available services</h2>
              {servicesQuery.isLoading ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  ))}
                </div>
              ) : services.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">
                  Service information is being prepared. Check back soon for curated treatments.
                </p>
              ) : (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-navy-900"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{service.name}</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          {service.description ?? 'Revitalising session tailored to your preferences.'}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-primary">
                        {formatCurrency(service.price ?? 0)}
                      </div>
                      {service.duration && (
                        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Duration: {service.duration} mins
                        </div>
                      )}
                      <Link
                        href={{ pathname: '/customer/bookings/create', query: { spaId, serviceId: service.id } }}
                        className="mt-auto inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90"
                      >
                        Book this service
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
          <aside className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Location</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                {spa.address ?? [spa.city, spa.state, spa.country].filter(Boolean).join(', ') || 'Address coming soon'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Contact</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                {spa.contactPhone && <li>Phone: {spa.contactPhone}</li>}
                {spa.contactEmail && <li>Email: {spa.contactEmail}</li>}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Opening hours</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                {spa.openingHours ?? 'Mon–Sun · 09:00 – 21:00'}
              </p>
            </div>
            <Link
              href={{ pathname: '/customer/bookings/create', query: { spaId } }}
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90"
            >
              Book a visit
            </Link>
          </aside>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default SpaDetailPage;
