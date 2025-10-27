import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { logout } from '@/api/auth.api';
import { useStoredUser } from '@/hooks/useStoredUser';
import { toast } from 'react-hot-toast';

interface AdminLayoutProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

const navigation = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/spas', label: 'Spa approvals' },
  { href: '/admin/campaigns', label: 'Campaigns' },
  { href: '/admin/coupons', label: 'Coupons' },
  { href: '/admin/reports', label: 'Reports' },
  { href: '/admin/system-settings', label: 'Settings' },
  { href: '/admin/logs', label: 'Logs' },
];

const THEME_STORAGE_KEY = 'bbh_theme';

const AdminLayout = ({ title, subtitle, children }: AdminLayoutProps) => {
  const router = useRouter();
  const user = useStoredUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark;
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', next);
        window.localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
      }
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    router.push('/login');
  };

  const renderNavigation = (variant: 'desktop' | 'mobile') => (
    <nav className="mt-8 space-y-1">
      {navigation.map((item) => {
        const isActive = router.pathname.startsWith(item.href);
        const baseClasses =
          'flex items-center justify-between rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none';
        const activeClasses = 'bg-primary/10 text-primary';
        const inactiveClasses =
          'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60';

        return (
          <Link
            key={`${variant}-${item.href}`}
            href={item.href}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            onClick={() => variant === 'mobile' && setSidebarOpen(false)}
          >
            <span>{item.label}</span>
            {isActive && <span className="text-xs font-semibold uppercase text-primary">Active</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-boxdark dark:text-slate-100">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white/95 p-6 backdrop-blur transition duration-200 dark:border-slate-800 dark:bg-navy-900 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
                BB
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Admin Panel</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">Beauty Booking Hub</p>
              </div>
            </Link>
            <button
              type="button"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
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
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring lg:hidden dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
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
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Toggle theme"
              >
                {isDarkMode ? '🌙' : '☀️'}
              </button>
              {user && (
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">{user.name ?? user.email}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Admin</p>
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

export default AdminLayout;
