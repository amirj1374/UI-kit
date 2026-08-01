import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import type { App } from 'vue';
import { createUiKit, provideUiKit } from '../../src/platform/uiKit';
import type { UiKitConfig } from '../../src/platform/types';
import PermissionGuard from '../../src/components/permissions/PermissionGuard.vue';
import UiErrorState from '../../src/components/state/UiErrorState.vue';
import UiLoadingState from '../../src/components/state/UiLoadingState.vue';
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

  it('emits retry from the error state', async () => {
    const wrapper = mount(UiErrorState);
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('retry')).toHaveLength(1);
  });
});
