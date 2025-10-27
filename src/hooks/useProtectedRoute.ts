import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getAccessToken, getStoredUserProfile } from '@/api/storage';
import type { UserRole } from '@/api/types';

export const useProtectedRoute = (
  redirectTo = '/customer/login',
  allowedRoles?: UserRole[],
) => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const token = getAccessToken();
    const user = getStoredUserProfile();

    if (!token) {
      router.replace(redirectTo);
      setIsReady(false);
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      if (!user || !allowedRoles.includes(user.role)) {
        router.replace(redirectTo);
        setIsReady(false);
        return;
      }
    }

    setIsReady(true);
  }, [allowedRoles, redirectTo, router]);

  return isReady;
};
