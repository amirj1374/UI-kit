import { describe, it, expect } from 'vitest';
import { ref, nextTick } from 'vue';
import { useTableSelection } from './useTableSelection';

interface Row {
  id: number;
  name: string;
  group?: string;
}

const rows: Row[] = [
  { id: 1, name: 'a', group: 'g1' },
  { id: 2, name: 'b', group: 'g1' },
  { id: 3, name: 'c', group: 'g2' }
];

describe('useTableSelection - selection', () => {
  it('selects a single item by default (non-multi)', () => {
    const items = ref<Row[]>([...rows]);
    const s = useTableSelection(items);

    s.toggleSelection(rows[0]);
    expect(s.isSelected(rows[0])).toBe(true);

    s.toggleSelection(rows[1]);
    expect(s.isSelected(rows[0])).toBe(false);
    expect(s.isSelected(rows[1])).toBe(true);
    expect(s.selectedItems.value).toHaveLength(1);
  });

  it('accumulates selections in multiSelect mode', () => {
    const items = ref<Row[]>([...rows]);
    const s = useTableSelection(items, { multiSelect: true });

    s.toggleSelection(rows[0]);
    s.toggleSelection(rows[1]);
    expect(s.selectedItems.value).toHaveLength(2);

    // toggling again removes it
    s.toggleSelection(rows[0]);
    expect(s.isSelected(rows[0])).toBe(false);
    expect(s.selectedItems.value).toHaveLength(1);
  });

  it('toggleSelectAll selects then clears', () => {
    const items = ref<Row[]>([...rows]);
    const s = useTableSelection(items, { multiSelect: true });

    s.toggleSelectAll();
    expect(s.selectedItems.value).toHaveLength(3);
    expect(s.allSelected.value).toBe(true);

    s.toggleSelectAll();
    expect(s.selectedItems.value).toHaveLength(0);
  });

  it('someSelected reflects partial selection', () => {
    const items = ref<Row[]>([...rows]);
    const s = useTableSelection(items, { multiSelect: true });
    s.toggleSelection(rows[0]);
    expect(s.someSelected.value).toBe(true);
    expect(s.allSelected.value).toBe(false);
  });

  it('clearSelection empties the selection', () => {
    const items = ref<Row[]>([...rows]);
    const s = useTableSelection(items, { multiSelect: true });
    s.toggleSelectAll();
    s.clearSelection();
    expect(s.selectedItems.value).toHaveLength(0);
  });

  it('respects a custom uniqueKey', () => {
    const items = ref<Row[]>([...rows]);
    const s = useTableSelection(items, { uniqueKey: 'name' });
    s.toggleSelection({ id: 99, name: 'a' });
    // matches by name even though id differs
    expect(s.isSelected(rows[0])).toBe(true);
  });
});

describe('useTableSelection - grouping', () => {
  it('groups items by a string key on init', async () => {
    const items = ref<Row[]>([...rows]);
    const s = useTableSelection(items, { groupBy: 'group' });
    await nextTick();

    expect(s.groupedItems.value).toHaveLength(2);
    const g1 = s.groupedItems.value.find((g) => g.groupKey === 'g1');
    expect(g1?.count).toBe(2);
  });

  it('toggles group expansion', async () => {
    const items = ref<Row[]>([...rows]);
    const s = useTableSelection(items, { groupBy: 'group' });
    await nextTick();

    s.toggleGroup('g1');
    expect(s.expandedGroups.value.has('g1')).toBe(true);
    s.toggleGroup('g1');
    expect(s.expandedGroups.value.has('g1')).toBe(false);
  });

  it('expandAllGroups / collapseAllGroups', async () => {
    const items = ref<Row[]>([...rows]);
    const s = useTableSelection(items, { groupBy: 'group' });
    await nextTick();

    s.expandAllGroups();
    expect(s.groupedItems.value.every((g) => g.isExpanded)).toBe(true);

    s.collapseAllGroups();
    expect(s.groupedItems.value.every((g) => !g.isExpanded)).toBe(true);
  });
});
