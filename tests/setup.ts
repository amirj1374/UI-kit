import { afterEach } from 'vitest';
import { config } from '@vue/test-utils';

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  configurable: true,
  value: ResizeObserverStub
});

afterEach(() => {
  document.body.innerHTML = '';
});

config.global.renderStubDefaultSlot = true;
