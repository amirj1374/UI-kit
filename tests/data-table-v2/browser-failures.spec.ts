import { describe, expect, it, vi } from 'vitest';
import { createAxiosMock, findActionButton, flushTable, installBrowserMocks, mountDataTable } from './harness';

describe('CustomDataTableV2 download fallbacks', () => {
  const row = { id: 1, name: 'Alpha', file: '/files/a.pdf' };

  it('falls back to Axios blob download when fetch fails', async () => {
    const browser = installBrowserMocks();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fetch unavailable')));
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const axios = createAxiosMock();
    axios.get.mockResolvedValueOnce({ data: new Uint8Array([1, 2]), headers: { 'content-type': 'application/pdf' } });
    const { wrapper } = await mountDataTable({ axios, props: { items: [row], downloadLink: { File: 'file' } } });
    await findActionButton(wrapper, 'File')!.trigger('click');
    await flushTable();
    expect(axios.get).toHaveBeenCalledWith('/files/a.pdf', expect.objectContaining({ responseType: 'blob' }));
    expect(browser.createObjectURL).toHaveBeenCalled();
    expect(browser.revokeObjectURL).toHaveBeenCalledWith('blob:table-test');
  });

  it('revokes the object URL and removes the anchor even when clicking throws', async () => {
    const browser = installBrowserMocks();
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => Promise.resolve(new Response(new Blob(['x']), { status: 200 }))));
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => { throw new Error('blocked'); });
    const axios = createAxiosMock();
    axios.get.mockRejectedValue(new Error('fallback failed'));
    const { wrapper } = await mountDataTable({ axios, props: { items: [row], downloadLink: { File: 'file' } } });
    await findActionButton(wrapper, 'File')!.trigger('click');
    await flushTable();
    expect(browser.revokeObjectURL).toHaveBeenCalledWith('blob:table-test');
    expect(document.querySelector('a[download]')).toBeNull();
  });

  it('reports missing Blob URL support without crashing', async () => {
    installBrowserMocks();
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: undefined });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(new Blob(['x']), { status: 200 })));
    const axios = createAxiosMock();
    axios.get.mockResolvedValue({ data: new Blob(['x']), headers: { 'content-type': 'application/pdf' } });
    const { wrapper } = await mountDataTable({ axios, props: { items: [row], downloadLink: { File: 'file' } } });
    await findActionButton(wrapper, 'File')!.trigger('click');
    await flushTable();
    expect(document.body.textContent).toContain('خطا');
  });

  it('supports repeated downloads without leaking anchors', async () => {
    const browser = installBrowserMocks();
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => Promise.resolve(new Response(new Blob(['x']), { status: 200 }))));
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const { wrapper } = await mountDataTable({ props: { items: [row], downloadLink: { File: 'file' } } });
    const button = findActionButton(wrapper, 'File')!;
    await button.trigger('click');
    await button.trigger('click');
    await flushTable();
    expect(browser.createObjectURL).toHaveBeenCalledTimes(2);
    expect(browser.revokeObjectURL).toHaveBeenCalledTimes(2);
    expect(document.querySelector('a[download]')).toBeNull();
  });
});
