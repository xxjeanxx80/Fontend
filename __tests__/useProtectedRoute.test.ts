import { renderHook } from '@testing-library/react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

jest.mock('@/hooks/useRoleGuard', () => ({
  useRoleGuard: jest.fn(() => ({
    role: 'CUSTOMER',
    isAuthorized: true,
    isLoading: false,
  })),
}));

describe('useProtectedRoute', () => {
  it('initializes safely on SSR', () => {
    const originalWindow = global.window;
    Object.defineProperty(global, 'window', {
      value: undefined,
      configurable: true,
      writable: true,
    });

    try {
      const { result } = renderHook(() => useProtectedRoute('/login'));
      expect(result.current).toBeDefined();
    } finally {
      Object.defineProperty(global, 'window', {
        value: originalWindow,
        configurable: true,
        writable: true,
      });
    }
  });
});
