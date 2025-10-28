'use client';

import Link from 'next/link';
import { useEffect, type ReactNode } from 'react';

import { useRoleRedirect } from '@/hooks/useRoleRedirect';
import { useUser } from '@/hooks/useUser';
import type { Role } from '@/lib/constants';

interface NavItem {
  href: string;
  label: string;
}

interface RoleLayoutProps {
  role: Role;
  title: string;
  navItems: NavItem[];
  children: ReactNode;
}

export const RoleLayout = ({ role, title, navItems, children }: RoleLayoutProps) => {
  const { user } = useUser();
  const redirect = useRoleRedirect();

  useEffect(() => {
    if (!user || user.role !== role) {
      redirect(user?.role ?? null);
    }
  }, [redirect, role, user]);

  if (!user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-medium text-slate-600">Redirecting to your workspace…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">Beauty Booking Hub</p>
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          </div>
          <span className="text-sm text-slate-500">{user.name ?? user.email}</span>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-[220px_1fr]">
        <aside className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </aside>
        <main className="min-h-[320px] rounded-xl bg-white p-6 shadow-sm">{children}</main>
      </div>
    </div>
  );
};

export default RoleLayout;
