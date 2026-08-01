import { describe, expect, it, vi } from 'vitest';
import { findActionButton, flushTable, mountDataTable } from './harness';

vi.mock('xlsx', () => { throw new Error('Cannot find module xlsx'); });

describe('CustomDataTableV2 missing XLSX behavior', () => {
  it('shows the clear optional-dependency error, performs no download, and clears loading', async () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const { wrapper } = await mountDataTable({
      props: { enableExport: true, items: [{ id: 1, name: 'Alpha' }], headers: [{ title: 'Name', key: 'name' }] }
    });
    const exportButton = findActionButton(wrapper, 'گزارش کلی')!;
    await exportButton.trigger('click');
    await vi.waitFor(() => expect(wrapper.find('[role="alert"]').exists()).toBe(true));
    expect(wrapper.find('[role="alert"]').text()).toContain('optional "xlsx" dependency');
    expect(click).not.toHaveBeenCalled();
    expect(exportButton.attributes('disabled')).toBeUndefined();
  });
});
