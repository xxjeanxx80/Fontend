import { useEffect, useState } from 'react';
import { getStoredUserProfile } from '@/api/storage';
import type { User } from '@/api/types';

export const useStoredUser = () => {
  const [user, setUser] = useState<User | null>(() => getStoredUserProfile());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const handleStorage = () => {
      setUser(getStoredUserProfile());
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return user;
};
