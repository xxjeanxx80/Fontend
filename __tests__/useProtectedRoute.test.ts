import { renderHook } from '@testing-library/react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const mockUseRoleGuard = jest.fn();

jest.mock('@/hooks/useRoleGuard', () => ({
  useRoleGuard: (...args: unknown[]) => mockUseRoleGuard(...args),
}));

describe('useProtectedRoute', () => {
  beforeEach(() => {
    mockUseRoleGuard.mockReset();
    mockUseRoleGuard.mockReturnValue({
      role: 'CUSTOMER',
      isAuthorized: true,
      isLoading: false,
    });
  });

  it('initializes safely on SSR', () => {
    const originalWindow = global.window;
    Object.defineProperty(global, 'window', {
      value: undefined,
      configurable: true,
      writable: true,
    });

    try {
      const { result } = renderHook(() => useProtectedRoute('/login', ['CUSTOMER']));
      expect(result.current).toBe(true);
      expect(mockUseRoleGuard).toHaveBeenCalledWith(['CUSTOMER'], { suppressToasts: true });
    } finally {
      Object.defineProperty(global, 'window', {
        value: originalWindow,
        configurable: true,
        writable: true,
      });
    }
  });

  it('returns false when guard reports unauthorised access', () => {
    mockUseRoleGuard.mockReturnValueOnce({
      role: 'OWNER',
      isAuthorized: false,
      isLoading: false,
    });

    const { result } = renderHook(() => useProtectedRoute('/owner/login', ['OWNER']));
    expect(result.current).toBe(false);
    expect(mockUseRoleGuard).toHaveBeenCalledWith(['OWNER'], { suppressToasts: true });
  });

  it('returns false while guard is loading', () => {
    mockUseRoleGuard.mockReturnValueOnce({
      role: null,
      isAuthorized: false,
      isLoading: true,
    });

    const { result } = renderHook(() => useProtectedRoute('/login'));
    expect(result.current).toBe(false);
    expect(mockUseRoleGuard).toHaveBeenCalledWith([], { suppressToasts: true });
  });
});
