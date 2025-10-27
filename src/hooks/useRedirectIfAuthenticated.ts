import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getAccessToken } from '@/api/storage';

export const useRedirectIfAuthenticated = (destination = '/customer/spas') => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const token = getAccessToken();
    if (token) {
      router.replace(destination);
    }
  }, [destination, router]);
};
