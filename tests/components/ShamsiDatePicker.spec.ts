import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ShamsiDatePicker from '@/components/shared/ShamsiDatePicker.vue';

const PickerStub = defineComponent({
  name: 'Vue3PersianDatetimePicker',
  props: ['modelValue', 'disabled', 'range', 'customInput'],
  emits: ['change', 'update:modelValue'],
  template: '<input data-test="picker" :disabled="disabled" />'
});

const TextFieldStub = defineComponent({
  name: 'VTextField',
  props: ['id', 'label', 'modelValue', 'density', 'variant', 'appendInnerIcon'],
  template: '<input data-test="date-field" :id="id" />'
});

const mountPicker = (props: Record<string, unknown> = {}) => mount(ShamsiDatePicker, {
  props: { modelValue: '', ...props },
  global: { stubs: { Vue3PersianDatetimePicker: PickerStub, VTextField: TextFieldStub } }
});

describe('ShamsiDatePicker', () => {
  it('passes disabled state to the underlying picker and supports empty values', () => {
    const wrapper = mountPicker({ disabled: true });
    expect(wrapper.get('input').attributes()).toHaveProperty('disabled');
    expect(wrapper.getComponent(PickerStub).props('modelValue')).toBe('');
  });

  it('uses a standard text field and forwards the selected field appearance', () => {
    const wrapper = mountPicker({
      label: 'تاریخ سررسید',
      variant: 'filled',
      density: 'compact'
    });

    expect(wrapper.attributes('data-variant')).toBe('filled');
    expect(wrapper.attributes('data-density')).toBe('compact');
    expect(wrapper.getComponent(TextFieldStub).props('label')).toBe('تاریخ سررسید');
    expect(wrapper.getComponent(TextFieldStub).props('variant')).toBe('filled');
    expect(wrapper.getComponent(TextFieldStub).props('density')).toBe('compact');
    expect(wrapper.getComponent(PickerStub).props('customInput')).toBe(`#${wrapper.get('[data-test="date-field"]').attributes('id')}`);
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
