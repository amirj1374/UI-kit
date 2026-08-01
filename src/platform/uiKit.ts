import { computed, inject, shallowReactive, readonly, type App, type ComputedRef, type InjectionKey, type Plugin } from 'vue';
import { defaultIcons, defaultMessages, defaultThemes } from './defaults';
import type { ResolvedUiDirection, UiKitConfig, UiKitOptions, UiMessageKey, UiPermissionInput, UiSemanticIconName } from './types';

export interface UiKitContext {
  config: Readonly<UiKitOptions>;
  locale: ComputedRef<string>;
  direction: ComputedRef<ResolvedUiDirection>;
  t: (key: UiMessageKey, params?: Record<string, string | number>) => string;
  icon: (name: UiSemanticIconName) => UiKitOptions['icons'][UiSemanticIconName];
  can: (requirement?: UiPermissionInput) => boolean;
  update: (options: UiKitConfig) => void;
}

const uiKitKey: InjectionKey<UiKitContext> = Symbol('ui-kit');

function isRtlLocale(locale: string) { return /^(fa|ar|he|ur)(-|$)/i.test(locale); }
function interpolate(value: string, params: Record<string, string | number> = {}) { return value.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`)); }

export function createUiKit(options: UiKitConfig = {}): UiKitContext {
  const locale = options.locale ?? 'fa-IR';
  const permissionOptions = typeof options.permissions === 'function' ? { evaluator: options.permissions } : options.permissions;
  const config = shallowReactive<UiKitOptions>({
    locale,
    direction: options.direction ?? 'auto',
    theme: { defaultTheme: options.theme?.defaultTheme ?? 'modern', themes: { ...defaultThemes, ...options.theme?.themes } },
    messages: options.messages ?? {},
    icons: { ...defaultIcons, ...options.icons },
    permissions: { missingEvaluator: 'allow', ...permissionOptions }
  });
  const context: UiKitContext = {
    config: readonly(config) as Readonly<UiKitOptions>,
    locale: computed(() => config.locale),
    direction: computed(() => config.direction === 'auto' ? (isRtlLocale(config.locale) ? 'rtl' : 'ltr') : config.direction),
    t(key, params) {
      const language = config.locale.startsWith('fa') ? 'fa-IR' : 'en-US';
      const value = config.messages[config.locale]?.[key] ?? config.messages[language]?.[key] ?? defaultMessages[language][key] ?? defaultMessages['en-US'][key];
      return interpolate(value, params);
    },
    icon: name => config.icons[name] ?? defaultIcons[name],
    can(requirement) {
      if (!requirement) return true;
      const evaluate = config.permissions.evaluator ?? (() => config.permissions.missingEvaluator !== 'deny');
      if (typeof requirement === 'string') return evaluate(requirement);
      if (Array.isArray(requirement)) return requirement.every(evaluate);
      const single = requirement.permission ? evaluate(requirement.permission) : true;
      const any = requirement.any?.length ? requirement.any.some(evaluate) : true;
      const all = requirement.all?.length ? requirement.all.every(evaluate) : true;
      return single && any && all;
    },
    update(next) {
      if (next.locale) config.locale = next.locale;
      if (next.direction) config.direction = next.direction;
      if (next.messages) config.messages = { ...config.messages, ...next.messages };
      if (next.icons) config.icons = { ...config.icons, ...next.icons };
      if (next.theme) config.theme = { ...config.theme, ...next.theme, themes: { ...config.theme.themes, ...next.theme.themes } };
      if (next.permissions) config.permissions = { ...config.permissions, ...(typeof next.permissions === 'function' ? { evaluator: next.permissions } : next.permissions) };
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
