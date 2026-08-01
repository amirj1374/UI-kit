import { createPinia, type Pinia } from 'pinia';
import { mount, type ComponentMountingOptions } from '@vue/test-utils';
import { createMemoryHistory, createRouter, type Router } from 'vue-router';
import { createVuetify } from 'vuetify';
import type { App, Component } from 'vue';
import { provideUiKit } from '../../src/platform/uiKit';
import type { UiKitConfig } from '../../src/platform/types';
const UiKit = { install: (app: App, options: UiKitConfig = {}) => provideUiKit(app, options) };

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
  plugins = createTestPlugins(),
  uiKitConfig: UiKitConfig = {}
) {
  const vuetify = createVuetify();
  const global = options.global ?? {};
  return {
    wrapper: mount(component, {
      ...options,
      global: {
        ...global,
        plugins: [vuetify, [UiKit, uiKitConfig], plugins.pinia, plugins.router, ...(global.plugins ?? [])]
      }
    }),
    ...plugins
  };
}
