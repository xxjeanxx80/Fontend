import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAccessToken } from '@/api/storage';
import { decodeAccessToken, getRoleHomePath, isTokenExpired } from '@/utils/auth';

const LandingPage = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsChecking(false);
      return;
    }
    const decoded = decodeAccessToken(token);
    if (!decoded || isTokenExpired(decoded)) {
      setIsChecking(false);
      return;
    }
    router.replace(getRoleHomePath(decoded.role ?? null));
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-slate-100 to-white dark:from-navy-900 dark:via-navy-950 dark:to-black">
        <div className="flex flex-col items-center gap-3 text-slate-600 dark:text-slate-200">
          <span className="h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></span>
          <p className="text-sm font-medium">Preparing your personalised workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-slate-100 to-white px-4 py-16 dark:from-navy-900 dark:via-navy-950 dark:to-black">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <span className="mb-4 inline-flex rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary shadow-sm dark:bg-navy-900">
          Beauty Booking Hub
        </span>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
          One login for every Beauty Booking experience
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300">
          Manage spa appointments, oversee your spa business, or administer the Beauty Booking ecosystem from a single secure platform.
        </p>
        <div className="mt-10 grid w-full gap-6 md:grid-cols-3">
          <Link
            href="/login"
            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg dark:border-slate-800 dark:bg-navy-900"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">Customers</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Book your next self-care session</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Explore curated spas, manage bookings, and earn loyalty rewards tailored just for you.
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary group-hover:gap-1">
              Go to login →
            </span>
          </Link>
          <Link
            href="/login"
            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg dark:border-slate-800 dark:bg-navy-900"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">Spa Owners</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Grow and streamline your spa</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Update spa details, manage staff schedules, and keep bookings on track from the owner dashboard.
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary group-hover:gap-1">
              Go to login →
            </span>
          </Link>
          <Link
            href="/login"
            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg dark:border-slate-800 dark:bg-navy-900"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">Administrators</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Monitor the entire marketplace</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Review spa approvals, campaigns, and system health with real-time analytics.
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary group-hover:gap-1">
              Go to login →
            </span>
          </Link>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/customer/register" className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 font-medium text-primary transition hover:border-primary hover:bg-primary/10">
            Create a customer account
          </Link>
          <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-600 transition hover:border-primary hover:text-primary">
            Already onboard? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
