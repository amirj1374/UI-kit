import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiChatPromptNavigator from './UiChatPromptNavigator.vue';

describe('UiChatPromptNavigator', () => {
  it('marks the active prompt and emits its index', async () => {
    const wrapper = mount(UiChatPromptNavigator, {
      props: {
        prompts: [{ id: 'one', content: 'First prompt' }, { id: 'two', content: 'Second prompt' }],
        activeIndex: 1
      },
      global: { stubs: { VTooltip: { template: '<span><slot name="activator" :props="{}"/><slot/></span>' } } }
    });

    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[1].classes()).toContain('active');
    await buttons[0].trigger('click');
    expect(wrapper.emitted('select')).toEqual([[0]]);
  });

  it('truncates long accessible labels', () => {
    const wrapper = mount(UiChatPromptNavigator, {
      props: { prompts: [{ id: 'one', content: 'a'.repeat(30) }], activeIndex: 0, previewLength: 10 },
      global: { stubs: { VTooltip: { template: '<span><slot name="activator" :props="{}"/><slot/></span>' } } }
    });
    expect(wrapper.get('button').attributes('aria-label')).toBe('aaaaaaaaaa…');
  });
});
