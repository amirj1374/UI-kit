import { createPinia, type Pinia } from 'pinia';
import { mount, type ComponentMountingOptions } from '@vue/test-utils';
import { createMemoryHistory, createRouter, type Router } from 'vue-router';
import { createVuetify } from 'vuetify';
import type { Component } from 'vue';

export interface TestPlugins {
  pinia: Pinia;
  router: Router;
}

export function createTestPlugins(): TestPlugins {
  return {
    pinia: createPinia(),
    router: createRouter({ history: createMemoryHistory(), routes: [] })
  };
}

export function mountWithApp<T extends Component>(
  component: T,
  options: ComponentMountingOptions<T> = {},
  plugins = createTestPlugins()
) {
  const vuetify = createVuetify();
  const global = options.global ?? {};
  return {
    wrapper: mount(component, {
      ...options,
      global: {
        ...global,
        plugins: [vuetify, plugins.pinia, plugins.router, ...(global.plugins ?? [])]
      }
    }),
    ...plugins
  };
}
