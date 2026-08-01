import { describe, expect, it, vi } from 'vitest';
import { createAxiosMock, createPaginatedResponse, flushTable, mountDataTable } from './harness';

describe('CustomDataTableV2 request contract', () => {
  it('fetches immediately on mount with zero-based pagination', async () => {
    const axios = createAxiosMock(createPaginatedResponse([{ id: 1, name: 'Remote', status: 'ACTIVE' }], 0, 25, 51, 3));
    const { wrapper } = await mountDataTable({ axios, props: { autoFetch: true, pageSize: 25, queryParams: { tenant: 'a' } } });
    await flushTable();
    expect(axios.get).toHaveBeenCalledWith('/api/items', { params: { tenant: 'a', page: 0, size: 25 } });
    expect(wrapper.text()).toContain('Remote');
    expect((wrapper.vm as any).getItems()).toEqual([{ id: 1, name: 'Remote', status: 'ACTIVE' }]);
  });

  it('normalizes array, content, object, empty, and malformed unpaged responses', async () => {
    const axios = createAxiosMock();
    const { wrapper } = await mountDataTable({ axios, props: { showPagination: false } });
    for (const [data, expected] of [
      [[{ id: 1, name: 'Array' }], 1],
      [{ content: [{ id: 2, name: 'Content' }] }, 1],
      [{ id: 3, name: 'Object' }, 1],
      [null, 0]
    ] as const) {
      axios.get.mockResolvedValueOnce({ data });
      await (wrapper.vm as any).fetchData();
      expect((wrapper.vm as any).getItems()).toHaveLength(expected);
    }
  });

  it('uses a supplied Axios instance and clears loading after rejection', async () => {
    const axios = createAxiosMock();
    axios.get.mockRejectedValueOnce({ response: { status: 503 } });
    const { wrapper } = await mountDataTable({ axios });
    await (wrapper.vm as any).fetchData();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.data-table-container').attributes('aria-busy')).toBe('false');
  });

  it('exposes loading while a request is pending and recovers on success', async () => {
    let resolve!: (value: unknown) => void;
    const axios = createAxiosMock();
    axios.get.mockReturnValueOnce(new Promise((done) => (resolve = done)));
    const { wrapper } = await mountDataTable({ axios });
    const pending = (wrapper.vm as any).fetchData();
    await flushTable();
    expect(wrapper.find('.data-table-container').attributes('aria-busy')).toBe('true');
    resolve(createPaginatedResponse([{ id: 4, name: 'Recovered' }]));
    await pending;
    await flushTable();
    expect(wrapper.find('.data-table-container').attributes('aria-busy')).toBe('false');
    expect(wrapper.text()).toContain('Recovered');
  });

  it('merges external criteria ahead of generated filters', async () => {
    const axios = createAxiosMock();
    const { wrapper } = await mountDataTable({ axios, props: { queryParams: { fixed: true } } });
    (wrapper.vm as any).setCriteria({ 'status.equals': 'ACTIVE' });
    await (wrapper.vm as any).fetchData({ extra: 1 });
    expect(axios.get).toHaveBeenCalledWith('/api/items', {
      params: { fixed: true, 'status.equals': 'ACTIVE', extra: 1, page: 0, size: 10 }
    });
  });

  it('documents that rapid requests currently have no stale-response guard', async () => {
    let resolveFirst!: (value: unknown) => void;
    const axios = createAxiosMock();
    axios.get
      .mockReturnValueOnce(new Promise((done) => (resolveFirst = done)))
      .mockResolvedValueOnce(createPaginatedResponse([{ id: 2, name: 'Newer' }]));
    const { wrapper } = await mountDataTable({ axios });
    const first = (wrapper.vm as any).fetchData();
    await (wrapper.vm as any).fetchData();
    resolveFirst(createPaginatedResponse([{ id: 1, name: 'Older' }]));
    await first;
    expect((wrapper.vm as any).getItems()[0].name).toBe('Older');
  });
});

describe('CustomDataTableV2 exposed contract', () => {
  it('exposes filters, criteria, selection, item, and grouping operations', async () => {
    const { wrapper } = await mountDataTable({ props: { items: [{ id: 1, name: 'A', status: 'x' }], groupBy: 'status' } });
    const vm = wrapper.vm as any;
    expect(vm.getFilters()).toEqual({});
    expect(vm.getItems()).toHaveLength(1);
    expect(vm.getSelectedItems()).toEqual([]);
    expect(vm.formModel).toBeDefined();
    expect(vm.groupedItems).toHaveLength(1);
    vm.expandAllGroups();
    expect(vm.groupedItems[0].isExpanded).toBe(true);
    vm.collapseAllGroups();
    expect(vm.groupedItems[0].isExpanded).toBe(false);
    vm.clearSelection();
  });
});
