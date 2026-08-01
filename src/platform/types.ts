import type { Component } from 'vue';
import type { ThemeDefinition } from 'vuetify';

export type UiLocale = 'fa-IR' | 'en-US' | (string & {});
export type UiDirection = 'rtl' | 'ltr' | 'auto';
export type ResolvedUiDirection = Exclude<UiDirection, 'auto'>;
export type UiIconSource = string | Component;
export type UiAsyncStatus = 'idle' | 'loading' | 'empty' | 'error' | 'success' | 'permission-denied';
export type UiComponentSize = 'x-small' | 'small' | 'default' | 'large' | 'x-large';
export type UiDensity = 'default' | 'comfortable' | 'compact';
export type UiLocalizedText = string | Partial<Record<UiLocale, string>>;

export interface UiAsyncState<T = unknown, E = unknown> {
  status: UiAsyncStatus;
  data?: T;
  error?: E;
}

export interface UiPaginationState { page: number; itemsPerPage: number; total?: number }
export interface UiSortState { key: string; order: 'asc' | 'desc' }
export interface UiFilterState { [key: string]: unknown }
export interface UiActionDefinition<T = unknown> { id: string; label: string; icon?: UiIconSource; disabled?: boolean; handler?: (item: T) => void }

export interface UiMessages {
  loading: string;
  emptyTitle: string;
  emptyDescription: string;
  errorTitle: string;
  errorDescription: string;
  retry: string;
  permissionDeniedTitle: string;
  permissionDeniedDescription: string;
  confirm: string;
  cancel: string;
  navigationMenu: string;
  compactSidebar: string;
  themeCustomizer: string;
  notifications: string;
  profileSettings: string;
}

export type UiMessageKey = keyof UiMessages;
export type UiMessageOverrides = Partial<UiMessages>;
export type UiMessageCatalog = Partial<Record<UiLocale, UiMessageOverrides>>;

export interface UiSemanticIcons {
  loading: UiIconSource;
  empty: UiIconSource;
  error: UiIconSource;
  permissionDenied: UiIconSource;
  retry: UiIconSource;
  menu: UiIconSource;
  theme: UiIconSource;
  notifications: UiIconSource;
  profile: UiIconSource;
  chevronDown: UiIconSource;
}
export type UiSemanticIconName = keyof UiSemanticIcons;

export type UiPermissionEvaluator = (permission: string) => boolean;
export interface UiPermissionRequirement { permission?: string; any?: string[]; all?: string[] }
export type UiPermissionInput = string | string[] | UiPermissionRequirement;

export interface UiThemeRegistry { [name: string]: ThemeDefinition }
export interface UiThemeOptions { defaultTheme?: string; themes?: UiThemeRegistry }

export interface UiKitOptions {
  locale: UiLocale;
  direction: UiDirection;
  theme: UiThemeOptions;
  messages: UiMessageCatalog;
  icons: Partial<UiSemanticIcons>;
  permissions: UiPermissionEvaluator;
}

export type UiKitConfig = Partial<Omit<UiKitOptions, 'theme' | 'messages' | 'icons'>> & {
  theme?: UiThemeOptions;
  messages?: UiMessageCatalog;
  icons?: Partial<UiSemanticIcons>;
};
