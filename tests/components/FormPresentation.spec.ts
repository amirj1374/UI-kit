import { mount } from '@vue/test-utils';
import UiField from '../../src/components/form/UiField.vue';
import UiFieldMessage from '../../src/components/form/UiFieldMessage.vue';
import UiFormActions from '../../src/components/form/UiFormActions.vue';
import { mountWithApp } from '../utils/mount';

describe('form presentation components', () => {
  it('associates a control with its label and descriptions', () => {
    const wrapper = mount(UiField, {
      props: { id: 'email', label: 'Email', hint: 'Work address', errors: 'Invalid address', required: true },
      slots: { default: `<template #default="control"><input v-bind="control" /></template>` }
    });
    const input = wrapper.get('input');
    expect(wrapper.get('label').attributes('for')).toBe('email');
    expect(input.attributes('id')).toBe('email');
    expect(input.attributes('aria-describedby')).toBe('email-hint email-error');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(wrapper.get('[role="alert"]').text()).toContain('Invalid address');
  });

  it('generates stable distinct IDs and forwards field state', () => {
    const wrapper = mount({
      components: { UiField },
      template: `<UiField label="One" disabled readonly><template #default="control"><input v-bind="control" /></template></UiField><UiField label="Two"><template #default="control"><input v-bind="control" /></template></UiField>`
    });
    const inputs = wrapper.findAll('input');
    expect(inputs[0].attributes('id')).not.toBe(inputs[1].attributes('id'));
    expect(inputs[0].attributes()).toHaveProperty('disabled');
    expect(inputs[0].attributes()).toHaveProperty('readonly');
  });

  it('prioritizes errors over success and supports error slot props', () => {
    const wrapper = mount(UiField, {
      props: { label: 'Name', errors: ['First', 'Second'], success: 'Looks good' },
      slots: { error: `<template #error="{ errors }"><b>{{ errors.join(' / ') }}</b></template>` }
    });
    expect(wrapper.text()).toContain('First / Second');
    expect(wrapper.text()).not.toContain('Looks good');
  });

  it('uses safe Persian RTL fallback without plugin installation', () => {
    const wrapper = mount(UiFormActions);
    expect(wrapper.attributes('dir')).toBe('rtl');
    expect(wrapper.text()).toContain('ذخیره');
    expect(wrapper.text()).toContain('انصراف');
  });

  it('uses provider messages, direction, and semantic icon overrides', () => {
    const Icon = { template: '<i data-testid="confirm-icon" />' };
    const { wrapper } = mountWithApp(UiFormActions, {}, undefined, {
      locale: 'en-US', direction: 'ltr', messages: { 'en-US': { save: 'Apply' } }, icons: { confirm: Icon }
    });
    expect(wrapper.attributes('dir')).toBe('ltr');
    expect(wrapper.text()).toContain('Apply');
    expect(wrapper.text()).toContain('Cancel');
    expect(wrapper.get('[data-testid="confirm-icon"]')).toBeTruthy();
  });

  it('emits submit and cancel and reflects loading state', async () => {
    const wrapper = mount(UiFormActions);
    await wrapper.get('[type="submit"]').trigger('click');
    await wrapper.get('[type="button"]').trigger('click');
    expect(wrapper.emitted('submit')).toHaveLength(1);
    expect(wrapper.emitted('cancel')).toHaveLength(1);
    await wrapper.setProps({ loading: true });
    expect(wrapper.attributes('aria-busy')).toBe('true');
    expect(wrapper.get('[type="submit"]').attributes()).toHaveProperty('disabled');
    expect(wrapper.get('[type="button"]').attributes()).toHaveProperty('disabled');
  });

  it('supports secondary and action slot contracts', async () => {
    const wrapper = mount(UiFormActions, {
      slots: {
        secondary: '<a href="#help">Help</a>',
        default: `<template #default="actions"><button class="custom" @click="actions.submit">Custom</button></template>`
      }
    });
    expect(wrapper.get('a').text()).toBe('Help');
    await wrapper.get('.custom').trigger('click');
    expect(wrapper.emitted('submit')).toHaveLength(1);
  });

  it.each([
    ['hint', undefined, undefined],
    ['error', 'alert', undefined],
    ['success', undefined, 'polite'],
    ['warning', 'status', 'polite']
  ] as const)('applies accessible semantics for %s messages', (variant, role, live) => {
    const wrapper = mount(UiFieldMessage, { props: { variant, message: variant } });
    expect(wrapper.attributes('role')).toBe(role);
    expect(wrapper.attributes('aria-live')).toBe(live);
  });

  it('supports message and icon overrides without leaking state', () => {
    const first = mount(UiFieldMessage, { props: { variant: 'error', message: 'Bad', hideIcon: true } });
    const Icon = { template: '<i class="custom-success-icon" />' };
    const second = mountWithApp(UiFieldMessage, { props: { variant: 'success', message: 'Good' } }, undefined, { icons: { success: Icon } }).wrapper;
    expect(first.find('.ui-field-message__icon').exists()).toBe(false);
    expect(second.find('.custom-success-icon').exists()).toBe(true);
  });

  it('reacts to runtime prop changes', async () => {
    const wrapper = mount(UiField, { props: { id: 'code', hint: 'Hint' } });
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    await wrapper.setProps({ errors: 'Required' });
    expect(wrapper.get('[role="alert"]').text()).toContain('Required');
  });
});
