import { formatCurrency, formatDateTime } from '@/api/utils';

describe('api utils', () => {
  test('formatCurrency formats properly', () => {
    expect(formatCurrency(10000)).toContain('$');
  });

  test('formatCurrency formats VND when locale provided', () => {
    expect(formatCurrency(10000, { currency: 'VND' })).toContain('₫');
  });

  test('formatDateTime returns readable string', () => {
    expect(formatDateTime('2025-10-28T00:00:00Z')).toMatch(/\d{4}/);
  });
});
