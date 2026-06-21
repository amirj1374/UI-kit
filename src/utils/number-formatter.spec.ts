import { describe, it, expect } from 'vitest';
import { formatNumberWithCommas, formatPrice } from './number-formatter';

describe('formatNumberWithCommas', () => {
  it('adds thousands separators', () => {
    expect(formatNumberWithCommas(1234567)).toBe('1,234,567');
    expect(formatNumberWithCommas(1000)).toBe('1,000');
    expect(formatNumberWithCommas(999)).toBe('999');
  });

  it('accepts numeric strings', () => {
    expect(formatNumberWithCommas('1234567')).toBe('1,234,567');
  });

  it('respects the decimals argument', () => {
    expect(formatNumberWithCommas(1234.5, 2)).toBe('1,234.50');
    expect(formatNumberWithCommas(1234.567, 2)).toBe('1,234.57');
  });

  it('handles zero and negatives', () => {
    expect(formatNumberWithCommas(0)).toBe('0');
    expect(formatNumberWithCommas(-1234567)).toBe('-1,234,567');
  });

  it('returns empty string for null/undefined/NaN', () => {
    // @ts-expect-error testing runtime guard
    expect(formatNumberWithCommas(null)).toBe('');
    // @ts-expect-error testing runtime guard
    expect(formatNumberWithCommas(undefined)).toBe('');
    expect(formatNumberWithCommas('abc')).toBe('');
  });
});

describe('formatPrice', () => {
  it('prefixes the currency symbol when provided', () => {
    expect(formatPrice(1234567, '$')).toBe('$1,234,567');
  });

  it('omits the currency when not provided', () => {
    expect(formatPrice(1234567)).toBe('1,234,567');
  });

  it('forwards the decimals argument', () => {
    expect(formatPrice(1234.5, '$', 2)).toBe('$1,234.50');
  });
});
