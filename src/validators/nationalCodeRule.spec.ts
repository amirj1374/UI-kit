import { describe, it, expect } from 'vitest';
import { nationalCodeRule } from './nationalCodeRule';

describe('nationalCodeRule', () => {
  it('returns false (no error) for a valid Real code', () => {
    expect(nationalCodeRule('0013542419', 'Real')).toBe(false);
  });

  it('returns an error message for an invalid Real code', () => {
    expect(nationalCodeRule('0013542418', 'Real')).toBe('کد ملی نامعتبر است');
  });

  it('returns false (no error) for a valid Legal code', () => {
    expect(nationalCodeRule('12345678901', 'Legal')).toBe(false);
  });

  it('returns an error message for an invalid Legal code', () => {
    expect(nationalCodeRule('00000000000', 'Legal')).toBe('کد ملی نامعتبر است');
  });
});
