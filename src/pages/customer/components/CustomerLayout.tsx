import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { logout } from '@/api/auth.api';
import { useStoredUser } from '@/hooks/useStoredUser';
import { toast } from 'react-hot-toast';

interface CustomerLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const navItems = [
  { href: '/customer', label: 'Home' },
  { href: '/customer/spas', label: 'Explore Spas' },
  { href: '/customer/bookings', label: 'My Bookings' },
  { href: '/customer/profile/loyalty', label: 'Loyalty' },
];

const CustomerLayout = ({ children, title, subtitle }: CustomerLayoutProps) => {
  const router = useRouter();
  const user = useStoredUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    router.push('/customer/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-boxdark dark:text-white">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-boxdark/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/customer" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">BB</span>
            <span className="text-lg font-semibold">Beauty Booking Hub</span>
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition hover:text-primary ${
                    isActive ? 'text-primary' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Hi, <span className="font-semibold text-slate-900 dark:text-white">{user.name ?? user.email}</span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/customer/login"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90"
              >
                Login
              </Link>
            )}
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white py-4 dark:border-slate-700 dark:bg-boxdark md:hidden">
            <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4">
              {navItems.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>}
            {subtitle && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-boxdark">
        © {new Date().getFullYear()} Beauty Booking Hub. All rights reserved.
      </footer>
    </div>
  );
};

export default CustomerLayout;
