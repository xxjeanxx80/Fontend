import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { logout } from '@/api/auth.api';
import { useStoredUser } from '@/hooks/useStoredUser';
import { toast } from 'react-hot-toast';

interface OwnerLayoutProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

const navigation = [
  { href: '/owner/dashboard', label: 'Dashboard' },
  { href: '/owner/spa', label: 'Spa Info' },
  { href: '/owner/services', label: 'Services' },
  { href: '/owner/staff', label: 'Staff' },
  { href: '/owner/bookings', label: 'Bookings' },
  { href: '/owner/payouts', label: 'Payouts' },
];

const OwnerLayout = ({ title, subtitle, children }: OwnerLayoutProps) => {
  const router = useRouter();
  const user = useStoredUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    router.push('/login');
  };

  const renderNavigation = (variant: 'desktop' | 'mobile' = 'desktop') => (
    <nav className="mt-8 space-y-1">
      {navigation.map((item) => {
        const isActive = router.pathname === item.href;
        const baseClasses =
          'flex items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none';
        const activeClasses = 'bg-primary/10 text-primary';
        const inactiveClasses =
          'text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60';
        return (
          <Link
            key={`${variant}-${item.href}`}
            href={item.href}
            onClick={() => variant === 'mobile' && setSidebarOpen(false)}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
          >
            <span>{item.label}</span>
            {isActive && <span className="text-xs font-semibold uppercase text-primary">Now</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-boxdark dark:text-slate-100">
      <div className="flex h-screen w-full flex-col lg:flex-row">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white/95 p-6 backdrop-blur transition duration-200 dark:border-slate-800 dark:bg-navy-900 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <Link href="/owner/dashboard" className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
                BB
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Owner Portal</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">Beauty Booking Hub</p>
              </div>
            </Link>
            <button
              type="button"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          {renderNavigation('desktop')}
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-navy-900/70">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                Menu
              </button>
              <div>
                {title && <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>}
                {subtitle && <p className="text-sm text-slate-500 dark:text-slate-300">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">{user.name ?? user.email}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Spa Owner</p>
                </div>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
              >
                Logout
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-slate-50 px-6 py-8 dark:bg-navy-950">
            <div className="mx-auto w-full max-w-6xl space-y-6">
              <div className="lg:hidden">{renderNavigation('mobile')}</div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default OwnerLayout;
