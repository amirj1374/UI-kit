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

Object.defineProperty(globalThis, 'visualViewport', {
  configurable: true,
  value: { width: 1024, height: 768, offsetLeft: 0, offsetTop: 0, addEventListener() {}, removeEventListener() {} }
});

afterEach(() => {
  document.body.innerHTML = '';
});

config.global.renderStubDefaultSlot = true;
