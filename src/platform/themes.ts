import type { UiThemeRegistry } from './types';
import { defaultThemes } from './defaults';

export { defaultThemes };
export type UiKitThemeName = keyof typeof defaultThemes;

export function mergeThemes<T extends Record<string, unknown>>(base: T, overrides: Partial<T>): T { return { ...base, ...overrides }; }

function cloneTheme(theme: UiThemeRegistry[string]): UiThemeRegistry[string] {
  return { ...theme, colors: { ...theme.colors }, variables: theme.variables ? { ...theme.variables } : undefined };
}

function validateTheme(name: string, theme: UiThemeRegistry[string]): void {
  if (!name.trim() || !theme || typeof theme.dark !== 'boolean' || !theme.colors || typeof theme.colors !== 'object') throw new TypeError(`Invalid UI Kit theme: ${name || '<empty>'}`);
  for (const [colorName, color] of Object.entries(theme.colors)) {
    if (!colorName.trim() || typeof color !== 'string' || !color.trim()) throw new TypeError(`Invalid color in UI Kit theme: ${name}.${colorName || '<empty>'}`);
  }
}

export function createUiKitThemes(options: { overrides?: UiThemeRegistry } = {}): UiThemeRegistry {
  const themes = Object.fromEntries(Object.entries({ ...defaultThemes, ...options.overrides }).map(([name, theme]) => [name, cloneTheme(theme)]));
  for (const [name, theme] of Object.entries(themes)) {
    validateTheme(name, theme);
  }
  return themes;
}
