export type UiLocale = 'fa-IR' | 'en-US' | (string & {});
export type UiDirection = 'rtl' | 'ltr' | 'auto';
export type ResolvedUiDirection = Exclude<UiDirection, 'auto'>;
export type UiLocalizedText = string | Partial<Record<UiLocale, string>>;
