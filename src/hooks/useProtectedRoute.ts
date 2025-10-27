import { useEffect, useState } from 'react';
import type { UserRole } from '@/api/types';
import { useRoleGuard } from './useRoleGuard';

export const useProtectedRoute = (
  _redirectTo = '/login',
  allowedRoles?: UserRole[],
) => {
  void _redirectTo;
  const [isReady, setIsReady] = useState(typeof window === 'undefined');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsReady(true);
    }
  }, []);

  const { isAuthorized, isLoading } = useRoleGuard(allowedRoles ?? [], { suppressToasts: true });
  return isReady && !isLoading && isAuthorized;
};
