import { computed, watch, type Ref } from 'vue';
import { useTableSelection } from '@/composables/useTableSelection';
import type { TableItem } from '@/types/componentTypes/DataTableTypes';
import type { DataTableV2Props } from '../types';
import { getUniqueValueFromItem } from '../headerFieldUtils';

export function useDataTableSelectionBridge(
  props: DataTableV2Props,
  items: Ref<TableItem[]>,
  emit: (e: 'update:selectedItems' | 'selection-change', items: TableItem[]) => void
) {
  const selection = useTableSelection(items, {
    multiSelect: props.bulkMode ? false : props.multiSelect,
    uniqueKey: props.uniqueKey as string | ((item: TableItem) => string | number),
    groupBy: props.groupBy as string | ((item: TableItem) => string | number) | undefined,
    defaultExpanded: props.defaultExpanded
  });

  const originalToggleSelection = selection.toggleSelection;
  selection.toggleSelection = (item: TableItem) => {
    if (props.bulkMode) {
      selection.clearSelection();
      selection.selectedItems.value = [item];
    } else {
      originalToggleSelection(item);
    }
  };

  const getUniqueValue = (item: TableItem) => getUniqueValueFromItem(item, props.uniqueKey);

  const emitSelection = () => {
    emit('update:selectedItems', selection.selectedItems.value);
    emit('selection-change', selection.selectedItems.value);
  };

  // Sync external v-model:selectedItems → internal state
  watch(
    () => props.selectedItems,
    (external) => {
      if (!external?.length && !selection.selectedItems.value.length) return;
      selection.selectedItems.value = [...(external ?? [])];
    },
    { deep: true, immediate: true }
  );

  const toggleSelection = (item: TableItem) => {
    if (!props.selectable) return;
    selection.toggleSelection(item);
    emitSelection();
  };

  const toggleSelectAll = () => {
    if (!props.selectable || !props.multiSelect) return;
    selection.toggleSelectAll();
    emitSelection();
  };

  const clearSelection = () => {
    selection.clearSelection();
    emitSelection();
  };

  const selectSingleItem = (item: TableItem) => {
    if (!props.bulkMode || !props.selectable) return;
    selection.clearSelection();
    selection.selectedItems.value = [item];
    emitSelection();
  };

  const selectedItems = selection.selectedItems;
  const selectAll = computed({
    get: () => selection.allSelected.value,
    set: (val: boolean) => {
      if (val) selection.toggleSelectAll();
      else selection.clearSelection();
      emitSelection();
    }
  });

  const selectedCount = computed(() => selectedItems.value.length);
  const hasSelection = computed(() => selectedItems.value.length > 0);

  const validSelectedItems = computed(() => {
    if (!props.selectable || !props.bulkMode) return selectedItems.value;
    return selectedItems.value.filter((selectedItem) => {
      const id = getUniqueValue(selectedItem);
      return items.value.some((item) => getUniqueValue(item) === id);
    });
  });

  const hasValidSelection = computed(() => {
    if (!props.selectable || !props.bulkMode) return hasSelection.value;
    return validSelectedItems.value.length > 0;
  });

  const radioGroupValue = computed(() =>
    selectedItems.value.length > 0 ? getUniqueValue(selectedItems.value[0]) : null
  );

  watch(
    () => items.value,
    (newItems) => {
      if (!props.selectable || !props.bulkMode || selectedItems.value.length === 0) return;
      const valid = selectedItems.value.filter((s) => newItems.some((i) => getUniqueValue(i) === getUniqueValue(s)));
      if (valid.length !== selectedItems.value.length) {
        selectedItems.value = valid;
        emitSelection();
      }
    },
    { deep: true }
  );

  return {
    selection,
    selectedItems,
    selectAll,
    groupedItems: selection.groupedItems,
    expandedGroups: selection.expandedGroups,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    selectSingleItem,
    isSelected: selection.isSelected,
    toggleGroup: (groupKey: string | number) => selection.toggleGroup(groupKey),
    expandAllGroups: selection.expandAllGroups,
    collapseAllGroups: selection.collapseAllGroups,
    getUniqueValue,
    selectedCount,
    hasSelection,
    validSelectedItems,
    hasValidSelection,
    radioGroupValue,
    emitSelection
  };
}
