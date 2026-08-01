import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ToggleSwitch from '@/components/shared/ToggleSwitch.vue';

describe('ToggleSwitch', () => {
  it('renders an accessible native switch with RTL-safe logical positioning', () => {
    const wrapper = mount(ToggleSwitch, { props: { modelValue: false, label: 'Enabled' } });
    const control = wrapper.get('button');
    expect(control.attributes('role')).toBe('switch');
    expect(control.attributes('aria-label')).toBe('Enabled');
    expect(control.attributes('aria-checked')).toBe('false');
    expect(wrapper.html()).toContain('Enabled');
  });

  it('updates a boolean model on activation', async () => {
    const wrapper = mount(ToggleSwitch, { props: { modelValue: false, label: 'Enabled' } });
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
  });

  it('cycles string options without changing the model format', async () => {
    const wrapper = mount(ToggleSwitch, {
      props: {
        modelValue: 'one',
        label: 'Mode',
        type: 'string',
        options: [{ value: 'one' }, { value: 'two' }]
      }
    });
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([['two']]);
  });

  it('uses native keyboard-capable button semantics and blocks disabled activation', async () => {
    const wrapper = mount(ToggleSwitch, { props: { modelValue: false, label: 'Enabled', disabled: true } });
    const control = wrapper.get('button');
    expect(control.attributes()).toHaveProperty('disabled');
    expect(control.element.tagName).toBe('BUTTON');
    expect((control.element as HTMLButtonElement).tabIndex).toBe(-1);
    await control.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });
});
