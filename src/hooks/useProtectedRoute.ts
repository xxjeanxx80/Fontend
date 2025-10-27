import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getAccessToken } from '@/api/storage';

export const useProtectedRoute = (redirectTo = '/customer/login') => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const token = getAccessToken();
    if (!token) {
      router.replace(redirectTo);
    }
    setIsReady(Boolean(token));
  }, [redirectTo, router]);

  return isReady;
};
