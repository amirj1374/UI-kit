import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import type { App } from 'vue';
import { createUiKit, provideUiKit } from '../../src/platform/uiKit';
import type { UiKitConfig } from '../../src/platform/types';
import PermissionGuard from '../../src/components/permissions/PermissionGuard.vue';
import UiErrorState from '../../src/components/state/UiErrorState.vue';
import UiLoadingState from '../../src/components/state/UiLoadingState.vue';
import UiAsyncState from '../../src/components/state/UiAsyncState.vue';
import { createUiKitThemes, defaultThemes } from '../../src/platform/themes';
const UiKit = { install: (app: App, options: UiKitConfig = {}) => provideUiKit(app, options) };

describe('UI kit platform', () => {
  it('resolves configuration services', () => {
    const icon = defineComponent(() => () => h('i'));
    const kit = createUiKit({ locale: 'en-US', messages: { 'en-US': { loading: 'Loading {name}' } }, icons: { loading: icon }, permissions: value => value === 'read' });
    expect(kit.direction.value).toBe('ltr');
    expect(kit.t('loading', { name: 'orders' })).toBe('Loading orders');
    expect(kit.icon('loading')).toBe(icon);
    expect(kit.can('read')).toBe(true);
    expect(kit.can({ all: ['read', 'write'] })).toBe(false);
  });

  it('keeps app configurations isolated', () => {
    expect(createUiKit({ locale: 'fa-IR' }).direction.value).toBe('rtl');
    expect(createUiKit({ locale: 'en-US' }).direction.value).toBe('ltr');
  });

  it('supports explicit direction and reactive runtime updates', async () => {
    const kit = createUiKit({ locale: 'fa-IR', direction: 'ltr' });
    expect(kit.direction.value).toBe('ltr');
    kit.update({ locale: 'en-US', direction: 'auto', messages: { 'en-US': { retry: 'Again' } } });
    expect(kit.locale.value).toBe('en-US');
    expect(kit.direction.value).toBe('ltr');
    expect(kit.t('retry')).toBe('Again');
  });

  it('supports fail-open and fail-closed missing permission evaluators', () => {
    expect(createUiKit().can('unknown')).toBe(true);
    expect(createUiKit({ permissions: { missingEvaluator: 'deny' } }).can('unknown')).toBe(false);
  });

  it('supports provider-backed and direct component usage', () => {
    expect(mount(UiLoadingState).attributes('dir')).toBe('rtl');
    const wrapper = mount(UiLoadingState, { global: { plugins: [[UiKit, { locale: 'en-US' }]] } });
    expect(wrapper.text()).toContain('Please wait');
    expect(wrapper.attributes('dir')).toBe('ltr');
  });

  it('renders permission fallback and disabled modes', () => {
    const global = { plugins: [[UiKit, { permissions: () => false }]] };
    expect(mount(PermissionGuard, { global, props: { permission: 'admin' }, slots: { default: '<button>Secret</button>', fallback: 'Denied' } }).text()).toBe('Denied');
    const disabled = mount(PermissionGuard, { global, props: { permission: 'admin', mode: 'disable' }, slots: { default: '<button>Secret</button>' } });
    expect(disabled.find('[aria-disabled="true"]').exists()).toBe(true);
  });

  it('evaluates any and all permission requirements', () => {
    const kit = createUiKit({ permissions: { evaluator: permission => permission === 'read' } });
    expect(kit.can({ any: ['write', 'read'] })).toBe(true);
    expect(kit.can({ all: ['read', 'write'] })).toBe(false);
  });

  it('emits retry from the error state', async () => {
    const wrapper = mount(UiErrorState);
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('retry')).toHaveLength(1);
  });

  it.each(['idle', 'loading', 'success', 'empty', 'error', 'permission-denied'] as const)('renders async status %s', status => {
    const wrapper = mount(UiAsyncState, { props: { status }, slots: { default: 'Content' } });
    expect(wrapper.exists()).toBe(true);
  });

  it('exposes valid light and dark themes and accepts overrides', () => {
    expect(defaultThemes.modern.dark).toBe(false);
    expect(defaultThemes['modern-dark'].dark).toBe(true);
    expect(createUiKitThemes({ overrides: { brand: { dark: false, colors: { primary: '#000000' } } } }).brand).toBeDefined();
  });
});
