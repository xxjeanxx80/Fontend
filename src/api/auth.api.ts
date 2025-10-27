import api from './client';
import type { ApiResponse, User, UserRole } from './types';
import {
  clearAuthStorage,
  persistUserProfile,
  setAccessToken,
} from './storage';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  role?: UserRole;
  name?: string;
}

export interface LoginSuccessPayload {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user?: User;
}

export type LoginResponse = ApiResponse<LoginSuccessPayload>;

export const login = async (payload: LoginDto): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', payload);
  return response.data;
};

export const register = async (
  payload: RegisterDto,
): Promise<ApiResponse<LoginSuccessPayload>> => {
  const response = await api.post<ApiResponse<LoginSuccessPayload>>(
    '/auth/register',
    { ...payload, role: payload.role ?? 'CUSTOMER' },
  );
  return response.data;
};

export const persistAuthSession = (payload: LoginSuccessPayload | null | undefined) => {
  if (!payload) {
    return;
  }
  if (payload.access_token) {
    setAccessToken(payload.access_token);
  }
  if (payload.user) {
    persistUserProfile(payload.user);
  }
};

export const logout = () => {
  clearAuthStorage();
};
