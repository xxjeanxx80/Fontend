import Link from 'next/link';

const GoogleLoginPlaceholder = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 dark:bg-boxdark">
    <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl shadow-slate-200/60 dark:bg-navy-900 dark:shadow-none">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Google sign-in is coming soon</h1>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        We are finalising our Google OAuth integration to give you seamless one-tap access. In the meantime, sign
        in with your email address to continue exploring Beauty Booking Hub.
      </p>
      <Link
        href="/customer/login"
        className="mt-6 inline-flex items-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90"
      >
        Back to login
      </Link>
    </div>
  </div>
);

export default GoogleLoginPlaceholder;
