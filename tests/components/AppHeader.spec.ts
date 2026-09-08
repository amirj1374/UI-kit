import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppHeader from '@/components/layout/AppHeader.vue';

describe('AppHeader', () => {
  it('does not render a sidebar toggle in horizontal navigation', () => {
    const wrapper = mount(AppHeader, {
      global: {
        stubs: {
          VAppBar: { template: '<header><slot /></header>' },
          VBtn: { template: '<button v-bind="$attrs"><slot /></button>' },
          VMenu: { template: '<div><slot name="activator" :props="{}" /><slot /></div>' },
          VIcon: true,
          VSpacer: true
        }
      }
    });
    const labels = wrapper.findAll('button').map((button) => button.attributes('aria-label'));
    expect(labels).not.toContain('Open navigation menu');
    expect(labels).toContain('Open notifications');
    expect(labels).toContain('Open profile settings');
  });
});
