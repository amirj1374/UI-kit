import { defineComponent, markRaw } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppStepper from '@/components/common/AppStepper.vue';

const First = markRaw(defineComponent({ template: '<div>First content</div>' }));
const Second = markRaw(defineComponent({ template: '<div>Second content</div>' }));
const steps = [{ title: 'First', section: First }, { title: 'Second', section: Second }];

describe('AppStepper', () => {
  it('uses a 1-based model and marks the current step', () => {
    const wrapper = mount(AppStepper, { props: { steps, modelValue: 1 } });
    expect(wrapper.text()).toContain('First content');
    expect(wrapper.findAll('button')[0].attributes('aria-current')).toBe('step');
    expect(wrapper.attributes('dir')).toBe('rtl');
  });

  it('emits both declared events when a step is clicked', async () => {
    const wrapper = mount(AppStepper, { props: { steps, modelValue: 1 } });
    await wrapper.findAll('button')[1].trigger('click');
    expect(wrapper.emitted('step-click')).toEqual([[2]]);
    expect(wrapper.emitted('update:modelValue')).toEqual([[2]]);
  });

  it('supports native keyboard-capable buttons and disabled steps', async () => {
    const disabledSteps = [steps[0], { ...steps[1], disabled: true }];
    const wrapper = mount(AppStepper, { props: { steps: disabledSteps, modelValue: 1, direction: 'ltr' } });
    const button = wrapper.findAll('button')[1];
    expect(button.attributes()).toHaveProperty('disabled');
    expect(wrapper.attributes('dir')).toBe('ltr');
    await button.trigger('click');
    expect(wrapper.emitted('step-click')).toBeUndefined();
  });
});
