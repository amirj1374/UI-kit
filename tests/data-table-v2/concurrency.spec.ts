import { describe, expect, it } from 'vitest';
import { createAxiosMock, createPaginatedResponse, flushTable, mountDataTable } from './harness';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
}

describe('CustomDataTableV2 latest-request-wins sequencing', () => {
  it('keeps a fast filter result when the slow initial request resolves later', async () => {
    const slow = deferred<any>();
    const axios = createAxiosMock();
    axios.get.mockReturnValueOnce(slow.promise).mockResolvedValueOnce(createPaginatedResponse([{ id: 2, name: 'Filtered' }]));
    const { wrapper } = await mountDataTable({ axios });
    const initial = (wrapper.vm as any).fetchData();
    await (wrapper.vm as any).fetchData({ name: 'Filtered' });
    slow.resolve(createPaginatedResponse([{ id: 1, name: 'Stale' }]));
    await initial;
    expect((wrapper.vm as any).getItems()[0].name).toBe('Filtered');
  });

  it('keeps a fast refresh result when a slow page request resolves later', async () => {
    const slow = deferred<any>();
    const axios = createAxiosMock();
    axios.get.mockReturnValueOnce(slow.promise).mockResolvedValueOnce(createPaginatedResponse([{ id: 3, name: 'Refreshed' }]));
    const { wrapper } = await mountDataTable({ axios });
    const page = (wrapper.vm as any).fetchData({ page: 2 });
    await (wrapper.vm as any).fetchData();
    slow.resolve(createPaginatedResponse([{ id: 2, name: 'Old page' }]));
    await page;
    expect((wrapper.vm as any).getItems()[0].name).toBe('Refreshed');
  });

  it('does not publish state after unmount', async () => {
    const slow = deferred<any>();
    const axios = createAxiosMock();
    axios.get.mockReturnValueOnce(slow.promise);
    const { wrapper } = await mountDataTable({ axios, props: { items: [{ id: 1, name: 'Local' }] } });
    const pending = (wrapper.vm as any).fetchData();
    wrapper.unmount();
    slow.resolve(createPaginatedResponse([{ id: 2, name: 'Remote' }]));
    await pending;
    expect((wrapper.vm as any).getItems()[0].name).toBe('Local');
  });

  it('ignores an older rejection after a newer success', async () => {
    const slow = deferred<any>();
    const axios = createAxiosMock();
    axios.get.mockReturnValueOnce(slow.promise).mockResolvedValueOnce(createPaginatedResponse([{ id: 2, name: 'Current' }]));
    const { wrapper } = await mountDataTable({ axios });
    const older = (wrapper.vm as any).fetchData();
    await (wrapper.vm as any).fetchData();
    slow.reject({ response: { status: 500 } });
    await older;
    await flushTable();
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    expect((wrapper.vm as any).getItems()[0].name).toBe('Current');
  });

  it('does not let an older request clear loading for the newest request', async () => {
    const older = deferred<any>();
    const newest = deferred<any>();
    const axios = createAxiosMock();
    axios.get.mockReturnValueOnce(older.promise).mockReturnValueOnce(newest.promise);
    const { wrapper } = await mountDataTable({ axios });
    const first = (wrapper.vm as any).fetchData();
    const second = (wrapper.vm as any).fetchData();
    older.resolve(createPaginatedResponse([{ id: 1 }]));
    await first;
    await flushTable();
    expect(wrapper.find('.data-table-container').attributes('aria-busy')).toBe('true');
    newest.resolve(createPaginatedResponse([{ id: 2 }]));
    await second;
    await flushTable();
    expect(wrapper.find('.data-table-container').attributes('aria-busy')).toBe('false');
  });
});
