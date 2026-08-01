import { computed, inject, shallowReactive, readonly, type App, type ComputedRef, type InjectionKey, type Plugin } from 'vue';
import { defaultIcons, defaultMessages, defaultThemes } from './defaults';
import type { ResolvedUiDirection, UiKitConfig, UiKitOptions, UiMessageKey, UiMessageParams, UiPermissionInput, UiSemanticIconName } from './types';

export interface UiKitContext {
  config: Readonly<UiKitOptions>;
  locale: ComputedRef<string>;
  direction: ComputedRef<ResolvedUiDirection>;
  t: (key: UiMessageKey, params?: UiMessageParams) => string;
  icon: (name: UiSemanticIconName) => UiKitOptions['icons'][UiSemanticIconName];
  can: (requirement?: UiPermissionInput) => boolean;
  update: (options: UiKitConfig) => void;
  reset: () => void;
}

const uiKitKey: InjectionKey<UiKitContext> = Symbol('ui-kit');

function isRtlLocale(locale: string) { return /^(fa|ar|he|ur)(-|$)/i.test(locale); }
function interpolate(value: string, params: UiMessageParams = {}) { return value.replace(/\{([A-Za-z0-9_]+)\}/g, (_, key: string) => Object.hasOwn(params, key) ? String(params[key]) : `{${key}}`); }
function cloneConfig(options: UiKitConfig): UiKitConfig {
  const permissions = typeof options.permissions === 'function' ? options.permissions : options.permissions ? { ...options.permissions } : undefined;
  return { ...options, messages: options.messages ? Object.fromEntries(Object.entries(options.messages).map(([locale, catalog]) => [locale, { ...catalog }])) : undefined, icons: options.icons ? { ...options.icons } : undefined, theme: options.theme ? { ...options.theme, themes: options.theme.themes ? { ...options.theme.themes } : undefined } : undefined, permissions };
}

export function createUiKit(options: UiKitConfig = {}): UiKitContext {
  const initial = cloneConfig(options);
  const build = (source: UiKitConfig): UiKitOptions => {
    const permissionOptions = typeof source.permissions === 'function' ? { evaluator: source.permissions } : source.permissions;
    return {
    locale: typeof source.locale === 'string' && source.locale ? source.locale : 'fa-IR',
    direction: source.direction === 'rtl' || source.direction === 'ltr' || source.direction === 'auto' ? source.direction : 'auto',
    theme: { defaultTheme: source.theme?.defaultTheme ?? 'modern', themes: { ...defaultThemes, ...source.theme?.themes } },
    messages: source.messages ? Object.fromEntries(Object.entries(source.messages).map(([locale, catalog]) => [locale, { ...catalog }])) : {},
    icons: { ...defaultIcons, ...source.icons },
    permissions: { missingEvaluator: 'allow', ...permissionOptions }
  }};
  const config = shallowReactive<UiKitOptions>(build(initial));
  const context: UiKitContext = {
    config: readonly(config) as Readonly<UiKitOptions>,
    locale: computed(() => config.locale),
    direction: computed(() => config.direction === 'auto' ? (isRtlLocale(config.locale) ? 'rtl' : 'ltr') : config.direction),
    t(key, params) {
      const language = /^fa(?:-|$)/i.test(config.locale) ? 'fa-IR' : 'en-US';
      const override = config.messages[config.locale] ?? config.messages[language];
      const custom = override && Object.hasOwn(override, key) ? override[key] : undefined;
      const value = typeof custom === 'string' ? custom : defaultMessages[language][key];
      return interpolate(value, params);
    },
    icon: name => {
      const candidate = config.icons[name];
      return typeof candidate === 'string' || typeof candidate === 'function' || (candidate !== null && typeof candidate === 'object') ? candidate : defaultIcons[name];
    },
    can(requirement) {
      if (requirement === undefined) return true;
      const evaluate = (permission: string) => {
        if (!permission) return false;
        try { return config.permissions.evaluator?.(permission) ?? config.permissions.missingEvaluator !== 'deny'; }
        catch { return false; }
      };
      if (typeof requirement === 'string') return evaluate(requirement);
      if (Array.isArray(requirement)) return requirement.every(evaluate);
      const single = requirement.permission ? evaluate(requirement.permission) : true;
      const any = requirement.any === undefined ? true : requirement.any.some(evaluate);
      const all = requirement.all === undefined ? true : requirement.all.every(evaluate);
      return single && any && all;
    },
    update(input) {
      const next = cloneConfig(input);
      if (typeof next.locale === 'string' && next.locale) config.locale = next.locale;
      if (next.direction === 'rtl' || next.direction === 'ltr' || next.direction === 'auto') config.direction = next.direction;
      if (next.messages) config.messages = { ...config.messages, ...next.messages };
      if (next.icons) config.icons = { ...config.icons, ...next.icons };
      if (next.theme) config.theme = { ...config.theme, ...next.theme, themes: { ...config.theme.themes, ...next.theme.themes } };
      if (next.permissions) config.permissions = { ...config.permissions, ...(typeof next.permissions === 'function' ? { evaluator: next.permissions } : next.permissions) };
    },
    reset() {
      Object.assign(config, build({}));
    }
  };
  return context;
}

const fallbackContext = createUiKit();
export function provideUiKit(app: App, options: UiKitConfig = {}) { const context = createUiKit(options); app.provide(uiKitKey, context); return context; }
export function useUiKit() { return inject(uiKitKey, fallbackContext); }
export function useUiKitConfig() { return useUiKit().config; }
export function useUiKitLocale() { const kit = useUiKit(); return { locale: kit.locale, direction: kit.direction }; }
export function useUiKitMessages() { const kit = useUiKit(); return { t: kit.t, locale: kit.locale }; }
export function useUiKitIcons() { const kit = useUiKit(); return { resolveIcon: kit.icon }; }
export function usePermission() { const kit = useUiKit(); return { can: kit.can, any: (permissions: string[]) => kit.can({ any: permissions }), all: (permissions: string[]) => kit.can({ all: permissions }) }; }

export const UiKitPlugin: Plugin<[UiKitConfig?]> = { install: (app, options = {}) => { provideUiKit(app, options); } };
