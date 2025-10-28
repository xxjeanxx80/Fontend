'use client';

import type { ReactNode } from 'react';

import { AuthProvider } from '@/hooks/useAuth';

export const Providers = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Providers;
