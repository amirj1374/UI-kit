import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import type { App } from 'vue';
import { createUiKit, provideUiKit, UiKitPlugin, usePermission, useUiKitConfig, useUiKitIcons, useUiKitLocale, useUiKitMessages } from '../../src/platform/uiKit';
import { hasUiAsyncData } from '../../src/platform/types';
import type { UiKitConfig } from '../../src/platform/types';
import PermissionGuard from '../../src/components/permissions/PermissionGuard.vue';
import UiErrorState from '../../src/components/state/UiErrorState.vue';
import UiLoadingState from '../../src/components/state/UiLoadingState.vue';
import UiAsyncState from '../../src/components/state/UiAsyncState.vue';
import UiEmptyState from '../../src/components/state/UiEmptyState.vue';
import UiPermissionDenied from '../../src/components/state/UiPermissionDenied.vue';
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

  it('clones consumer configuration, replaces services, and resets', () => {
    const messages = { 'en-US': { retry: 'First' } };
    const icons = { retry: 'mdi-one' };
    const kit = createUiKit({ locale: 'en-US', messages, icons, permissions: () => true });
    messages['en-US'].retry = 'Mutated'; icons.retry = 'mdi-mutated';
    expect(kit.t('retry')).toBe('First'); expect(kit.icon('retry')).toBe('mdi-one');
    kit.update({ messages: { 'en-US': { retry: 'Second' } }, icons: { retry: 'mdi-two' }, permissions: () => false });
    expect(kit.t('retry')).toBe('Second'); expect(kit.icon('retry')).toBe('mdi-two'); expect(kit.can('read')).toBe(false);
    kit.reset();
    expect(kit.locale.value).toBe('fa-IR'); expect(kit.t('retry')).toBe('تلاش مجدد'); expect(kit.icon('retry')).not.toBe('mdi-one'); expect(kit.can('read')).toBe(true);
  });

  it('handles locale variants, fallback, direction transitions, and interpolation edges', () => {
    const kit = createUiKit({ locale: 'fa', messages: { 'fa-IR': { retry: '', deleteConfirmation: '{count}/{count}/{missing}' } } });
    expect(kit.direction.value).toBe('rtl'); expect(kit.t('retry')).toBe('');
    expect(kit.t('deleteConfirmation', { count: 3, extra: true })).toBe('3/3/{missing}');
    kit.update({ locale: 'EN-us', direction: 'auto' });
    expect(kit.direction.value).toBe('ltr'); expect(kit.t('confirm')).toBe('Confirm');
    kit.update({ direction: 'rtl', locale: 'en-US' }); expect(kit.direction.value).toBe('rtl');
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

  it('exposes focused composables through plugin installation', () => {
    const Probe = defineComponent({ setup() { const config = useUiKitConfig(); const locale = useUiKitLocale(); const messages = useUiKitMessages(); const icons = useUiKitIcons(); const permission = usePermission(); return () => h('div', `${config.locale}|${locale.direction.value}|${messages.t('confirm')}|${String(icons.resolveIcon('retry'))}|${permission.any(['read'])}|${permission.all(['read'])}`); } });
    const wrapper = mount(Probe, { global: { plugins: [[UiKitPlugin, { locale: 'en-US', icons: { retry: 'mdi-test' }, permissions: () => true }]] } });
    expect(wrapper.text()).toBe('en-US|ltr|Confirm|mdi-test|true|true');
    expect(hasUiAsyncData({ status: 'success', data: 0 })).toBe(true);
    expect(hasUiAsyncData({ status: 'empty' })).toBe(false);
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
    expect(kit.can({ any: [] })).toBe(false);
    expect(kit.can({ all: [] })).toBe(true);
    expect(kit.can('')).toBe(false);
  });

  it('denies safely when an evaluator throws', () => {
    const kit = createUiKit({ permissions: { evaluator: () => { throw new Error('broken'); } } });
    expect(kit.can('read')).toBe(false);
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

  it('supports state component variants, actions, details, progress and transitions', async () => {
    const loading = mount(UiLoadingState, { props: { progress: 120, variant: 'compact' } });
    expect(loading.get('progress').attributes('value')).toBe('100');
    const empty = mount(UiEmptyState, { props: { primaryLabel: 'Create', secondaryLabel: 'Clear', headingLevel: 3 } });
    await empty.findAll('button')[0].trigger('click'); await empty.findAll('button')[1].trigger('click');
    expect(empty.emitted('primary')).toHaveLength(1); expect(empty.emitted('secondary')).toHaveLength(1); expect(empty.find('h3').exists()).toBe(true);
    const error = mount(UiErrorState, { props: { error: new Error('safe detail'), showDetails: true } }); expect(error.text()).toContain('safe detail');
    const denied = mount(UiPermissionDenied, { props: { actionLabel: 'Back' } }); await denied.get('button').trigger('click'); expect(denied.emitted('action')).toHaveLength(1);
    const asyncState = mount(UiAsyncState, { props: { status: 'loading' }, slots: { loading: 'Custom loading', default: 'Done' } });
    expect(asyncState.text()).toBe('Custom loading'); await asyncState.setProps({ status: 'success' }); await nextTick(); expect(asyncState.text()).toBe('Done');
  });

  it('exposes valid light and dark themes and accepts overrides', () => {
    expect(defaultThemes.modern.dark).toBe(false);
    expect(defaultThemes['modern-dark'].dark).toBe(true);
    expect(createUiKitThemes({ overrides: { brand: { dark: false, colors: { primary: '#000000' } } } }).brand).toBeDefined();
  });

  it('validates themes and returns mutation-safe registries', () => {
    const source = { dark: false, colors: { primary: '#123456' } };
    const first = createUiKitThemes({ overrides: { brand: source } }); const second = createUiKitThemes();
    source.colors.primary = '#ffffff'; first.modern.colors.primary = '#000000';
    expect(first.brand.colors.primary).toBe('#123456'); expect(second.modern.colors.primary).not.toBe('#000000');
    expect(() => createUiKitThemes({ overrides: { '': source } })).toThrow(TypeError);
    expect(() => createUiKitThemes({ overrides: { bad: { dark: false, colors: { primary: '' } } } })).toThrow(TypeError);
  });
});
