import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAxiosMock, createPaginatedResponse, flushTable, mountDataTable } from './harness';
import type { FilterOperator, Header } from '@/types/componentTypes/DataTableTypes';

afterEach(() => vi.useRealTimers());

async function applyInlineFilter(headers: Header[], values: Record<string, unknown>) {
  vi.useFakeTimers();
  const axios = createAxiosMock();
  let slotProps: any;
  const mounted = await mountDataTable({
    axios,
    props: { inlineFilter: true, headers },
    slots: { 'inline-filter-actions': (props: any) => { slotProps = props; return 'filters'; } }
  });
  Object.assign(slotProps.filterModel, values);
  slotProps.applyFilter();
  await vi.advanceTimersByTimeAsync(300);
  return { ...mounted, axios };
}

describe('CustomDataTableV2 filter operator matrix', () => {
  it.each<FilterOperator>([
    'equals', 'notEquals', 'contains', 'doesNotContain', 'greaterThan', 'lessThan',
    'greaterThanOrEqual', 'lessThanOrEqual'
  ])('wires the %s operator to its existing Spring-style request key', async (operator) => {
    const { axios } = await applyInlineFilter(
      [{ title: 'Value', key: 'value', filterOperators: [operator], defaultFilterOperator: operator }],
      { value: operator.includes('Than') ? 10 : 'Alpha' }
    );
    expect(axios.get).toHaveBeenCalledWith('/api/items', {
      params: { [`value.${operator}`]: operator.includes('Than') ? 10 : 'Alpha', page: 0, size: 10 }
    });
  });

  it('preserves zero and false while excluding null, undefined, and empty string', async () => {
    const { axios } = await applyInlineFilter(
      [
        { title: 'Count', key: 'count', type: 'number' },
        { title: 'Enabled', key: 'enabled', type: 'toggle' },
        { title: 'Null', key: 'nil' },
        { title: 'Empty', key: 'empty' }
      ],
      { count: 0, enabled: false, nil: null, empty: '' }
    );
    expect(axios.get).toHaveBeenCalledWith('/api/items', { params: { count: 0, enabled: false, page: 0, size: 10 } });
  });

  it('maps IN arrays, specified false, and simultaneous filters', async () => {
    const { axios } = await applyInlineFilter(
      [
        { title: 'Statuses', key: 'status', filterOperators: ['in'], defaultFilterOperator: 'in' },
        { title: 'Present', key: 'present', filterOperators: ['specified'], defaultFilterOperator: 'specified' },
        { title: 'Name', key: 'name' }
      ],
      { status: ['ACTIVE', 'PENDING'], present: false, name: 'Ali' }
    );
    expect(axios.get).toHaveBeenCalledWith('/api/items', {
      params: { 'status.in': 'ACTIVE,PENDING', 'present.specified': false, name: 'Ali', page: 0, size: 10 }
    });
  });

  it('converts remote Gregorian date values to Jalali display values', async () => {
    const axios = createAxiosMock(createPaginatedResponse([{ id: 1, createdAt: '2024-03-20' }]));
    const { wrapper } = await mountDataTable({
      axios,
      props: { autoFetch: true, headers: [{ title: 'Date', key: 'createdAt', type: 'date', dateMode: 'range' }] }
    });
    await flushTable();
    expect((wrapper.vm as any).getItems()[0].createdAt).toBe('1403/01/01');
  });

  it('keeps remote sorting explicitly absent from requests', async () => {
    const axios = createAxiosMock(createPaginatedResponse([{ id: 1, name: 'Alpha' }]));
    const { wrapper } = await mountDataTable({
      axios,
      props: { autoFetch: true, headers: [{ title: 'Name', key: 'name', sortable: true }] }
    });
    await flushTable();
    expect(axios.get).toHaveBeenLastCalledWith('/api/items', { params: { page: 0, size: 10 } });
    expect(wrapper.findComponent({ name: 'VDataTable' }).exists()).toBe(true);
  });

  it('renders the supported inline field variants through DataTableFilterFields', async () => {
    const options = [{ title: 'One', value: 1 }];
    const { wrapper } = await mountDataTable({
      props: {
        inlineFilter: true,
        headers: [
          { title: 'Text', key: 'text', type: 'text' },
          { title: 'Number', key: 'count', type: 'number' },
          { title: 'Date range', key: 'dates', type: 'date', dateMode: 'range' },
          { title: 'Money', key: 'amount', type: 'money' },
          { title: 'Toggle', key: 'enabled', type: 'toggle' },
          { title: 'Choice', key: 'choice', type: 'autocomplete', autocompleteItems: options },
          { title: 'Hidden', key: 'hidden', hidden: true }
        ]
      }
    });
    expect(wrapper.findAllComponents({ name: 'VTextField' }).length).toBeGreaterThanOrEqual(2);
    expect(wrapper.findComponent({ name: 'ShamsiDatePicker' }).props('mode')).toBe('range');
    expect(wrapper.findComponent({ name: 'MoneyInput' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'ToggleSwitch' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'VAutocomplete' }).props('items')).toEqual(options);
  });
});
