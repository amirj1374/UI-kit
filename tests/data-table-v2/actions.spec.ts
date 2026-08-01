import { defineComponent } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { createAxiosMock, createPaginatedResponse, findActionButton, flushTable, installBrowserMocks, mountDataTable } from './harness';

describe('CustomDataTableV2 pagination and infinite scrolling', () => {
  it('maps a one-based UI page to a zero-based request page', async () => {
    const axios = createAxiosMock(createPaginatedResponse([{ id: 1, name: 'First' }], 0, 10, 30, 3));
    const { wrapper } = await mountDataTable({ axios, props: { autoFetch: true } });
    await flushTable();
    const pagination = wrapper.findComponent({ name: 'VPagination' });
    pagination.vm.$emit('update:modelValue', 2);
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(axios.get).toHaveBeenLastCalledWith('/api/items', { params: { page: 1, size: 10 } });
  });

  it('appends the next page once near the scroll boundary', async () => {
    const axios = createAxiosMock();
    axios.get
      .mockResolvedValueOnce(createPaginatedResponse([{ id: 1, name: 'First' }], 0, 10, 20, 2))
      .mockResolvedValueOnce(createPaginatedResponse([{ id: 2, name: 'Second' }], 1, 10, 20, 2));
    const { wrapper } = await mountDataTable({ axios, props: { autoFetch: true, enableInfiniteScroll: true } });
    await flushTable();
    const container = wrapper.find('.data-table-container');
    Object.defineProperties(container.element, {
      scrollTop: { configurable: true, value: 950 },
      scrollHeight: { configurable: true, value: 1000 },
      clientHeight: { configurable: true, value: 100 }
    });
    await container.trigger('scroll');
    await flushTable();
    expect((wrapper.vm as any).getItems().map((item: any) => item.name)).toEqual(['First', 'Second']);
    expect(axios.get).toHaveBeenLastCalledWith('/api/items', { params: { page: 1, size: 10 } });
  });
});

describe('CustomDataTableV2 mutations', () => {
  it('creates through the generated dialog and refreshes', async () => {
    const axios = createAxiosMock();
    axios.post.mockResolvedValueOnce({ data: { id: 3, name: 'Created' } });
    const { wrapper } = await mountDataTable({ axios, props: { actions: ['create'] } });
    await findActionButton(wrapper, 'ایجاد')!.trigger('click');
    await flushTable();
    const save = [...document.querySelectorAll('button')].find((button) => button.textContent?.trim() === 'ایجاد');
    expect(save).toBeDefined();
    save!.click();
    await flushTable();
    expect(axios.post).toHaveBeenCalledWith('/api/items', { name: undefined, status: undefined });
    expect(axios.get).toHaveBeenCalled();
  });

  it('deletes using the configured unique key and refreshes', async () => {
    const axios = createAxiosMock();
    const row = { code: 'row-a', name: 'Alpha', status: 'ACTIVE' };
    const { wrapper } = await mountDataTable({ axios, props: { items: [row], actions: ['delete'], uniqueKey: 'code' } });
    await findActionButton(wrapper, 'حذف')!.trigger('click');
    await flushTable();
    const confirm = [...document.querySelectorAll('button')].filter((button) => button.textContent?.trim() === 'حذف').at(-1);
    confirm!.click();
    await flushTable();
    expect(axios.delete).toHaveBeenCalledWith('/api/items/row-a');
  });

  it('opens a custom action with the original row payload', async () => {
    const Seen = defineComponent({ props: ['item'], template: '<div data-test="custom-row">{{ item.name }}</div>' });
    const { wrapper } = await mountDataTable({
      props: { items: [{ id: 1, name: 'Alpha', status: 'ACTIVE' }], customActions: [{ title: 'Inspect', component: Seen }] }
    });
    await findActionButton(wrapper, 'Inspect')!.trigger('click');
    await flushTable();
    expect(document.body.textContent).toContain('Alpha');
  });
});

describe('CustomDataTableV2 export, download, and errors', () => {
  it('requests server export with current pagination and cleans up its object URL', async () => {
    const browser = installBrowserMocks();
    const axios = createAxiosMock();
    axios.get.mockResolvedValueOnce({ data: btoa('file') });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const { wrapper } = await mountDataTable({ axios, props: { enableExport: true, exportUrl: '/exports/items', exportFileName: 'items.xlsx' } });
    await findActionButton(wrapper, 'گزارش کلی')!.trigger('click');
    await flushTable();
    expect(axios.get).toHaveBeenCalledWith('/exports/items', { params: { page: 0, size: 10 } });
    expect(click).toHaveBeenCalled();
    expect(browser.revokeObjectURL).toHaveBeenCalledWith('blob:table-test');
  });

  it('downloads a row file through fetch and cleans up its temporary URL', async () => {
    const browser = installBrowserMocks();
    const response = new Response(new Blob(['file']), { status: 200, headers: { 'content-type': 'application/pdf' } });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const { wrapper } = await mountDataTable({
      props: { items: [{ id: 1, name: 'Alpha', status: 'ACTIVE', file: '/files/a.pdf' }], downloadLink: { File: 'file' } }
    });
    await findActionButton(wrapper, 'File')!.trigger('click');
    await flushTable();
    expect(fetch).toHaveBeenCalledWith('/files/a.pdf', expect.objectContaining({ method: 'GET', credentials: 'include' }));
    expect(browser.revokeObjectURL).toHaveBeenCalledWith('blob:table-test');
    vi.unstubAllGlobals();
  });

  it('renders a failed request as an accessible alert and recovers later', async () => {
    const axios = createAxiosMock();
    axios.get.mockRejectedValueOnce({ response: { status: 500 } });
    const { wrapper } = await mountDataTable({ axios });
    await (wrapper.vm as any).fetchData();
    await flushTable();
    expect(wrapper.find('[role="alert"]').text()).toContain('500');
    axios.get.mockResolvedValueOnce(createPaginatedResponse([{ id: 1, name: 'Recovered' }]));
    await (wrapper.vm as any).fetchData();
    await flushTable();
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    expect(wrapper.text()).toContain('Recovered');
  });
});
