import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { useRegisterMutation } from '@/api/hooks/useAuth';
import { persistAuthSession } from '@/api/auth.api';
import { extractErrorMessage } from '@/api/utils';
import { toast } from 'react-hot-toast';
import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated';

const CustomerRegisterPage = () => {
  const router = useRouter();
  useRedirectIfAuthenticated();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const registerMutation = useRegisterMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    registerMutation.mutate(
      { email, password, name, role: 'CUSTOMER' },
      {
        onSuccess: (response) => {
          persistAuthSession(response.data);
          toast.success('Account created successfully!');
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
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/60 dark:bg-navy-900 dark:shadow-none">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Create your Beauty Booking Hub account</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Start collecting loyalty points, saving favourite spas, and booking treatments in seconds.
          </p>
        </div>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Alex Nguyen"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:text-white"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:text-white"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:text-white"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:text-white"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerRegisterPage;
