import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const OwnerIndexPage = () => {
  const canAccess = useProtectedRoute('/customer/login');
  const router = useRouter();

  useEffect(() => {
    if (canAccess) {
      router.replace('/owner/dashboard');
    }
  }, [canAccess, router]);

  return null;
};

export default OwnerIndexPage;
