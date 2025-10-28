import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <span className="mb-4 inline-flex rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 shadow-sm">
          Beauty Booking Hub
        </span>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
          One login for every Beauty Booking experience
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600">
          Manage spa appointments, oversee your spa business, or administer the Beauty Booking ecosystem from a single secure platform.
        </p>
        <div className="mt-10 grid w-full gap-6 md:grid-cols-3">
          <Link
            href="/signin"
            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-500/80">Customers</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Book your next self-care session</h2>
            <p className="mt-3 text-sm text-slate-600">
              Explore curated spas, manage bookings, and earn loyalty rewards tailored just for you.
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 group-hover:gap-1">
              Sign in →
            </span>
          </Link>
          <Link
            href="/signin"
            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-500/80">Spa Owners</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Grow and streamline your spa</h2>
            <p className="mt-3 text-sm text-slate-600">
              Update spa details, manage staff schedules, and keep bookings on track from the owner dashboard.
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 group-hover:gap-1">
              Sign in →
            </span>
          </Link>
          <Link
            href="/signin"
            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-500/80">Administrators</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Monitor the entire marketplace</h2>
            <p className="mt-3 text-sm text-slate-600">
              Review spa approvals, campaigns, and system health with real-time analytics.
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 group-hover:gap-1">
              Sign in →
            </span>
          </Link>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-blue-100 px-4 py-2 font-medium text-blue-600 transition hover:border-blue-500 hover:bg-blue-50">
            Create a customer account
          </Link>
          <Link href="/signin" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-600 transition hover:border-blue-500 hover:text-blue-600">
            Already onboard? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
