import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppHeader from '@/components/layout/AppHeader.vue';

describe('AppHeader', () => {
  it('provides accessible names for default icon-only actions', () => {
    const wrapper = mount(AppHeader, {
      global: {
        stubs: {
          VAppBar: { template: '<header><slot /></header>' },
          VBtn: { template: '<button v-bind="$attrs"><slot /></button>' },
          VIcon: true,
          VSpacer: true
        }
      }
    });
    const labels = wrapper.findAll('button').map((button) => button.attributes('aria-label'));
    expect(labels).toContain('Open navigation menu');
    expect(labels).toContain('Open notifications');
    expect(labels).toContain('Open profile settings');
  });
});
