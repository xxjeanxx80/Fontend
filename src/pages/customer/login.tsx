import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { useLoginMutation } from '@/api/hooks/useAuth';
import { persistAuthSession } from '@/api/auth.api';
import { extractErrorMessage } from '@/api/utils';
import { toast } from 'react-hot-toast';
import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated';

const CustomerLoginPage = () => {
  const router = useRouter();
  useRedirectIfAuthenticated();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useLoginMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (response) => {
          persistAuthSession(response.data);
          toast.success('Welcome back!');
          router.push('/customer/spas');
        },
        onError: (error) => {
          toast.error(extractErrorMessage(error));
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 dark:bg-boxdark">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/60 dark:bg-navy-900 dark:shadow-none">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Sign in to Beauty Booking Hub</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Access your personalised spa recommendations and manage your bookings effortlessly.
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:text-white"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:text-white"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <div className="mt-6 space-y-3">
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:text-slate-200"
            onClick={() => router.push('/customer/login/google')}
          >
            Continue with Google
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:text-slate-200"
            onClick={() => router.push('/customer/login/facebook')}
          >
            Continue with Facebook
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Don’t have an account?{' '}
          <Link href="/customer/register" className="font-semibold text-primary hover:underline">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
