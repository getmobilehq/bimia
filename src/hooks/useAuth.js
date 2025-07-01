// React Query + Auth hooks for Bimi Admin Dashboard
import { useMutation } from '@tanstack/react-query';
import * as api from '../api';

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }) => api.login(email, password)
  });
}

export function useRefreshToken() {
  return useMutation(({ refresh_token }) => api.refreshToken(refresh_token));
}
