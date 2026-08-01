import { describe, expect, it, vi } from 'vitest';
import { findActionButton, findTableRows, flushTable, mountDataTable } from './harness';

const items = [
  { code: 'a', name: 'Alpha', status: 'one' },
  { code: 'b', name: 'Beta', status: 'two' }
];

describe('CustomDataTableV2 selection and grouping', () => {
  it('selects by custom unique key and emits both public selection events', async () => {
    const { wrapper } = await mountDataTable({ props: { items, selectable: true, multiSelect: true, uniqueKey: 'code' } });
    await findTableRows(wrapper)[0].trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('update:selectedItems')?.at(-1)?.[0]).toEqual([items[0]]);
    expect(wrapper.emitted('selection-change')?.at(-1)?.[0]).toEqual([items[0]]);
    await findTableRows(wrapper)[0].trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('selection-change')?.at(-1)?.[0]).toEqual([]);
  });

  it('syncs selectedItems from the parent and clears through the exposed method', async () => {
    const { wrapper } = await mountDataTable({ props: { items, selectable: true, selectedItems: [items[1]], uniqueKey: 'code' } });
    expect((wrapper.vm as any).getSelectedItems()).toEqual([items[1]]);
    (wrapper.vm as any).clearSelection();
    expect((wrapper.vm as any).getSelectedItems()).toEqual([]);
  });

  it('renders groups and toggles expansion by keyboard', async () => {
    vi.useFakeTimers();
    const { wrapper } = await mountDataTable({ props: { items, groupBy: 'status' } });
    const group = wrapper.find('[role="button"].group-header');
    expect(group.exists()).toBe(true);
    expect(group.attributes('aria-expanded')).toBe('false');
    await group.trigger('keydown', { key: 'Enter' });
    await vi.runAllTimersAsync();
    await flushTable();
    expect(group.attributes('aria-expanded')).toBe('true');
    vi.useRealTimers();
  });
});

describe('CustomDataTableV2 routing and extension points', () => {
  it('navigates route templates with row values', async () => {
    const { wrapper, router } = await mountDataTable({
      routes: [{ path: '/items/:code', component: { template: '<div />' } }],
      props: { items: [items[0]], routes: { details: '/items/{code}' }, uniqueKey: 'code' }
    });
    const button = findActionButton(wrapper, 'DETAILS');
    expect(button).toBeDefined();
    const push = vi.spyOn(router, 'push');
    await button!.trigger('click');
    await flushTable();
    expect(push).toHaveBeenCalledWith('/items/a');
  });

  it('does not navigate when a route template field is missing', async () => {
    const { wrapper, router } = await mountDataTable({ props: { items: [items[0]], routes: { details: '/items/{missing}' } } });
    await findActionButton(wrapper, 'DETAILS')!.trigger('click');
    await flushTable();
    expect(router.currentRoute.value.path).toBe('/');
  });

  it('provides the documented inline filter slot props', async () => {
    const slot = vi.fn(() => 'slot-actions');
    const { wrapper } = await mountDataTable({ props: { inlineFilter: true }, slots: { 'inline-filter-actions': slot } });
    expect(wrapper.text()).toContain('slot-actions');
    const slotProps = slot.mock.calls[0][0];
    expect(slotProps.applyFilter).toEqual(expect.any(Function));
    expect(slotProps.resetFilter).toEqual(expect.any(Function));
    expect(slotProps.filterModel).toBeDefined();
  });
});
