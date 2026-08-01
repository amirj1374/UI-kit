import { describe, expect, it } from 'vitest';
import { createTableHeaders, flushTable, mountDataTable } from './harness';

describe('CustomDataTableV2 rendering', () => {
  it('mounts with the minimum public contract and renders headers', async () => {
    const { wrapper } = await mountDataTable();
    expect(wrapper.find('.data-table-container').exists()).toBe(true);
    expect(wrapper.text()).toContain('Name');
    expect(wrapper.text()).toContain('Status');
  });

  it('renders local rows and reacts when the items prop is replaced', async () => {
    const { wrapper } = await mountDataTable({
      props: { items: [{ code: 'a-1', name: 'Alpha', status: 'ACTIVE' }], uniqueKey: 'code' }
    });
    expect(wrapper.text()).toContain('Alpha');
    await wrapper.setProps({ items: [{ code: 'b-2', name: 'Beta', status: 'INACTIVE' }] });
    await flushTable();
    expect(wrapper.text()).toContain('Beta');
    expect(wrapper.text()).not.toContain('Alpha');
  });

  it('uses formatter, renderer, conditional style, and configured headers', async () => {
    const headers = createTableHeaders();
    headers[0].formatter = (value) => `formatted:${value}`;
    headers[1].customRenderer = (item) => `rendered:${item.status}`;
    headers[1].conditionalStyle = () => ({ color: 'rgb(255, 0, 0)' });
    const { wrapper } = await mountDataTable({ props: { headers, items: [{ id: 1, name: 'Alpha', status: 'ACTIVE' }] } });
    expect(wrapper.text()).toContain('formatted:Alpha');
    expect(wrapper.text()).toContain('rendered:ACTIVE');
    expect(wrapper.html()).toContain('color: rgb(255, 0, 0)');
  });

  it('shows the existing no-data message for empty local data', async () => {
    const { wrapper } = await mountDataTable();
    expect(wrapper.text()).toContain('رکوردی یافت نشد');
  });
});
