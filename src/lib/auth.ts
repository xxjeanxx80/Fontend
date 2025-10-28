'use client';

import { COOKIE_KEYS, DASHBOARD_PATHS, ROLES, type Role, type User } from './constants';

const isBrowser = typeof window !== 'undefined';

const escapeCookieKey = (key: string): string => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const readCookie = (key: string): string | null => {
  if (!isBrowser) {
    return null;
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${escapeCookieKey(key)}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const writeCookie = (key: string, value: string): void => {
  if (!isBrowser) {
    return;
  }

  document.cookie = `${key}=${encodeURIComponent(value)}; path=/; sameSite=Lax`;
};

const removeCookie = (key: string): void => {
  if (!isBrowser) {
    return;
  }

  document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const readUserFromCookies = (): User | null => {
  const raw = readCookie(COOKIE_KEYS.user);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as User;
    if (!parsed.role || !Object.values(ROLES).includes(parsed.role)) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.error('Failed to parse user cookie', error);
    return null;
  }
};

export const getToken = (): string | null => readCookie(COOKIE_KEYS.token);

export const getStoredRole = (): Role | null => {
  const value = readCookie(COOKIE_KEYS.role);
  return value && Object.values(ROLES).includes(value as Role) ? (value as Role) : null;
};

export const persistAuth = ({ token, user }: { token: string; user: User }): void => {
  writeCookie(COOKIE_KEYS.token, token);
  writeCookie(COOKIE_KEYS.role, user.role);
  writeCookie(COOKIE_KEYS.user, JSON.stringify(user));
};

export const clearAuth = (): void => {
  removeCookie(COOKIE_KEYS.token);
  removeCookie(COOKIE_KEYS.role);
  removeCookie(COOKIE_KEYS.user);
};

export const getDashboardPath = (role: Role): string => DASHBOARD_PATHS[role];
