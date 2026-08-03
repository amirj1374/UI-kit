import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ShamsiDatePicker from '@/components/shared/ShamsiDatePicker.vue';

const PickerStub = defineComponent({
  name: 'Vue3PersianDatetimePicker',
  props: ['modelValue', 'disabled', 'range'],
  emits: ['change', 'update:modelValue'],
  template: '<input data-test="picker" :disabled="disabled" />'
});

const mountPicker = (props: Record<string, unknown> = {}) => mount(ShamsiDatePicker, {
  props: { modelValue: '', ...props },
  global: { stubs: { Vue3PersianDatetimePicker: PickerStub } }
});

describe('ShamsiDatePicker', () => {
  it('passes disabled state to the underlying picker and supports empty values', () => {
    const wrapper = mountPicker({ disabled: true });
    expect(wrapper.get('input').attributes()).toHaveProperty('disabled');
    expect(wrapper.getComponent(PickerStub).props('modelValue')).toBe('');
  });

  it('normalizes a valid change to the existing ISO contract', async () => {
    const wrapper = mountPicker();
    await wrapper.getComponent(PickerStub).vm.$emit('change', new Date('2024-03-20T12:00:00Z'));
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('2024-03-20T12:00:00.000Z');
  });

  it('emits an empty value for invalid input and preserves valid date-only input', async () => {
    const wrapper = mountPicker({ modelValue: '2024-03-20', outputFormat: 'date-only' });
    expect(wrapper.getComponent(PickerStub).props('modelValue')).toBe('2024-03-20');
    await wrapper.getComponent(PickerStub).vm.$emit('change', 'not-a-date');
    expect(wrapper.emitted('update:modelValue')).toEqual([['']]);
  });
});
