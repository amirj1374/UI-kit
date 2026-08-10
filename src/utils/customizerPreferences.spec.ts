import { describe, expect, it } from 'vitest';
import {
  customizerPreferenceDefaults,
  parseCustomizerPreferences,
  serializeCustomizerPreferences
} from './customizerPreferences';

describe('customizer preference payload', () => {
  it('serializes and restores the versioned UI Kit payload', () => {
    const value = serializeCustomizerPreferences({
      ...customizerPreferenceDefaults,
      contentWidth: 'compact',
      surfaceStyle: 'premium-executive'
    });

    expect(typeof value).toBe('string');
    expect(parseCustomizerPreferences(value)).toMatchObject({
      version: 1,
      contentWidth: 'compact',
      surfaceStyle: 'premium-executive'
    });
  });

  it('reads legacy objects and fails safely for malformed strings', () => {
    expect(parseCustomizerPreferences({ actTheme: 'ModernTheme', menuOrientation: 'horizontal' }))
      .toMatchObject({ actTheme: 'ModernTheme', menuOrientation: 'horizontal' });
    expect(parseCustomizerPreferences('{invalid}')).toEqual(customizerPreferenceDefaults);
  });
});
