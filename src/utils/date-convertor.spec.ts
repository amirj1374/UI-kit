import { describe, it, expect } from 'vitest';
import { DateConverter } from './date-convertor';

describe('DateConverter.toGregorian', () => {
  it('converts a Shamsi date to an ISO Gregorian date', () => {
    // 1400/01/01 (Nowruz) === 2021-03-21
    expect(DateConverter.toGregorian('1400/01/01')).toBe('2021-03-21');
  });

  it('zero-pads month and day', () => {
    const result = DateConverter.toGregorian('1403/05/21');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('DateConverter.toShamsi', () => {
  it('converts a Gregorian date to a zero-padded Shamsi string', () => {
    // Use an explicit local time component so the result is timezone-stable.
    expect(DateConverter.toShamsi('2021-03-21T12:00:00')).toBe('1400/01/01');
  });

  it('returns an empty string for empty/null/undefined input', () => {
    expect(DateConverter.toShamsi('')).toBe('');
    expect(DateConverter.toShamsi(null)).toBe('');
    expect(DateConverter.toShamsi(undefined)).toBe('');
  });

  it('returns an empty string for an invalid date', () => {
    expect(DateConverter.toShamsi('not-a-date')).toBe('');
  });

  it('round-trips Shamsi -> Gregorian -> Shamsi', () => {
    const shamsi = '1402/11/15';
    const gregorian = DateConverter.toGregorian(shamsi);
    expect(DateConverter.toShamsi(`${gregorian}T12:00:00`)).toBe(shamsi);
  });
});
