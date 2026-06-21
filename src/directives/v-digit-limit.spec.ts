import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import DigitLimit from './v-digit-limit';

const Host = defineComponent({
  directives: { digitLimit: DigitLimit },
  template: `<input v-digit-limit="5" />`
});

describe('v-digit-limit directive', () => {
  it('strips non-digit characters', async () => {
    const wrapper = mount(Host);
    const input = wrapper.find('input').element as HTMLInputElement;

    input.value = '12a3b4';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('1234');
  });

  it('limits to the configured number of digits', () => {
    const wrapper = mount(Host);
    const input = wrapper.find('input').element as HTMLInputElement;

    input.value = '1234567890';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('12345');
  });

  it('leaves an already-valid value untouched without recursing', () => {
    const wrapper = mount(Host);
    const input = wrapper.find('input').element as HTMLInputElement;

    input.value = '123';
    // Should not throw (no infinite re-dispatch) and value stays the same.
    expect(() => input.dispatchEvent(new Event('input'))).not.toThrow();
    expect(input.value).toBe('123');
  });

  it('removes its listener on unmount', () => {
    const wrapper = mount(Host);
    const input = wrapper.find('input').element as HTMLInputElement;
    wrapper.unmount();

    input.value = '12a';
    input.dispatchEvent(new Event('input'));
    // Listener gone -> value not cleaned
    expect(input.value).toBe('12a');
  });
});
