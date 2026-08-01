import { createPinia } from 'pinia';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createMemoryHistory, createRouter, type RouteRecordRaw, type Router } from 'vue-router';
import { createVuetify } from 'vuetify';
import { nextTick, type Component } from 'vue';
import { vi, type Mock } from 'vitest';
import CustomDataTableV2 from '@/components/shared/data-table-v2/CustomDataTableV2.vue';
import type { Header, TableItem } from '@/types/componentTypes/DataTableTypes';

export interface AxiosMock {
  get: Mock;
  post: Mock;
  put: Mock;
  delete: Mock;
}

export const createTableHeaders = (): Header[] => [
  { title: 'Name', key: 'name' },
  { title: 'Status', key: 'status' }
];

export const createPaginatedResponse = (
  content: TableItem[] = [],
  page = 0,
  size = 10,
  totalElements = content.length,
  totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / size)
) => ({ data: { content, page: { number: page, size, totalElements, totalPages } } });

export function createAxiosMock(response = createPaginatedResponse()): AxiosMock {
  return {
    get: vi.fn().mockResolvedValue(response),
    post: vi.fn().mockResolvedValue({ data: undefined }),
    put: vi.fn().mockResolvedValue({ data: undefined }),
    delete: vi.fn().mockResolvedValue({ data: undefined })
  };
}

export function createTableRouter(routes: RouteRecordRaw[] = []): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }, ...routes]
  });
}

export interface MountDataTableOptions {
  props?: Record<string, unknown>;
  slots?: Record<string, string | Component | ((props: any) => any)>;
  routes?: RouteRecordRaw[];
  axios?: AxiosMock;
  attachTo?: Element | string;
}

export async function mountDataTable(options: MountDataTableOptions = {}): Promise<{
  wrapper: VueWrapper;
  router: Router;
  axios: AxiosMock;
}> {
  const axios = options.axios ?? createAxiosMock();
  const router = createTableRouter(options.routes);
  const vuetify = createVuetify();
  await router.push('/');
  await router.isReady();

  const wrapper = mount(CustomDataTableV2, {
    attachTo: options.attachTo,
    props: {
      apiResource: '/api/items',
      headers: createTableHeaders(),
      items: [],
      height: 360,
      autoFetch: false,
      axiosInstance: axios,
      ...options.props
    },
    slots: options.slots,
    global: { plugins: [createPinia(), router, vuetify] }
  });
  await nextTick();
  return { wrapper, router, axios };
}

export async function flushTable(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await nextTick();
}

export function findTableRows(wrapper: VueWrapper) {
  return wrapper.findAll('tbody tr');
}

export function findActionButton(wrapper: VueWrapper, label: string) {
  return wrapper.findAll('button').find((button) => button.text().includes(label));
}

export function installBrowserMocks() {
  const createObjectURL = vi.fn(() => 'blob:table-test');
  const revokeObjectURL = vi.fn();
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL });
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  return { createObjectURL, revokeObjectURL, writeText };
}
