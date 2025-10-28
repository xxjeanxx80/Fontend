'use client';

import { useAuth } from './useAuth';

export const useUser = () => {
  const { user, setUser } = useAuth();

  return { user, setUser };
};
