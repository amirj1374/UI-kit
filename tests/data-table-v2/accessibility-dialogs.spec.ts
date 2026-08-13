import { describe, expect, it, vi } from 'vitest';
import { createAxiosMock, findActionButton, findTableRows, flushTable, mountDataTable } from './harness';

describe('CustomDataTableV2 accessibility', () => {
  it('names the table region from its title and reports busy state', async () => {
    const { wrapper } = await mountDataTable({ props: { title: 'Accounts' } });
    const region = wrapper.find('[role="region"].data-table-container');
    expect(region.attributes('aria-label')).toBe('Accounts');
    expect(region.attributes('aria-busy')).toBe('false');
  });

  it('labels group controls, row selection, and icon-only copy actions', async () => {
    const { wrapper } = await mountDataTable({
      props: {
        items: [{ code: 'a', name: 'Alpha', group: 'One' }],
        headers: [{ title: 'Name', key: 'name', showCopyButton: true }],
        selectable: true,
        uniqueKey: 'code',
        groupBy: 'group',
        defaultExpanded: true
      }
    });
    expect(wrapper.find('.group-header').attributes('aria-label')).toContain('Collapse group');
    expect(wrapper.find('[aria-label="Select row a"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Copy Name"]').exists()).toBe(true);
  });

  it('labels and cancels the create and delete dialogs', async () => {
    const { wrapper } = await mountDataTable({
      props: { items: [{ id: 1, name: 'Alpha' }], actions: ['create', 'delete'] }
    });
    await findActionButton(wrapper, 'ایجاد')!.trigger('click');
    await flushTable();
    expect(document.querySelector('[aria-label="Create or edit row"]')).not.toBeNull();
    const cancel = [...document.querySelectorAll('button')].find((button) => button.textContent?.trim() === 'انصراف');
    cancel!.click();
    await flushTable();
    await findActionButton(wrapper, 'حذف')!.trigger('click');
    await flushTable();
    expect(document.querySelector('[aria-label="Delete row confirmation"]')).not.toBeNull();
  });

  it('keeps HTTP errors concise and accessible across representative statuses', async () => {
    const axios = createAxiosMock();
    const { wrapper } = await mountDataTable({ axios });
    for (const status of [401, 403, 404, 409, 422, 500]) {
      axios.get.mockRejectedValueOnce({ response: { status, data: { secret: 'not rendered' } } });
      await (wrapper.vm as any).fetchData();
      await flushTable();
      expect(wrapper.find('[role="alert"]').text()).toContain(String(status));
      expect(wrapper.text()).not.toContain('secret');
    }
  });

  it('distinguishes network and unexpected errors and recovers', async () => {
    const axios = createAxiosMock();
    const { wrapper } = await mountDataTable({ axios });
    axios.get.mockRejectedValueOnce({ request: {} });
    await (wrapper.vm as any).fetchData();
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    axios.get.mockRejectedValueOnce(new Error('unexpected'));
    await (wrapper.vm as any).fetchData();
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    axios.get.mockResolvedValueOnce({ data: { content: [], page: null } });
    await (wrapper.vm as any).fetchData();
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });
});
