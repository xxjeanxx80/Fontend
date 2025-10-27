import Link from 'next/link';

const FacebookLoginPlaceholder = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 dark:bg-boxdark">
    <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl shadow-slate-200/60 dark:bg-navy-900 dark:shadow-none">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Facebook login is almost ready</h1>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        Our engineering team is connecting Facebook for a smooth social login experience. Please use your email and
        password today while we polish the final touches.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-flex items-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90"
      >
        Back to login
      </Link>
    </div>
  </div>
);

export default FacebookLoginPlaceholder;
