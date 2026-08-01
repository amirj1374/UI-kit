import type { UiThemeRegistry } from './types';
import { defaultThemes } from './defaults';

export { defaultThemes };
export type UiKitThemeName = keyof typeof defaultThemes;

export function mergeThemes<T extends Record<string, unknown>>(base: T, overrides: Partial<T>): T { return { ...base, ...overrides }; }

export function createUiKitThemes(options: { overrides?: UiThemeRegistry } = {}): UiThemeRegistry {
  const themes = { ...defaultThemes, ...options.overrides };
  for (const [name, theme] of Object.entries(themes)) {
    if (!name.trim() || typeof theme.dark !== 'boolean' || !theme.colors) throw new TypeError(`Invalid UI Kit theme: ${name || '<empty>'}`);
  }
  return themes;
}
