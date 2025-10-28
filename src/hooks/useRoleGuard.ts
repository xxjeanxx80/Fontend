import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import type { UserRole } from '@/api/types';
import { clearAuthStorage, getAccessToken } from '@/api/storage';
import { decodeAccessToken, getRoleHomePath, isTokenExpired } from '@/utils/auth';

export interface UseRoleGuardResult {
  role: UserRole | null;
  isAuthorized: boolean;
  isLoading: boolean;
}

export interface UseRoleGuardOptions {
  suppressToasts?: boolean;
}

export const useRoleGuard = (
  expectedRoles: UserRole[] = [],
  options: UseRoleGuardOptions = {},
): UseRoleGuardResult => {
  const router = useRouter();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const unauthToastShown = useRef(false);
  const sessionToastShown = useRef(false);

  useEffect(() => {
    let active = true;

    const evaluateAccess = () => {
      const token = getAccessToken();
      if (!token) {
        clearAuthStorage();
        if (!options.suppressToasts && !sessionToastShown.current) {
          toast.error('Please sign in to continue.');
          sessionToastShown.current = true;
        }
        router.replace('/login');
        if (active) {
          setRole(null);
          setIsLoading(false);
        }
        return;
      }

      const decoded = decodeAccessToken(token);
      if (!decoded || !decoded.role) {
        clearAuthStorage();
        if (!options.suppressToasts && !sessionToastShown.current) {
          toast.error('Your session is no longer valid. Please sign in again.');
          sessionToastShown.current = true;
        }
        router.replace('/login');
        if (active) {
          setRole(null);
          setIsLoading(false);
        }
        return;
      }

      if (isTokenExpired(decoded)) {
        clearAuthStorage();
        if (!options.suppressToasts && !sessionToastShown.current) {
          toast.error('Your session has expired. Please sign in again.');
          sessionToastShown.current = true;
        }
        router.replace('/login');
        if (active) {
          setRole(null);
          setIsLoading(false);
        }
        return;
      }

      if (expectedRoles.length > 0 && !expectedRoles.includes(decoded.role)) {
        if (!options.suppressToasts && !unauthToastShown.current) {
          toast.error('You are not authorised to access this area.');
          unauthToastShown.current = true;
        }
        router.replace(getRoleHomePath(decoded.role));
        if (active) {
          setRole(decoded.role);
          setIsLoading(false);
        }
        return;
      }

      if (active) {
        setRole(decoded.role);
        setIsLoading(false);
      }
    };

    evaluateAccess();

    return () => {
      active = false;
    };
  }, [expectedRoles, options.suppressToasts, router]);

  const isAuthorized = useMemo(() => {
    if (isLoading) {
      return false;
    }
    if (role === null) {
      return false;
    }
    if (expectedRoles.length === 0) {
      return true;
    }
    return expectedRoles.includes(role);
  }, [expectedRoles, isLoading, role]);

  return {
    role,
    isAuthorized,
    isLoading,
  };
};
