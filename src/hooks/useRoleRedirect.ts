'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { getStoredRole } from '@/lib/auth';
import { DASHBOARD_PATHS, type Role } from '@/lib/constants';
import { useUser } from './useUser';

export const useRoleRedirect = () => {
  const router = useRouter();
  const { user } = useUser();

  return useCallback(
    (roleOverride?: Role | null) => {
      const role = roleOverride ?? user?.role ?? getStoredRole();

      if (!role) {
        router.replace('/signin');
        return;
      }

      const destination = DASHBOARD_PATHS[role];
      router.replace(destination);
    },
    [router, user?.role],
  );
};
