import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import BaseIcon from '@/components/shared/BaseIcon.vue';

const TestIcon = defineComponent({ template: '<svg data-test="icon" />' });

describe('BaseIcon', () => {
  it('renders a labelled semantic button and preserves callback compatibility', async () => {
    const callback = vi.fn();
    const wrapper = mount(BaseIcon, {
      props: { icon: TestIcon, ariaLabel: 'Edit row', buttonClass: 'custom-icon', emitFunc: callback, rowData: { id: 1 } }
    });
    const button = wrapper.get('button');
    expect(button.attributes('aria-label')).toBe('Edit row');
    expect(button.classes()).toContain('custom-icon');
    await button.trigger('click');
    expect(callback).toHaveBeenCalledWith({ id: 1 });
    expect(wrapper.emitted('action')).toEqual([[{ id: 1 }]]);
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('is non-interactive when no action is supplied', () => {
    const wrapper = mount(BaseIcon, { props: { icon: TestIcon, buttonClass: 'plain-icon' } });
    expect(wrapper.find('button').exists()).toBe(false);
    expect(wrapper.get('[data-test="icon"]').classes()).toContain('plain-icon');
  });
});
