import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';

const passthrough = (name: string, tag = 'div') => defineComponent({
  name,
  inheritAttrs: false,
  template: `<${tag} v-bind="$attrs"><slot /></${tag}>`
});

const mountDialog = (modelValue = true) => mount(ConfirmDialog, {
  props: { modelValue, title: 'Delete record', message: 'This cannot be undone' },
  global: { stubs: {
    VDialog: passthrough('VDialog'),
    VCard: passthrough('VCard'),
    VCardTitle: passthrough('VCardTitle', 'h2'),
    VCardText: passthrough('VCardText'),
    VCardActions: passthrough('VCardActions'),
    VBtn: passthrough('VBtn', 'button')
  } }
});

describe('ConfirmDialog', () => {
  it('renders accessible title and description relations while open', () => {
    const wrapper = mountDialog();
    const dialog = wrapper.getComponent({ name: 'VDialog' });
    expect(dialog.attributes('aria-labelledby')).toContain('confirm-dialog-title-');
    expect(dialog.attributes('aria-describedby')).toContain('confirm-dialog-message-');
    expect(wrapper.text()).toContain('Delete record');
  });

  it('emits confirm and cancel behavior', async () => {
    const wrapper = mountDialog();
    const buttons = wrapper.findAll('button');
    await buttons[0].trigger('click');
    await buttons[1].trigger('click');
    expect(wrapper.emitted('confirm')).toHaveLength(1);
    expect(wrapper.emitted('cancel')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')).toContainEqual([false]);
  });

  it('retains autofocus on the primary action', () => {
    const wrapper = mountDialog();
    expect(wrapper.findAll('button')[0].attributes()).toHaveProperty('autofocus');
  });
});
