import type { User } from './types';

export const ACCESS_TOKEN_KEY = 'access_token';
export const USER_STORAGE_KEY = 'bbh_user_profile';

const isBrowser = () => typeof window !== 'undefined';

export const getAccessToken = (): string | null => {
  if (!isBrowser()) {
    return null;
  }
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = () => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const persistUserProfile = (user: User) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const getStoredUserProfile = (): User | null => {
  if (!isBrowser()) {
    return null;
  }
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as User;
  } catch (error) {
    console.warn('Failed to parse stored user profile', error);
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export const clearUserProfile = () => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(USER_STORAGE_KEY);
};

export const clearAuthStorage = () => {
  if (!isBrowser()) {
    return;
  }
  clearAccessToken();
  clearUserProfile();
};
