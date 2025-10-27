import type { UserRole } from '@/api/types';
import { useRoleGuard } from './useRoleGuard';

export const useProtectedRoute = (
  _redirectTo = '/login',
  allowedRoles?: UserRole[],
) => {
  void _redirectTo;
  const { isAuthorized, isLoading } = useRoleGuard(allowedRoles ?? [], { suppressToasts: true });
  return !isLoading && isAuthorized;
};
