import type { Metadata } from 'next';
import { Suspense } from 'react';

import './globals.css';
import Providers from './common/Providers';

export const metadata: Metadata = {
  title: 'Beauty Booking Hub',
  description: 'Unified customer, owner, and admin portal for the Beauty Booking Hub marketplace.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading…</div>}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
