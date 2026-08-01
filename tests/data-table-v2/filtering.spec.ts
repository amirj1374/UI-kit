import { describe, expect, it, vi } from 'vitest';
import { createAxiosMock, flushTable, mountDataTable } from './harness';

describe('CustomDataTableV2 filtering', () => {
  it('debounces inline filters and excludes empty values', async () => {
    vi.useFakeTimers();
    const axios = createAxiosMock();
    let slotProps: any;
    await mountDataTable({
      axios,
      props: { inlineFilter: true },
      slots: { 'inline-filter-actions': (props: any) => { slotProps = props; return 'filters'; } }
    });
    slotProps.filterModel.name = 'Alpha';
    slotProps.filterModel.status = '';
    slotProps.applyFilter();
    expect(axios.get).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(300);
    expect(axios.get).toHaveBeenCalledWith('/api/items', { params: { name: 'Alpha', page: 0, size: 10 } });
    vi.useRealTimers();
  });

  it('maps configured operators to Spring-style criteria', async () => {
    vi.useFakeTimers();
    const axios = createAxiosMock();
    let slotProps: any;
    await mountDataTable({
      axios,
      props: {
        inlineFilter: true,
        headers: [{ title: 'Name', key: 'name', filterOperators: ['contains'], defaultFilterOperator: 'contains' }]
      },
      slots: { 'inline-filter-actions': (props: any) => { slotProps = props; return 'filters'; } }
    });
    slotProps.filterModel.name = 'Ali';
    slotProps.applyFilter();
    await vi.advanceTimersByTimeAsync(300);
    expect(axios.get).toHaveBeenCalledWith('/api/items', { params: { 'name.contains': 'Ali', page: 0, size: 10 } });
    vi.useRealTimers();
  });

  it('lets a custom filter adapter replace the generated request criteria', async () => {
    vi.useFakeTimers();
    const axios = createAxiosMock();
    let slotProps: any;
    const adapter = vi.fn((raw) => ({ criteria: JSON.stringify(raw) }));
    await mountDataTable({
      axios,
      props: { inlineFilter: true, filterAdapter: adapter },
      slots: { 'inline-filter-actions': (props: any) => { slotProps = props; return 'filters'; } }
    });
    slotProps.filterModel.name = 'A';
    slotProps.applyFilter();
    await vi.advanceTimersByTimeAsync(300);
    expect(adapter).toHaveBeenCalledWith({ name: 'A' });
    expect(axios.get).toHaveBeenCalledWith('/api/items', { params: { criteria: '{"name":"A"}', page: 0, size: 10 } });
    vi.useRealTimers();
  });

  it('resets filters to page one through the public slot action', async () => {
    vi.useFakeTimers();
    const axios = createAxiosMock();
    let slotProps: any;
    await mountDataTable({
      axios,
      props: { inlineFilter: true },
      slots: { 'inline-filter-actions': (props: any) => { slotProps = props; return 'filters'; } }
    });
    slotProps.filterModel.name = 'A';
    slotProps.resetFilter();
    await vi.advanceTimersByTimeAsync(300);
    expect(axios.get).toHaveBeenLastCalledWith('/api/items', { params: { page: 0, size: 10 } });
    vi.useRealTimers();
  });
});
