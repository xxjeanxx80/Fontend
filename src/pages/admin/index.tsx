import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const AdminIndexPage = () => {
  const router = useRouter();
  const canAccess = useProtectedRoute('/customer/login', ['ADMIN']);

  useEffect(() => {
    if (canAccess) {
      router.replace('/admin/dashboard');
    }
  }, [canAccess, router]);

  return null;
};

export default AdminIndexPage;
