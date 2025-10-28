'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const post = async <TData,>(path: string, payload: unknown): Promise<TData> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const parsed = (await response.json().catch(() => null)) as TData | { message?: string } | null;

  if (!response.ok) {
    const message = parsed && typeof parsed === 'object' && 'message' in parsed ? parsed.message : null;
    throw new Error(typeof message === 'string' && message.length > 0 ? message : 'Request failed');
  }

  return parsed as TData;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => readUserFromCookies());

  const login = useCallback(async (credentials: Credentials) => {
    try {
      const response = await post<AuthResponse>('/auth/login', credentials);
      if (!response.success) {
        throw new Error(response.message ?? 'Unable to sign in');
      }
      const nextUser = response.data.user;
      persistAuth({ token: response.data.token, user: nextUser });
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unable to sign in');
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      const response = await post<AuthResponse>('/auth/register', {
        ...payload,
        role: payload.role ?? ROLES.CUSTOMER,
      });
      if (!response.success) {
        throw new Error(response.message ?? 'Unable to create account');
      }
      const nextUser = response.data.user;
      persistAuth({ token: response.data.token, user: nextUser });
      setUser(nextUser);
      return nextUser;
    } catch (error) {
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
