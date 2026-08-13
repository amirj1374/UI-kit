import { beforeEach, describe, expect, it, vi } from 'vitest';
import { findActionButton, flushTable, mountDataTable } from './harness';

const xlsx = vi.hoisted(() => ({
  json_to_sheet: vi.fn(() => ({ '!ref': 'A1:B2', A1: {}, A2: {} })),
  decode_range: vi.fn(() => ({ s: { r: 0, c: 0 }, e: { r: 2, c: 1 } })),
  encode_range: vi.fn(() => 'A4:B5'),
  encode_cell: vi.fn(({ r, c }) => `${String.fromCharCode(65 + c)}${r + 1}`),
  sheet_add_aoa: vi.fn(),
  book_new: vi.fn(() => ({})),
  book_append_sheet: vi.fn(),
  writeFile: vi.fn()
}));

vi.mock('xlsx', () => ({ default: { utils: xlsx, writeFile: xlsx.writeFile }, utils: xlsx, writeFile: xlsx.writeFile }));

describe('CustomDataTableV2 client export', () => {
  beforeEach(() => vi.clearAllMocks());

  it('exports local rows with public headers and configured filename', async () => {
    const { wrapper } = await mountDataTable({
      props: {
        enableExport: true,
        exportFileName: 'people',
        items: [{ id: 1, name: 'Alpha', active: true }],
        headers: [{ title: 'Name', key: 'name' }, { title: 'Active', key: 'active' }]
      }
    });
    await findActionButton(wrapper, 'گزارش کلی')!.trigger('click');
    await flushTable();
    await vi.waitFor(() => expect(xlsx.json_to_sheet).toHaveBeenCalled());
    const rows = xlsx.json_to_sheet.mock.calls[0][0];
    expect(rows[0]).toEqual({ Name: 'Alpha', Active: 'بله' });
    expect(xlsx.writeFile).toHaveBeenCalledWith(expect.any(Object), expect.stringMatching(/^people_.+\.xlsx$/));
  });
});
