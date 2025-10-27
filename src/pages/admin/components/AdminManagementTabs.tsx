import Link from 'next/link';
import { useRouter } from 'next/router';

const managementTabs = [
  { href: '/admin/campaigns', label: 'Campaigns' },
  { href: '/admin/coupons', label: 'Coupons' },
  { href: '/admin/reports', label: 'Reports' },
  { href: '/admin/system-settings', label: 'Settings' },
];

interface AdminManagementTabsProps {
  className?: string;
}

const AdminManagementTabs = ({ className }: AdminManagementTabsProps) => {
  const router = useRouter();

  return (
    <div
      className={`flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-navy-900 ${
        className ?? ''
      }`}
    >
      {managementTabs.map((tab) => {
        const isActive = router.pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 rounded-xl px-4 py-2 text-center text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              isActive
                ? 'bg-primary text-white shadow'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

export default AdminManagementTabs;
