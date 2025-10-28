import { useEffect } from 'react';
import { useRouter } from 'next/router';

const CustomerLoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return null;
};

export default CustomerLoginPage;
