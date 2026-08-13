import type { ThemeDefinition } from 'vuetify';
export interface UiThemeRegistry { [name: string]: ThemeDefinition }
export interface UiThemeOptions { defaultTheme?: string; themes?: UiThemeRegistry }
