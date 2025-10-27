import api from './client';
import type { ApiResponse, User } from './types';

export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  const response = await api.get<ApiResponse<User[]>>('/users');
  return response.data;
};

export const getUserById = async (id: number): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>(`/users/${id}`);
  return response.data;
};
