import { describe, it, expect } from 'vitest';
import { NationalCodeValidator } from './NationalCodeValidator';

describe('NationalCodeValidator', () => {
  describe('Real customer (10 digits)', () => {
    it('accepts valid national codes (checksum-verified)', () => {
      // remainder >= 2 branch
      expect(NationalCodeValidator.isValid('0013542419', 'Real')).toBe(true);
      expect(NationalCodeValidator.isValid('0084575948', 'Real')).toBe(true);
    });

    it('rejects a code with a wrong check digit', () => {
      expect(NationalCodeValidator.isValid('0013542418', 'Real')).toBe(false);
    });

    it('rejects codes that are not exactly 10 digits', () => {
      expect(NationalCodeValidator.isValid('123', 'Real')).toBe(false);
      expect(NationalCodeValidator.isValid('00135424199', 'Real')).toBe(false);
    });

    it('rejects non-numeric input', () => {
      expect(NationalCodeValidator.isValid('00135424ab', 'Real')).toBe(false);
    });

    it('rejects repeated-digit codes even if checksum would pass', () => {
      for (let d = 0; d <= 9; d++) {
        expect(NationalCodeValidator.isValid(String(d).repeat(10), 'Real')).toBe(false);
      }
    });
  });

  describe('Legal customer (11 digits)', () => {
    it('accepts any 11-digit non-repeated code', () => {
      expect(NationalCodeValidator.isValid('12345678901', 'Legal')).toBe(true);
    });

    it('rejects codes that are not exactly 11 digits', () => {
      expect(NationalCodeValidator.isValid('1234567890', 'Legal')).toBe(false);
      expect(NationalCodeValidator.isValid('123456789012', 'Legal')).toBe(false);
    });

    it('rejects repeated-digit codes', () => {
      expect(NationalCodeValidator.isValid('00000000000', 'Legal')).toBe(false);
      expect(NationalCodeValidator.isValid('99999999999', 'Legal')).toBe(false);
    });
  });
});
