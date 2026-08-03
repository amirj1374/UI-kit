import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { describe, expect, it, vi } from 'vitest';

vi.mock('vue3-lottie', () => ({
  Vue3Lottie: { name: 'Vue3Lottie', template: '<div data-test="lottie" />' }
}));
import Loading from '@/components/Loading.vue';
import { useCustomizerStore } from '@/stores/customizer';

function setup() {
  const pinia = createPinia();
  setActivePinia(pinia);
  const store = useCustomizerStore();
  const wrapper = mount(Loading, {
    props: { label: 'Loading account', animationLink: '' },
    global: { plugins: [pinia], stubs: { Vue3Lottie: true } }
  });
  return { wrapper, store };
}

describe('Loading', () => {
  it('is hidden when the global loading state is false', () => {
    const { wrapper } = setup();
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });

  it('exposes accessible busy state without requiring the animation asset', async () => {
    const { wrapper, store } = setup();
    store.SET_LOADING(true);
    await wrapper.vm.$nextTick();
    const status = wrapper.get('[role="status"]');
    expect(status.attributes('aria-busy')).toBe('true');
    expect(status.attributes('aria-label')).toBe('Loading account');
    expect(wrapper.findComponent({ name: 'Vue3Lottie' }).exists()).toBe(false);
  });
});
