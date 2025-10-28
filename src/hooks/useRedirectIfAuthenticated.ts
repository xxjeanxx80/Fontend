import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getAccessToken } from '@/api/storage';
import { decodeAccessToken, getRoleHomePath, isTokenExpired } from '@/utils/auth';

export const useRedirectIfAuthenticated = (destination?: string) => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const token = getAccessToken();
    if (token) {
      const decoded = decodeAccessToken(token);
      if (!decoded || isTokenExpired(decoded)) {
        return;
      }
      const target = destination ?? getRoleHomePath(decoded.role ?? null);
      router.replace(target);
    }
  }, [destination, router]);
};
