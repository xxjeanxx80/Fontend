export const ROLES = {
  ADMIN: 'ADMIN',
  OWNER: 'OWNER',
  CUSTOMER: 'CUSTOMER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

export const COOKIE_KEYS = {
  token: 'token',
  role: 'role',
  user: 'user',
} as const;

export const DASHBOARD_PATHS: Record<Role, string> = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.OWNER]: '/owner',
  [ROLES.CUSTOMER]: '/customer',
};
