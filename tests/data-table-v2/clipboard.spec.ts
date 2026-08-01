import { describe, expect, it, vi } from 'vitest';
import { findTableRows, flushTable, installBrowserMocks, mountDataTable } from './harness';

describe('CustomDataTableV2 clipboard behavior', () => {
  it('copies cell text through the preview dialog', async () => {
    const browser = installBrowserMocks();
    const { wrapper } = await mountDataTable({
      props: {
        items: [{ id: 1, name: 'Alpha', status: 'ACTIVE' }],
        headers: [{ title: 'Name', key: 'name', showCopyButton: true }]
      }
    });
    await findTableRows(wrapper)[0].find('button').trigger('click');
    await flushTable();
    const copy = [...document.querySelectorAll('button')].find((button) => button.textContent?.includes('کپی متن'));
    copy!.click();
    await flushTable();
    expect(browser.writeText).toHaveBeenCalledWith('Alpha');
  });

  it('falls back to execCommand when the Clipboard API rejects', async () => {
    const browser = installBrowserMocks();
    browser.writeText.mockRejectedValueOnce(new Error('denied'));
    const execCommand = vi.fn(() => true);
    Object.defineProperty(document, 'execCommand', { configurable: true, value: execCommand });
    const { wrapper } = await mountDataTable({
      props: { items: [{ id: 1, name: 'Alpha' }], headers: [{ title: 'Name', key: 'name', showCopyButton: true }] }
    });
    await findTableRows(wrapper)[0].find('button').trigger('click');
    await flushTable();
    [...document.querySelectorAll('button')].find((button) => button.textContent?.includes('کپی متن'))!.click();
    await flushTable();
    expect(execCommand).toHaveBeenCalledWith('copy');
  });
});
