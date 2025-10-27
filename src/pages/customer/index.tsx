import Image from 'next/image';
import Link from 'next/link';
import CustomerLayout from './components/CustomerLayout';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const CustomerHomePage = () => {
  const canRender = useProtectedRoute();

  if (!canRender) {
    return null;
  }

  return (
    <CustomerLayout
      title="Discover your next beauty experience"
      subtitle="Browse curated spas, book personalised treatments, and earn rewards with every visit."
    >
      <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col justify-center gap-6">
          <div className="rounded-2xl bg-white p-6 shadow-md shadow-slate-200/60 dark:bg-navy-900 dark:shadow-none">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Tailored treatments at your fingertips
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Explore premium spas near you, discover trending services, and schedule visits that match your
              routine. Our curated recommendations keep wellness effortless and fun.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/customer/spas"
                className="inline-flex items-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90"
              >
                Explore spas
              </Link>
              <Link
                href="/customer/bookings/create"
                className="inline-flex items-center rounded-lg border border-primary px-5 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
              >
                Book now
              </Link>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-navy-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Exclusive offers</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Unlock seasonal campaigns, flash sales, and loyalty bonuses tailored to your favourite spas.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-navy-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Flexible bookings</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Seamlessly reschedule or cancel appointments with instant confirmations and smart reminders.
              </p>
            </div>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
          <Image
            src="/demo/customer/hero.png"
            alt="Beauty Booking Hub customer"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </section>
    </CustomerLayout>
  );
};

export default CustomerHomePage;
