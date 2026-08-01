import { computed, inject, type App, type ComputedRef, type InjectionKey } from 'vue';
import { defaultIcons, defaultMessages, defaultThemes } from './defaults';
import type { ResolvedUiDirection, UiKitConfig, UiKitOptions, UiMessageKey, UiPermissionInput, UiSemanticIconName } from './types';

export interface UiKitContext {
  config: Readonly<UiKitOptions>;
  locale: ComputedRef<string>;
  direction: ComputedRef<ResolvedUiDirection>;
  t: (key: UiMessageKey, params?: Record<string, string | number>) => string;
  icon: (name: UiSemanticIconName) => UiKitOptions['icons'][UiSemanticIconName];
  can: (requirement?: UiPermissionInput) => boolean;
}

const uiKitKey: InjectionKey<UiKitContext> = Symbol('ui-kit');

function isRtlLocale(locale: string) { return /^(fa|ar|he|ur)(-|$)/i.test(locale); }
function interpolate(value: string, params: Record<string, string | number> = {}) { return value.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`)); }

export function createUiKit(options: UiKitConfig = {}): UiKitContext {
  const locale = options.locale ?? 'fa-IR';
  const config: UiKitOptions = {
    locale,
    direction: options.direction ?? 'auto',
    theme: { defaultTheme: options.theme?.defaultTheme ?? 'modern', themes: { ...defaultThemes, ...options.theme?.themes } },
    messages: options.messages ?? {},
    icons: { ...defaultIcons, ...options.icons },
    permissions: options.permissions ?? (() => true)
  };
  const context: UiKitContext = {
    config,
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
      if (typeof requirement === 'string') return config.permissions(requirement);
      if (Array.isArray(requirement)) return requirement.every(config.permissions);
      const single = requirement.permission ? config.permissions(requirement.permission) : true;
      const any = requirement.any?.length ? requirement.any.some(config.permissions) : true;
      const all = requirement.all?.length ? requirement.all.every(config.permissions) : true;
      return single && any && all;
    }
  };
  return context;
}

const fallbackContext = createUiKit();
export function provideUiKit(app: App, options: UiKitConfig = {}) { const context = createUiKit(options); app.provide(uiKitKey, context); return context; }
export function useUiKit() { return inject(uiKitKey, fallbackContext); }
export function useUiKitConfig() { return useUiKit().config; }
export function usePermission() { const kit = useUiKit(); return { can: kit.can, any: (permissions: string[]) => kit.can({ any: permissions }), all: (permissions: string[]) => kit.can({ all: permissions }) }; }
