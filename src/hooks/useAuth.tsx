'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import axiosClient from '@/lib/axiosClient';
import { clearAuth, persistAuth, readUserFromCookies } from '@/lib/auth';
import { ROLES, type Role, type User } from '@/lib/constants';

type Credentials = {
  email: string;
  password: string;
};

type RegisterPayload = Credentials & {
  name?: string;
  role?: Role;
};

type AuthResponse = {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: User;
  };
};

type AuthContextValue = {
  user: User | null;
  login: (credentials: Credentials) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  setUser: (nextUser: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => readUserFromCookies());

  const login = useCallback(async (credentials: Credentials) => {
    try {
      const { data: response } = await axiosClient.post<AuthResponse>('/auth/login', credentials);
      console.info('Login request successful', response);
      if (!response.success) {
        throw new Error(response.message ?? 'Unable to sign in');
      }
      const nextUser = response.data.user;
      persistAuth({ token: response.data.token, user: nextUser });
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      console.error('Login request failed', error);
      throw error instanceof Error ? error : new Error('Unable to sign in');
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      const { data: response } = await axiosClient.post<AuthResponse>('/auth/register', {
        ...payload,
        role: payload.role ?? ROLES.CUSTOMER,
      });
      console.info('Registration request successful', response);
      if (!response.success) {
        throw new Error(response.message ?? 'Unable to create account');
      }
      const nextUser = response.data.user;
      persistAuth({ token: response.data.token, user: nextUser });
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      console.error('Registration request failed', error);
      throw error instanceof Error ? error : new Error('Unable to create account');
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login,
      register,
      logout,
      setUser,
    }),
    [login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
