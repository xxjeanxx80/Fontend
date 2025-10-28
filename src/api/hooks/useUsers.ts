import { useQuery } from '@tanstack/react-query';
import { getUsers, getUserById } from '../users.api';
import type { ApiResponse, User } from '../types';

export const useUsersQuery = () =>
  useQuery<ApiResponse<User[]>, unknown, User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
    select: (response) => response.data,
  });

export const useUserQuery = (id?: number) =>
  useQuery<ApiResponse<User>, unknown, User | undefined>({
    queryKey: ['users', id],
    enabled: typeof id === 'number',
    queryFn: () => getUserById(id as number),
    select: (response) => response.data,
  });
