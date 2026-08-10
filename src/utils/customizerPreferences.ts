import type { TextFieldHeight, TextFieldVariant } from '../components/layout/AppCustomizerControls.vue';

export type SurfaceStyle = 'elevated' | 'rounded' | 'tonal' | 'premium-executive';
export type ContentWidth = 'wide' | 'compact';
export type MenuOrientation = 'vertical' | 'horizontal';

/** A schema-free, versioned preference payload for consumer applications. */
export interface CustomizerPreferences {
  version: 1;
  actTheme: string;
  themeMode: 'light' | 'dark';
  fontTheme: string;
  inputBg: boolean;
  layoutType: string;
  menuOrientation: MenuOrientation;
  textFieldBorderRadius: number;
  textFieldVariant: TextFieldVariant;
  uiDensity: TextFieldHeight;
  textScale: number;
  surfaceStyle: SurfaceStyle;
  contentWidth: ContentWidth;
}

export const customizerPreferenceDefaults: CustomizerPreferences = {
  version: 1, actTheme: 'PurpleTheme', themeMode: 'light', fontTheme: 'vazir', inputBg: false,
  layoutType: 'SideBar', menuOrientation: 'vertical', textFieldBorderRadius: 10,
  textFieldVariant: 'outlined', uiDensity: 'default', textScale: 100,
  surfaceStyle: 'elevated', contentWidth: 'wide'
};

const variants: TextFieldVariant[] = ['outlined', 'filled', 'solo', 'plain', 'underlined'];
const densities: TextFieldHeight[] = ['compact', 'default', 'comfortable'];
const surfaces: SurfaceStyle[] = ['elevated', 'rounded', 'tonal', 'premium-executive'];

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}
function stringValue(value: unknown, fallback: string) { return typeof value === 'string' && value.trim() ? value : fallback; }
function numberValue(value: unknown, fallback: number, min: number, max: number) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback;
}

/** Safely accepts both this string payload and a legacy object response. */
export function parseCustomizerPreferences(value: unknown): CustomizerPreferences {
  let parsed: unknown = value;
  if (typeof value === 'string') { try { parsed = JSON.parse(value); } catch { return { ...customizerPreferenceDefaults }; } }
  const source = record(parsed);
  if (!source) return { ...customizerPreferenceDefaults };
  return {
    version: 1,
    actTheme: stringValue(source.actTheme, customizerPreferenceDefaults.actTheme),
    themeMode: source.themeMode === 'dark' ? 'dark' : 'light',
    fontTheme: stringValue(source.fontTheme, customizerPreferenceDefaults.fontTheme),
    inputBg: typeof source.inputBg === 'boolean' ? source.inputBg : customizerPreferenceDefaults.inputBg,
    layoutType: stringValue(source.layoutType, customizerPreferenceDefaults.layoutType),
    menuOrientation: source.menuOrientation === 'horizontal' ? 'horizontal' : 'vertical',
    textFieldBorderRadius: numberValue(source.textFieldBorderRadius, customizerPreferenceDefaults.textFieldBorderRadius, 0, 24),
    textFieldVariant: variants.includes(source.textFieldVariant as TextFieldVariant) ? source.textFieldVariant as TextFieldVariant : customizerPreferenceDefaults.textFieldVariant,
    uiDensity: densities.includes(source.uiDensity as TextFieldHeight) ? source.uiDensity as TextFieldHeight : customizerPreferenceDefaults.uiDensity,
    textScale: numberValue(source.textScale, customizerPreferenceDefaults.textScale, 85, 115),
    surfaceStyle: surfaces.includes(source.surfaceStyle as SurfaceStyle) ? source.surfaceStyle as SurfaceStyle : customizerPreferenceDefaults.surfaceStyle,
    contentWidth: source.contentWidth === 'compact' ? 'compact' : 'wide'
  };
}

export function serializeCustomizerPreferences(preferences: CustomizerPreferences): string {
  return JSON.stringify(parseCustomizerPreferences(preferences));
}
