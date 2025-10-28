import { jwtDecode } from 'jwt-decode';
import type { UserRole } from '@/api/types';

export type DecodedAccessToken = {
  role?: UserRole;
  exp?: number;
  sub?: string;
  [key: string]: unknown;
};

export const ROLE_HOME_PATH: Record<UserRole, string> = {
  CUSTOMER: '/customer',
  OWNER: '/owner',
  ADMIN: '/admin',
};

export const decodeAccessToken = (token: string): DecodedAccessToken | null => {
  try {
    return jwtDecode<DecodedAccessToken>(token);
  } catch (error) {
    console.warn('Failed to decode JWT token', error);
    return null;
  }
};

export const extractRoleFromToken = (token: string): UserRole | null => {
  const decoded = decodeAccessToken(token);
  return decoded?.role ?? null;
};

export const isTokenExpired = (decoded: DecodedAccessToken | null): boolean => {
  if (!decoded?.exp) {
    return false;
  }
  return decoded.exp * 1000 < Date.now();
};

export const getRoleHomePath = (role: UserRole | null | undefined): string => {
  if (!role) {
    return '/login';
  }
  return ROLE_HOME_PATH[role];
};
