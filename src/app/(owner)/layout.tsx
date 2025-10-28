import type { ReactNode } from 'react';

import RoleLayout from '@/app/layouts/RoleLayout';
import { ROLES } from '@/lib/constants';

const navItems = [
  { href: '/owner', label: 'Overview' },
  { href: '/owner/bookings', label: 'Bookings' },
  { href: '/owner/staff', label: 'Staff' },
];

const OwnerLayout = ({ children }: { children: ReactNode }) => (
  <RoleLayout role={ROLES.OWNER} title="Owner console" navItems={navItems}>
    {children}
  </RoleLayout>
);

export default OwnerLayout;
