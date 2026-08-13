import type { UiLocale } from './locale';
export interface UiMessages {
  close: string; loading: string; emptyTitle: string; emptyDescription: string; errorTitle: string; errorDescription: string; retry: string; permissionDeniedTitle: string; permissionDeniedDescription: string; confirm: string; cancel: string; noData: string; empty: string; error: string; permissionDenied: string; search: string; clear: string; select: string; delete: string; deleteConfirmation: string; download: string; upload: string; print: string; previous: string; next: string; create: string; edit: string; save: string; actions: string; navigationMenu: string; compactSidebar: string; themeCustomizer: string; notifications: string; profileSettings: string;
}
export type UiMessageKey = keyof UiMessages;
export type UiMessageOverrides = Partial<UiMessages>;
export type UiMessageCatalog = Partial<Record<UiLocale, UiMessageOverrides>>;
export type UiMessageParams = Record<string, string | number | boolean>;
