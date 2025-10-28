import { useMutation } from '@tanstack/react-query';
import { login, register } from '../auth.api';
import type { LoginDto, RegisterDto, LoginResponse } from '../auth.api';

export const useLoginMutation = () =>
  useMutation<LoginResponse, unknown, LoginDto>({
    mutationFn: login,
  });

export const useRegisterMutation = () =>
  useMutation<LoginResponse, unknown, RegisterDto>({
    mutationFn: register,
  });
