import type { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { createQueryClient } from '@/api/queryClient';
import '@/app/globals.css';

export default function BeautyBookingCustomerApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <Toaster position="top-right" toastOptions={{ className: 'bg-white text-slate-900 dark:bg-boxdark dark:text-white' }} />
    </QueryClientProvider>
  );
}
