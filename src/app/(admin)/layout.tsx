import type { ReactNode } from 'react';

import RoleLayout from '@/app/layouts/RoleLayout';
import { ROLES } from '@/lib/constants';

const navItems = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/settings', label: 'Settings' },
];

const AdminLayout = ({ children }: { children: ReactNode }) => (
  <RoleLayout role={ROLES.ADMIN} title="Admin control centre" navItems={navItems}>
    {children}
  </RoleLayout>
);

export default AdminLayout;
