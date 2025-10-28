import type { PropsWithChildren, ReactNode } from 'react';
import type { UserRole } from '@/api/types';
import { useRoleGuard } from '@/hooks/useRoleGuard';

export interface RoleGuardProps extends PropsWithChildren {
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

const DefaultSplash = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-navy-900">
    <div className="flex flex-col items-center gap-3 text-slate-600 dark:text-slate-200">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></span>
      <p className="text-sm font-medium">Verifying your access…</p>
    </div>
  </div>
);

export const RoleGuard = ({ allowedRoles, fallback, children }: RoleGuardProps) => {
  const { isAuthorized, isLoading } = useRoleGuard(allowedRoles);

  if (isLoading) {
    return fallback ?? <DefaultSplash />;
  }

  if (!isAuthorized) {
    return fallback ?? null;
  }

  return <>{children}</>;
};

export default RoleGuard;
