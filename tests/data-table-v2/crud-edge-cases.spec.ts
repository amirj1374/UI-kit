import { describe, expect, it } from 'vitest';
import { createAxiosMock, findActionButton, findTableRows, flushTable, mountDataTable } from './harness';

async function clickTeleportedButton(label: string, last = false) {
  const matches = [...document.querySelectorAll('button')].filter((button) => button.textContent?.trim() === label);
  const button = last ? matches.at(-1) : matches[0];
  expect(button).toBeDefined();
  button!.click();
  await flushTable();
}

describe('CustomDataTableV2 entity keys', () => {
  it.each([
    ['default id', undefined, { id: 'row-1', name: 'One', status: 'A' }],
    ['custom string key', 'code', { code: 'row-a', name: 'Alpha', status: 'A' }],
    ['numeric zero id', undefined, { id: 0, name: 'Zero', status: 'A' }],
    ['empty-string custom key', 'code', { code: '', name: 'Falsy', status: 'A' }]
  ])('updates an edited row using %s', async (_name, uniqueKey, row) => {
    const axios = createAxiosMock();
    const { wrapper } = await mountDataTable({
      axios,
      props: { items: [row], actions: ['edit'], ...(uniqueKey ? { uniqueKey } : {}) }
    });
    await findActionButton(wrapper, 'ویرایش')!.trigger('click');
    await flushTable();
    await clickTeleportedButton('ذخیره');
    expect(axios.put).toHaveBeenCalledWith('/api/items', row);
    expect(axios.post).not.toHaveBeenCalled();
  });
});

describe('CustomDataTableV2 bulk delete', () => {
  const rows = [
    { code: 'a', name: 'Alpha', status: 'A' },
    { code: 'b', name: 'Beta', status: 'B' }
  ];

  it('deletes selected custom keys, clears selection, and refreshes', async () => {
    const axios = createAxiosMock();
    const { wrapper } = await mountDataTable({
      axios,
      props: { items: rows, selectable: true, multiSelect: true, enableGroupDelete: true, uniqueKey: 'code' }
    });
    await findTableRows(wrapper)[0].trigger('keydown', { key: 'Enter' });
    await findTableRows(wrapper)[1].trigger('keydown', { key: 'Enter' });
    await findActionButton(wrapper, 'حذف گروهی')!.trigger('click');
    await flushTable();
    const confirm = [...document.querySelectorAll('button')].find((button) => button.textContent?.includes('حذف 2 آیتم'));
    confirm!.click();
    await flushTable();
    expect(axios.delete).toHaveBeenCalledWith('/api/items/?ids=a,b');
    expect((wrapper.vm as any).getSelectedItems()).toEqual([]);
    expect(axios.get).toHaveBeenCalled();
  });

  it('keeps selection and reports an error when bulk delete fails', async () => {
    const axios = createAxiosMock();
    axios.delete.mockRejectedValueOnce(new Error('conflict'));
    const { wrapper } = await mountDataTable({
      axios,
      props: { items: rows, selectable: true, multiSelect: true, enableGroupDelete: true, uniqueKey: 'code' }
    });
    await findTableRows(wrapper)[0].trigger('keydown', { key: 'Enter' });
    await findActionButton(wrapper, 'حذف گروهی')!.trigger('click');
    await flushTable();
    [...document.querySelectorAll('button')].find((button) => button.textContent?.includes('حذف 1 آیتم'))!.click();
    await flushTable();
    expect((wrapper.vm as any).getSelectedItems()).toEqual([rows[0]]);
    expect(document.body.textContent).toContain('خطا');
  });

  it('documents bulkMode as single-selection even when multiSelect is true', async () => {
    const { wrapper } = await mountDataTable({
      props: { items: rows, selectable: true, multiSelect: true, bulkMode: true, uniqueKey: 'code' }
    });
    await findTableRows(wrapper)[0].trigger('click');
    await findTableRows(wrapper)[1].trigger('click');
    expect((wrapper.vm as any).getSelectedItems()).toEqual([rows[1]]);
  });
});
