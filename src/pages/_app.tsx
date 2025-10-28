import type { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import { createQueryClient } from '@/api/queryClient';
import { RoleGuard } from '@/components/RoleGuard';
import type { UserRole } from '@/api/types';
import '@/app/globals.css';

export default function BeautyBookingCustomerApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => createQueryClient());
  const router = useRouter();

  const guardRoles = useMemo(() => {
    const path = router.pathname;
    const unguarded = new Set([
      '/customer/register',
      '/customer/login',
      '/customer/login/google',
      '/customer/login/facebook',
    ]);
    if (unguarded.has(path)) {
      return null;
    }

    const mappings: Array<{ prefix: string; roles: UserRole[] }> = [
      { prefix: '/customer', roles: ['CUSTOMER'] },
      { prefix: '/owner', roles: ['OWNER'] },
      { prefix: '/admin', roles: ['ADMIN'] },
    ];

    const match = mappings.find(({ prefix }) => path === prefix || path.startsWith(`${prefix}/`));
    return match?.roles ?? null;
  }, [router.pathname]);

  const content = guardRoles ? (
    <RoleGuard allowedRoles={guardRoles}>
      <Component {...pageProps} />
    </RoleGuard>
  ) : (
    <Component {...pageProps} />
  );

  return (
    <QueryClientProvider client={queryClient}>
      {content}
      <Toaster position="top-right" toastOptions={{ className: 'bg-white text-slate-900 dark:bg-boxdark dark:text-white' }} />
    </QueryClientProvider>
  );
}
