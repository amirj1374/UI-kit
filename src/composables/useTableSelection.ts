import { ref, computed, watch } from 'vue';
import type { Ref } from 'vue';

export interface SelectionOptions<T extends Record<string, any> = Record<string, any>> {
  multiSelect?: boolean;
  uniqueKey?: string | ((item: T) => string | number);
  defaultSelected?: string;
  groupBy?: string | ((item: T) => string | number);
  defaultExpanded?: boolean;
}

export interface GroupedItems<T extends Record<string, any> = Record<string, any>> {
  groupKey: string | number;
  groupLabel: string;
  items: T[];
  isExpanded: boolean;
  count: number;
}

export function useTableSelection<T extends Record<string, any> = Record<string, any>>(items: Ref<T[]>, options: SelectionOptions<T> = {}) {
  const selectedItems = ref([]) as Ref<T[]>;
  const expandedGroups = ref<Set<string | number>>(new Set());
  const groupedItems = ref([] as GroupedItems<T>[]) as Ref<GroupedItems<T>[]>;

  // Get unique value from item
  const getUniqueValue = (item: T): string | number => {
    if (typeof options.uniqueKey === 'function') {
      return options.uniqueKey(item);
    }

    if (typeof options.uniqueKey === 'string') {
      return getNestedValue(item, options.uniqueKey);
    }

    // @ts-ignore - Fallback to id
    return item.id;
  };

  // Get nested value from object path
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((o, p) => (o || {})[p], obj);
  };

  // Get group value from item
  const getGroupValue = (item: T): string | number => {
    if (!options.groupBy) return '';

    if (typeof options.groupBy === 'function') {
      return options.groupBy(item);
    }

    return getNestedValue(item, options.groupBy) || '';
  };

  // Toggle selection for a single item
  const toggleSelection = (item: T) => {
    const itemUniqueValue = getUniqueValue(item);
    const index = (selectedItems.value as unknown as T[]).findIndex((selected: T) =>
      getUniqueValue(selected) === itemUniqueValue
    );

    if (index > -1) {
      (selectedItems.value as unknown as T[]).splice(index, 1);
    } else if (options.multiSelect) {
      (selectedItems.value as unknown as T[]).push(item);
    } else {
      selectedItems.value = [item] as unknown as T[];
    }
  };

  // Toggle select all items
  const toggleSelectAll = () => {
    if ((selectedItems.value as unknown as T[]).length === items.value.length) {
      selectedItems.value = [] as unknown as T[];
    } else {
      selectedItems.value = [...(items.value as unknown as T[])];
    }
  };

  // Check if an item is selected
  const isSelected = (item: T): boolean => {
    const itemUniqueValue = getUniqueValue(item);
    return (selectedItems.value as unknown as T[]).some((selected: T) =>
      getUniqueValue(selected) === itemUniqueValue
    );
  };

  // Clear all selections
  const clearSelection = () => {
    selectedItems.value = [];
  };

  // Toggle group expansion
  const toggleGroup = (groupKey: string | number) => {
    // Prevent multiple rapid toggles and ensure state consistency
    const isCurrentlyExpanded = expandedGroups.value.has(groupKey);
    
    if (isCurrentlyExpanded) {
      expandedGroups.value.delete(groupKey);
    } else {
      expandedGroups.value.add(groupKey);
    }
    
    // Update the isExpanded property in groupedItems
    const groupIndex = groupedItems.value.findIndex(group => group.groupKey === groupKey);
    if (groupIndex !== -1) {
      groupedItems.value[groupIndex].isExpanded = !isCurrentlyExpanded;
    }
  };

  // Expand all groups
  const expandAllGroups = () => {
    groupedItems.value.forEach(group => {
      expandedGroups.value.add(group.groupKey);
      group.isExpanded = true;
    });
  };

  // Collapse all groups
  const collapseAllGroups = () => {
    expandedGroups.value.clear();
    groupedItems.value.forEach(group => {
      group.isExpanded = false;
    });
  };

  // Group items by the specified property
  const groupItems = (list: T[]) => {
    if (!options.groupBy) {
      groupedItems.value = [];
      return;
    }

    const groups = new Map<string | number, T[]>();

    // Group items by the specified property
    list.forEach((item) => {
      const groupKey = getGroupValue(item);
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    });

    // Convert to array format
    groupedItems.value = Array.from(groups.entries()).map(([groupKey, groupItems]) => ({
      groupKey,
      groupLabel: getGroupLabel(groupKey, groupItems),
      items: groupItems,
      isExpanded: expandedGroups.value.has(groupKey) || options.defaultExpanded,
      count: groupItems.length
    })) as unknown as GroupedItems<T>[];

    // Sort groups by key
    groupedItems.value.sort((a, b) => {
      if (typeof a.groupKey === 'string' && typeof b.groupKey === 'string') {
        return a.groupKey.localeCompare(b.groupKey);
      }
      return a.groupKey < b.groupKey ? -1 : a.groupKey > b.groupKey ? 1 : 0;
    });
  };

  // Get group label
  const getGroupLabel = (groupKey: string | number, groupItems: T[]): string => {
    return `${String(groupKey)} (${groupItems.length} رکورد)`;
  };

  // Watch for changes in items and group them if needed
  watch(() => items.value, (newItems) => {
    if (options.groupBy) {
      groupItems(newItems as T[]);
    }
  }, { immediate: true, deep: true });

  // Check if all items are selected
  const allSelected = computed(() => {
    return items.value.length > 0 && selectedItems.value.length === items.value.length;
  });

  // Check if some items are selected
  const someSelected = computed(() => {
    return selectedItems.value.length > 0 && !allSelected.value;
  });

  return {
    selectedItems,
    groupedItems,
    expandedGroups,
    allSelected,
    someSelected,
    toggleSelection,
    toggleSelectAll,
    isSelected,
    clearSelection,
    toggleGroup,
    expandAllGroups,
    collapseAllGroups,
    getGroupValue,
    getUniqueValue
  };
}
