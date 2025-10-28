import type { ReactNode } from 'react';

import RoleLayout from '@/app/layouts/RoleLayout';
import { ROLES } from '@/lib/constants';

const navItems = [
  { href: '/customer', label: 'Dashboard' },
  { href: '/customer/bookings', label: 'Bookings' },
  { href: '/customer/spas', label: 'Find spas' },
];

const CustomerLayout = ({ children }: { children: ReactNode }) => (
  <RoleLayout role={ROLES.CUSTOMER} title="Customer portal" navItems={navItems}>
    {children}
  </RoleLayout>
);

export default CustomerLayout;
