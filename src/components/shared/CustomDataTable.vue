<script setup lang="ts">
/**
 * CustomDataTable.vue
 *
 * A feature-rich data table component with server-side pagination, filtering,
 * grouping, selection, CRUD actions, custom actions, downloads, and dialogs.
 *
 * Key features:
 * - Server-side pagination and infinite scroll
 * - Optional grouping with expand/collapse
 * - Row selection (single/multi) with external v-model
 * - Dynamic actions column with CRUD/routes/downloads/custom buttons
 * - Date conversion between Shamsi and Gregorian with optional timezone
 *
 * Accessibility:
 * - Adds ARIA attributes to group headers and busy regions
 * - Keyboard support for toggling groups and activating selection on rows
 */
import MoneyInput from '@/components/shared/MoneyInput.vue';
import ShamsiDatePicker from '@/components/shared/ShamsiDatePicker.vue';
import { useTableSelection } from '@/composables/useTableSelection';
import apiService from '@/services/apiService';
import getAxiosInstance from '@/services/axiosInstance';
import { DateConverter } from '@/utils/date-convertor';
import { formatNumberWithCommas } from '@/utils/number-formatter';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-vue';
import { useDebounceFn } from '@vueuse/core';
import type { Component, Ref } from 'vue';
import { computed, isRef, onBeforeUnmount, onMounted, ref, shallowRef, unref, watch } from 'vue';
import { useRouter } from 'vue-router';

import type {
  ApiResponse,
  CustomAction,
  DataTableProps,
  Header,
  TableItem
} from '@/types/componentTypes/DataTableTypes';

type AutocompleteItemsSource =
  | any[]
  | Ref<any[] | undefined>
  | ((context?: Record<string, any>) => any[] | undefined);

type EnhancedHeader = Header & {
  autocompleteItems?: AutocompleteItemsSource;
  autocompleteItemTitle?: string;
  autocompleteItemValue?: string;
  autocompleteReturnObject?: boolean;
  autocompleteMultiple?: boolean;
};

/**
 * Component props - using proper types from DataTableTypes
 */
interface Props extends Omit<DataTableProps, 'routes'> {
  routes?: Record<string, string> | ((item: TableItem) => Record<string, string>);
  enableGroupDelete?: boolean; // Enable group delete functionality for bulk mode
}

const props = withDefaults(defineProps<Props>(), {
  autoFetch: true,
  showPagination: true,
  showRefreshButton: false,
  selectable: false,
  multiSelect: false,
  selectedItems: () => [],
  uniqueKey: 'id',
  pageSize: 10,
  defaultExpanded: false,
  dateWithTimezone: false,
  bulkMode: false,
  enableTextTruncation: false, // Disabled by default to avoid layout issues
  maxTextLength: 50 // Maximum characters to show before truncating
});

const emit = defineEmits<{
  (e: 'update:selectedItems', items: TableItem[]): void;
  (e: 'selection-change', items: TableItem[]): void;
}>();

defineOptions({ inheritAttrs: false });

const items = ref<TableItem[]>([]);
const originalServerData = ref<TableItem[]>([]); // Store original server data
const loading = ref(false);
const error = ref<string | null>(null);
const dialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const editedItem = ref<TableItem | null>(null);
const formModel = ref<Record<string, any>>({});
const itemToDelete = ref<TableItem | null>(null);
const snackbar = ref(false);
const snackbarMessage = ref('');
const router = useRouter();
const itemsPerPage = ref(props.pageSize);
const totalSize = ref(0);
const totalPages = ref(0);
const currentPage = ref(1);
const sortBy = ref<{ key: string; order: 'asc' | 'desc' } | null>(null);
const filterDialog = ref(false);
const filterModel = ref<Record<string, any>>({});
const tableRef = ref<HTMLElement | null>(null);
const isLoadingMore = ref(false);
const hasMore = ref(true);

// Selection & grouping using composable (minimal-risk wiring)
const selection = useTableSelection(items, {
  multiSelect: props.bulkMode ? false : props.multiSelect, // Force single select in bulk mode
  uniqueKey: props.uniqueKey as any,
  groupBy: props.groupBy as any,
  defaultExpanded: props.defaultExpanded
});

// Override toggleSelection in bulk mode to ensure single selection
const originalToggleSelection = selection.toggleSelection;
selection.toggleSelection = (item: any) => {
  if (props.bulkMode) {
    // In bulk mode, always clear and select only this item
    selection.clearSelection();
    selection.selectedItems.value = [item];
  } else {
    // Normal behavior for non-bulk mode
    originalToggleSelection(item);
  }
};
const selectedItems = selection.selectedItems;
const selectAll = computed({
  get: () => selection.allSelected.value,
  set: (val: boolean) => {
    if (val) {
      selection.toggleSelectAll();
    } else {
      selection.clearSelection();
    }
  }
});
const groupedItems = selection.groupedItems as unknown as Ref<
  Array<{ groupKey: string | number; groupLabel: string; items: any[]; isExpanded: boolean; count: number }>
>;
const expandedGroups = selection.expandedGroups;

// Computed flag to determine if any actions should be shown
const hasAnyActions = computed(() => {
  // If bulkMode is true, don't show actions column in table
  if (props.bulkMode) {
    return false;
  }

  const hasCrudActions = Array.isArray(props.actions) && props.actions.length > 0;
  const hasRoutes = !!props.routes && (typeof props.routes === 'function' || Object.keys(props.routes).length > 0);
  const hasDownloadLinks = !!props.downloadLink && Object.keys(props.downloadLink).length > 0;
  const hasCustomActions = Array.isArray(props.customActions) && props.customActions.length > 0;
  const hasCustomButtons = (Array.isArray(props.customButtons) && props.customButtons.length > 0) || !!props.customButtonsFn;
  return hasCrudActions || hasRoutes || hasDownloadLinks || hasCustomActions || hasCustomButtons;
});

// Function to get routes for a specific item
const getRoutesForItem = (item: any): Record<string, string> => {
  if (!props.routes) return {};
  if (typeof props.routes === 'function') {
    return props.routes(item);
  }
  return props.routes;
};

// Estimate auto width based on header title and type when width is not provided
const estimateColumnWidth = (header: Header): number => {
  const title = header.title || '';
  const basePadding = 32; // left/right padding
  const avgCharWidth = 10; // heuristic average per character
  const typeExtra = header.type && String(header.type).toLowerCase() === 'money' ? 40 : 0;
  const computed = basePadding + title.length * avgCharWidth + typeExtra;
  const min = 100;
  const max = 300;
  return Math.min(Math.max(computed, min), max);
};

// Headers with auto width applied when not specified
const autoHeaders = computed(() => {
  return props.headers.map((h) => ({
    ...h,
    width: h.width ?? estimateColumnWidth(h)
  }));
});

const selectionHeader = { title: '', key: 'selection', sortable: false, width: 50 } as const;

const groupedHeaders = computed(() => {
  const base = [...(props.selectable ? [selectionHeader] : []), ...autoHeaders.value];

  if (!hasAnyActions.value) {
    return base;
  }

  // Calculate dynamic width based on actual button sizes (same logic as normalHeaders)
  let totalWidth = 0;

  // CRUD actions (edit, delete, view, create)
  if (props.actions) {
    props.actions.forEach((action) => {
      switch (action) {
        case 'edit':
          totalWidth += 140; // "ویرایش ✏️" button width
          break;
        case 'delete':
          totalWidth += 120; // "حذف ❌" button width
          break;
        case 'view':
          totalWidth += 140; // "🔍 نمایش" button width
          break;
        case 'create':
          totalWidth += 120; // Create button width
          break;
      }
    });
  }

  // Route actions
  if (props.routes) {
    Object.keys(props.routes).forEach((routeKey) => {
      totalWidth += 120; // Route button width (key.toUpperCase())
    });
  }

  // Download actions
  if (props.downloadLink) {
    Object.keys(props.downloadLink).forEach((key) => {
      totalWidth += 120; // Download button width
    });
  }

  // Custom actions
  if (props.customActions) {
    props.customActions.forEach((action) => {
      totalWidth += 140; // Custom action button width
    });
  }

  // Custom buttons
  if (props.customButtonsFn) {
    // For dynamic buttons, estimate based on typical button count
    totalWidth += 240; // 2 buttons * 120px each
  } else if (props.customButtons) {
    props.customButtons.forEach((button) => {
      totalWidth += 120; // Custom button width
    });
  }

  // Add spacing between buttons (8px margin per button)
  const buttonCount =
    (props.actions?.length || 0) +
    (props.routes ? Object.keys(props.routes).length : 0) +
    (props.downloadLink ? Object.keys(props.downloadLink).length : 0) +
    (props.customActions?.length || 0) +
    (props.customButtons?.length || (props.customButtonsFn ? 2 : 0));

  const spacingWidth = Math.max(buttonCount - 1, 0) * 8; // 8px margin between buttons
  totalWidth += spacingWidth;

  // Add padding for the cell
  totalWidth += 32; // 16px padding on each side

  // Ensure minimum width
  const actionWidth = Math.max(totalWidth, 200);

  return [...base, { title: 'عملیات', key: 'actions', sortable: false, width: actionWidth }];
});

const normalHeaders = computed(() => {
  const base = [...(props.selectable ? [selectionHeader] : []), ...autoHeaders.value];

  if (!hasAnyActions.value) {
    return base;
  }

  // Calculate dynamic width based on actual button sizes
  let totalWidth = 0;

  // CRUD actions (edit, delete, view, create)
  if (props.actions) {
    props.actions.forEach((action) => {
      switch (action) {
        case 'edit':
          totalWidth += 140; // "ویرایش ✏️" button width
          break;
        case 'delete':
          totalWidth += 120; // "حذف ❌" button width
          break;
        case 'view':
          totalWidth += 140; // "🔍 نمایش" button width
          break;
        case 'create':
          totalWidth += 120; // Create button width
          break;
      }
    });
  }

  // Route actions
  if (props.routes) {
    Object.keys(props.routes).forEach((routeKey) => {
      totalWidth += 120; // Route button width (key.toUpperCase())
    });
  }

  // Download actions
  if (props.downloadLink) {
    Object.keys(props.downloadLink).forEach((key) => {
      totalWidth += 120; // Download button width
    });
  }

  // Custom actions
  if (props.customActions) {
    props.customActions.forEach((action) => {
      totalWidth += 140; // Custom action button width
    });
  }

  // Custom buttons
  if (props.customButtonsFn) {
    // For dynamic buttons, estimate based on typical button count
    totalWidth += 240; // 2 buttons * 120px each
  } else if (props.customButtons) {
    props.customButtons.forEach((button) => {
      totalWidth += 120; // Custom button width
    });
  }

  // Add spacing between buttons (8px margin per button)
  const buttonCount =
    (props.actions?.length || 0) +
    (props.routes ? Object.keys(props.routes).length : 0) +
    (props.downloadLink ? Object.keys(props.downloadLink).length : 0) +
    (props.customActions?.length || 0) +
    (props.customButtons?.length || (props.customButtonsFn ? 2 : 0));

  const spacingWidth = Math.max(buttonCount - 1, 0) * 8; // 8px margin between buttons
  totalWidth += spacingWidth;

  // Add padding for the cell
  totalWidth += 32; // 16px padding on each side

  // Ensure minimum width
  const actionWidth = Math.max(totalWidth, 200);

  return [...base, { title: 'عملیات', key: 'actions', sortable: false, width: actionWidth }];
});

const hasAutocomplete = (header: Header): header is EnhancedHeader => {
  return Boolean((header as EnhancedHeader).autocompleteItems);
};

const resolveAutocompleteItems = (header: Header, context?: Record<string, any>): any[] => {
  const enhancedHeader = header as EnhancedHeader;
  const source = enhancedHeader.autocompleteItems;

  if (!source) return [];

  try {
    if (typeof source === 'function') {
      const baseContext = context ?? formModel.value;
      return source(baseContext) ?? [];
    }

    if (isRef(source)) {
      return source.value ?? [];
    }

    const resolved = unref(source);
    return Array.isArray(resolved) ? resolved : [];
  } catch (error) {
    console.error('Error resolving autocomplete items for header:', header.key, error);
    return [];
  }
};

const resolveHeaderDefaultValue = (header: Header, context: Record<string, any>): any => {
  const rawDefault = header.defaultValue;

  if (rawDefault === undefined) {
    return undefined;
  }

  try {
    if (typeof rawDefault === 'function') {
      return rawDefault(context);
    }

    if (isRef(rawDefault)) {
      return unref(rawDefault);
    }

    return rawDefault;
  } catch (error) {
    console.error('Error resolving default value for header:', header.key, error);
    return undefined;
  }
};

const resolveAutocompleteItemTitle = (header: Header): string => {
  return (header as EnhancedHeader).autocompleteItemTitle ?? 'title';
};

const resolveAutocompleteItemValue = (header: Header): string => {
  return (header as EnhancedHeader).autocompleteItemValue ?? 'value';
};

const resolveAutocompleteReturnObject = (header: Header): boolean => {
  const value = (header as EnhancedHeader).autocompleteReturnObject;
  return value !== false;
};

const resolveAutocompleteMultiple = (header: Header): boolean => {
  return (header as EnhancedHeader).autocompleteMultiple === true;
};

const formHeaders = computed((): Header[] => props.headers as Header[]);

const isMoneyHeader = (header: Header): boolean => {
  if (!header || typeof header.type !== 'string') {
    return false;
  }
  return header.type.toLowerCase() === 'money';
};

const getFieldInputType = (header: Header): string | undefined => {
  return typeof header?.type === 'string' ? header.type : undefined;
};

const resolveHeaderKey = (header: Header): string => header.key;
const resolveHeaderTitle = (header: Header): string => header.title;
const isHeaderDisabled = (header: Header): boolean => header.editable === false;
const isTextareaHeader = (header: Header): boolean => header.textarea === true;

// Helper function to get unique value from item
const getUniqueValue = (item: any): string | number => {
  if (typeof props.uniqueKey === 'function') {
    return props.uniqueKey(item);
  }

  if (typeof props.uniqueKey === 'string') {
    // Handle nested properties like "user.id"
    return props.uniqueKey.split('.').reduce((obj, key) => obj?.[key], item);
  }

  // Fallback to id
  return item.id;
};

// Helper function to get group value from item
const getGroupValue = (item: any): string | number => {
  if (!props.groupBy) return '';

  if (typeof props.groupBy === 'function') {
    return props.groupBy(item);
  }

  if (typeof props.groupBy === 'string') {
    // Handle nested properties like "user.department"
    return props.groupBy.split('.').reduce((obj, key) => obj?.[key], item);
  }

  return item[props.groupBy] || '';
};

// Note: Grouping logic is handled by useTableSelection composable

// Selection methods
const toggleSelection = (item: any) => {
  if (!props.selectable) return;
  selection.toggleSelection(item);
  emit('update:selectedItems', selectedItems.value);
  emit('selection-change', selectedItems.value);
};

const toggleSelectAll = () => {
  if (!props.selectable || !props.multiSelect) return;
  selection.toggleSelectAll();
  emit('update:selectedItems', selectedItems.value);
  emit('selection-change', selectedItems.value);
};

// Group toggle function with additional safety
const toggleGroup = (groupKey: string | number) => {
  // Small delay to ensure any focus/initialization issues are resolved
  setTimeout(() => {
    selection.toggleGroup(groupKey);
  }, 0);
};

// Expand all groups
const expandAllGroups = () => selection.expandAllGroups();

// Collapse all groups
const collapseAllGroups = () => selection.collapseAllGroups();

const isSelected = (item: any) => selection.isSelected(item);

// Computed properties for selection
const selectedCount = computed(() => selectedItems.value.length);
const hasSelection = computed(() => selectedItems.value.length > 0);

// Check if selected items are still present in current filtered data
const validSelectedItems = computed(() => {
  if (!props.selectable || !props.bulkMode) return selectedItems.value;

  // Filter selected items to only include those that exist in current items
  return selectedItems.value.filter((selectedItem) => {
    const uniqueValue = getUniqueValue(selectedItem);
    return items.value.some((item) => getUniqueValue(item) === uniqueValue);
  });
});

// Check if we have valid selections for bulk mode
const hasValidSelection = computed(() => {
  if (!props.selectable || !props.bulkMode) return hasSelection.value;
  return validSelectedItems.value.length > 0;
});

// Clear selection method
const clearSelection = () => {
  selection.clearSelection();
  emit('update:selectedItems', selectedItems.value);
  emit('selection-change', selectedItems.value);
};

// Method for single item selection in bulk mode
const selectSingleItem = (item: any) => {
  // Clear all selections first
  selection.clearSelection();
  // Force select only this item (don't use toggle)
  selection.selectedItems.value = [item];
  // Emit the change
  emit('update:selectedItems', selectedItems.value);
  emit('selection-change', selectedItems.value);
};

// Computed for radio group value
const radioGroupValue = computed(() => {
  return selectedItems.value.length > 0 ? getUniqueValue(selectedItems.value[0]) : null;
});

// Memoize computed properties
const cleanFilterModel = computed(() => {
  const model = { ...filterModel.value };
  Object.keys(model).forEach((key) => {
    if (model[key] === null || model[key] === undefined || model[key] === '') {
      delete model[key];
    }
  });
  return model;
});

const hasFilterComponent = computed(() => {
  return !!props.filterComponent;
});

/**
 * Fetches data from server using current filters, query params, and pagination.
 * Converts date fields to Shamsi for display and computes grouping/selection state.
 * @param queryParams Optional extra query params to merge with filter and pagination
 */
const fetchData = async (queryParams?: Record<string, unknown>) => {
  loading.value = true;
  error.value = null;

  let params: Record<string, unknown> = {
    ...cleanFilterModel.value,
    ...props.queryParams
  };

  if (queryParams) {
    params = { ...params, ...queryParams };
  }

  try {
    const shouldPaginate = props.showPagination !== false;
    const requestParams = shouldPaginate
      ? {
          ...params,
          page: currentPage.value - 1,
          size: itemsPerPage.value
        }
      : params;

    const response = await api.fetch(requestParams) as ApiResponse<TableItem>;
    const serverRawData = shouldPaginate ? response.data?.content ?? [] : response.data ?? [];
    const serverData = Array.isArray(serverRawData) ? serverRawData : [];

    originalServerData.value = serverData;

    items.value = serverData.map((item: Record<string, any>) => {
      const newItem = { ...item };
      props.headers.forEach((header) => {
        if (header.isDate && newItem[header.key]) {
          try {
            newItem[header.key] = DateConverter.toShamsi(newItem[header.key]);
          } catch (error) {
            console.error(`Error converting date for field ${header.key}:`, error);
          }
        }
      });
      return newItem;
    });

    if (shouldPaginate && response.data?.page) {
      totalSize.value = response.data.page.totalElements;
      totalPages.value = response.data.page.totalPages;
      hasMore.value = currentPage.value < response.data.page.totalPages;
    } else {
      totalSize.value = serverData.length;
      totalPages.value = 1;
      hasMore.value = false;
    }

    if (props.defaultSelected && items.value.length > 0 && props.defaultSelected in items.value[0]) {
      const defaultSelectedItems = items.value.filter((item) => item[props.defaultSelected!] === true);
      selectedItems.value = [...defaultSelectedItems];
      emit('update:selectedItems', selectedItems.value);
      emit('selection-change', selectedItems.value);
    }
  } catch (err: any) {
    if (err.response) {
      error.value = `خطای سرور: ${err.response.status} - ${err.response.data.message || 'خطای ناشناخته'}`;
    } else if (err.request) {
      error.value = 'خطای شبکه. لطفا دوباره تلاش کنید.';
    } else {
      error.value = 'یک خطای غیرمنتظره رخ داد.';
    }
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Add debounced version after fetchData definition
const debouncedFetchData = useDebounceFn(fetchData, 300);

// Update watcher to use debounced function
watch(
  [cleanFilterModel],
  () => {
    debouncedFetchData();
  },
  { deep: true }
);

// Watch for pageSize prop changes
watch(
  () => props.pageSize,
  (newPageSize) => {
    itemsPerPage.value = newPageSize;
    // Reset to first page when page size changes
    currentPage.value = 1;
    // Refetch data with new page size
    debouncedFetchData();
  }
);

// Watch for items changes and clear invalid selections
watch(
  () => items.value,
  (newItems) => {
    if (props.selectable && props.bulkMode && selectedItems.value.length > 0) {
      // Check if any selected items are no longer in the current data
      const invalidSelections = selectedItems.value.filter((selectedItem) => {
        const uniqueValue = getUniqueValue(selectedItem);
        return !newItems.some((item) => getUniqueValue(item) === uniqueValue);
      });

      // If there are invalid selections, remove them
      if (invalidSelections.length > 0) {
        const validSelections = selectedItems.value.filter((selectedItem) => {
          const uniqueValue = getUniqueValue(selectedItem);
          return newItems.some((item) => getUniqueValue(item) === uniqueValue);
        });

        selectedItems.value = validSelections;
        emit('update:selectedItems', selectedItems.value);
        emit('selection-change', selectedItems.value);
      }
    }
  },
  { deep: true }
);

// Cleanup on component unmount
onBeforeUnmount(() => {
  // Remove cancel call as it's not supported
});

// Use custom axios instance if provided, otherwise use configured/default instance
// Make it accessible to all functions in this component
const componentAxiosInstance = props.axiosInstance || getAxiosInstance();
const api = apiService(componentAxiosInstance, props.apiResource);
const customActionDialog = ref(false);
const customActionComponent = shallowRef<Component | null>(null);
const customActionItem = ref<any>(null);

// Text preview dialog state
const textPreviewDialog = ref(false);
const previewText = ref('');
const previewTitle = ref('');
const previewItem = ref<any>(null);

// Add scroll event handler
const handleScroll = async (event: Event) => {
  const target = event.target as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = target;

  // Check if we're near the bottom (within 100px)
  if (scrollHeight - scrollTop - clientHeight < 100 && !isLoadingMore.value && hasMore.value) {
    await loadMore();
  }
};

/**
 * Loads next page and appends to current items. Preserves selection defaults.
 */
const loadMore = async () => {
  if (isLoadingMore.value || !hasMore.value) return;

  isLoadingMore.value = true;
  currentPage.value++;

  try {
    const params = {
      ...cleanFilterModel.value,
      ...props.queryParams,
      page: currentPage.value - 1,
      size: itemsPerPage.value
    };

    const response = await api.fetch(params);
    const newItems = response.data.content || [];

    // Convert dates to Shamsi format
    const formattedItems = newItems.map((item: Record<string, any>) => {
      const newItem = { ...item };
      props.headers.forEach((header) => {
        if (header.isDate && newItem[header.key]) {
          try {
            newItem[header.key] = DateConverter.toShamsi(newItem[header.key]);
          } catch (error) {
            console.error(`Error converting date for field ${header.key}:`, error);
          }
        }
      });
      return newItem;
    });

    items.value = [...items.value, ...formattedItems];
    hasMore.value = currentPage.value < response.data.totalPages;

    // Auto-select new items if defaultSelected prop is provided
    if (props.defaultSelected && props.selectable) {
      const newSelectedItems = formattedItems.filter((item: any) => item[props.defaultSelected!] === true);
      if (newSelectedItems.length > 0) {
        selectedItems.value = [...selectedItems.value, ...newSelectedItems];
        emit('update:selectedItems', selectedItems.value);
        emit('selection-change', selectedItems.value);
      }
    }
  } catch (err) {
    console.error('Error loading more items:', err);
    currentPage.value--; // Revert page number on error
  } finally {
    isLoadingMore.value = false;
  }
};

// Expose methods to parent component
defineExpose({
  fetchData,
  items,
  selectedItems,
  getSelectedItems: () => selectedItems.value,
  clearSelection: () => {
    selectedItems.value = [];
    selectAll.value = false;
  },
  // Grouping methods (handled by useTableSelection composable)
  groupedItems,
  toggleGroup,
  expandAllGroups,
  collapseAllGroups,
  formModel
});

/**
 * Opens the create/edit dialog and normalizes date fields for editing.
 */
const openDialog = (item?: any) => {
  editedItem.value = item ? { ...item } : {};
  isEditing.value = !!item;
  dialog.value = true;

  if (!isEditing.value) {
    const defaultContext: Record<string, any> = { ...editedItem.value };

    for (const header of props.headers) {
      if (header.defaultValue === undefined) {
        continue;
      }

      const resolvedDefault = resolveHeaderDefaultValue(header, defaultContext);
      if (resolvedDefault !== undefined) {
        editedItem.value![header.key] = resolvedDefault;
        defaultContext[header.key] = resolvedDefault;
      }
    }
  }

  // Sync form model with editedItem
  formModel.value = { ...editedItem.value };

  // Normalize autocomplete fields based on header configuration
  props.headers.forEach((header) => {
    if (!hasAutocomplete(header)) return;

    const enhancedHeader = header as EnhancedHeader;
    const currentValue = formModel.value[header.key];
    const valueKey = resolveAutocompleteItemValue(header);

    if (enhancedHeader.autocompleteReturnObject === false) {
      if (Array.isArray(currentValue)) {
        formModel.value[header.key] = currentValue.map((item: any) =>
          item && typeof item === 'object' ? item[valueKey] ?? null : item
        );
      } else if (currentValue && typeof currentValue === 'object') {
        formModel.value[header.key] = currentValue[valueKey] ?? null;
      }
    }
  });

  // Ensure date fields in edit mode are in Gregorian YYYY-MM-DD for the date picker
  if (isEditing.value) {
    try {
      props.headers.forEach((header) => {
        if (header.isDate) {
          const v = formModel.value[header.key];
          if (typeof v === 'string' && v.includes('/')) {
            // Convert Shamsi jYYYY/jMM/jDD -> YYYY-MM-DD for picker
            formModel.value[header.key] = DateConverter.toGregorian(v);
          } else if (typeof v === 'string' && v.includes('T')) {
            // Normalize ISO to YYYY-MM-DD for picker
            formModel.value[header.key] = v.split('T')[0];
          }
        }
      });
    } catch (e) {
      console.error('Error normalizing date fields for edit form:', e);
    }
  }
};

const openDeleteDialog = (item: any) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
};

const groupDeleteDialog = ref(false);

const openGroupDeleteDialog = () => {
  groupDeleteDialog.value = true;
};

const deleteGroupItems = async () => {
  try {
    const selectedIds = validSelectedItems.value.map((item) => getUniqueValue(item));

    // Use bulk delete endpoint with comma-separated IDs
    const idsParam = selectedIds.join(',');
    await api.delete(`?ids=${idsParam}`);

    groupDeleteDialog.value = false;
    clearSelection();
    await fetchData();

    snackbarMessage.value = `✅ ${selectedIds.length} آیتم با موفقیت حذف شد`;
    snackbar.value = true;
  } catch (err) {
    console.error('خطا در حذف گروهی اطلاعات', err);
    snackbarMessage.value = '❌ خطا در حذف گروهی اطلاعات!';
    snackbar.value = true;
  }
};

/**
 * Persists the current form model, converting date fields back to Gregorian
 * (optionally with timezone) before sending to the API. Refreshes the table.
 */
const saveItem = async () => {
  if (!formModel.value) return;

  try {
    // Normalize dates before saving
    const dataToSave = { ...formModel.value };
    props.headers.forEach((header) => {
      if (header.isDate && dataToSave[header.key]) {
        try {
          const raw = dataToSave[header.key];
          if (typeof raw === 'string') {
            const toIsoWithOffset = (ymd: string) => {
              const [y, m, d] = ymd.split('-').map(Number);
              const local = new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
              const offsetMin = -local.getTimezoneOffset();
              const sign = offsetMin >= 0 ? '+' : '-';
              const abs = Math.abs(offsetMin);
              const hh = String(Math.floor(abs / 60)).padStart(2, '0');
              const mm = String(abs % 60).padStart(2, '0');
              const mm2 = String(m).padStart(2, '0');
              const dd2 = String(d).padStart(2, '0');
              return `${y}-${mm2}-${dd2}T00:00:00${sign}${hh}:${mm}`;
            };

            if (raw.includes('/')) {
              // Shamsi jYYYY/jMM/jDD -> Gregorian YYYY-MM-DD
              const greg = DateConverter.toGregorian(raw);
              dataToSave[header.key] = props.dateWithTimezone ? toIsoWithOffset(greg) : greg;
            } else if (raw.includes('T')) {
              // ISO string -> keep as is or trim time if not requested
              dataToSave[header.key] = props.dateWithTimezone ? raw : raw.split('T')[0];
            } else {
              // Already YYYY-MM-DD
              dataToSave[header.key] = props.dateWithTimezone ? toIsoWithOffset(raw) : raw;
            }
          }
        } catch (error) {
          console.error(`Error converting date for field ${header.key}:`, error);
        }
      }
    });

    if (isEditing.value && dataToSave.id) {
      await api.update(dataToSave);
      snackbarMessage.value = '✅ آیتم با موفقیت بروزرسانی شد!';
    } else {
      const response = await api.create(dataToSave);
      snackbarMessage.value = '✅ آیتم با موفقیت ایجاد شد!';
      if (response.data) items.value.push(response.data);
    }

    snackbar.value = true;
    dialog.value = false;
    await fetchData();
  } catch (err) {
    console.error('خطا در ذخیره اطلاعات', err);
    snackbarMessage.value = '❌ خطا در ذخیره اطلاعات!';
    snackbar.value = true;
  }
};

/**
 * Deletes item by id and refreshes the list.
 */
const deleteItem = async (id: string) => {
  try {
    await api.delete(id);
    deleteDialog.value = false;
    items.value = items.value.filter((item) => item.id !== id);
    await fetchData();
  } catch (err) {
    console.error('خطا در حذف اطلاعات', err);
    snackbarMessage.value = '❌ خطا در حذف اطلاعات!';
    snackbar.value = true;
  }
};

/**
 * Navigates to a dynamic route constructed from the provided route template
 * and the selected item fields. Shows a snackbar if params are missing.
 */
const goToRoute = (key: string, item?: any) => {
  const routes = getRoutesForItem(item);
  if (!routes || !routes[key] || !item) return;

  let routePath = routes[key];
  const missingParams: string[] = [];

  routePath = routePath.replace(/\{(\w+)}/g, (_, field) => {
    if (item[field] !== undefined) {
      return item[field];
    } else {
      missingParams.push(field);
      return `{${field}}`;
    }
  });

  if (missingParams.length > 0) {
    snackbarMessage.value = ` خطا : ${missingParams.join(' , ')}  در خروجی نیست  `;
    snackbar.value = true;
    return;
  }

  router.push(routePath);
};

/**
 * Downloads a file from a URL present on the item. Tries fetch and falls back
 * to axios with blob response, handling common server error content types.
 */
const download = async (key: string | number, item: TableItem) => {
  if (!props.downloadLink || !item) return;

  const fileKey = props.downloadLink[key];
  const url = item[fileKey];

  if (!url || typeof url !== 'string') {
    snackbarMessage.value = `❌ لینک فایل یافت نشد.`;
    snackbar.value = true;
    return;
  }

  // Type assertion after validation
  const fileUrlString = url as string;

  try {
    // Method 1: Fetch file as blob with proper headers
    const response = await fetch(fileUrlString, {
      method: 'GET',
      headers: {
        Accept: 'application/octet-stream,application/pdf,image/*,*/*'
      },
      credentials: 'include' // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response is actually a file or an error
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');

    console.log('Response headers:', {
      contentType,
      contentLength,
      url: fileUrlString
    });

    // If content-type is XML, it's likely an error response
    if (contentType && contentType.includes('xml')) {
      const errorText = await response.text();
      console.error('Server returned XML error:', errorText);
      snackbarMessage.value = `❌ خطای سرور: فایل در دسترس نیست`;
      snackbar.value = true;
      return;
    }

    // If content-length is very small, it might be an error
    if (contentLength && parseInt(contentLength) < 1000) {
      const responseText = await response.text();
      console.log('Small response:', responseText);
      if (responseText.includes('error') || responseText.includes('Error')) {
        snackbarMessage.value = `❌ خطای سرور: فایل در دسترس نیست`;
        snackbar.value = true;
        return;
      }
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;

    // Extract filename from URL or use default
    const filename = fileUrlString.split('/').pop() || 'download';
    link.download = filename;

    // Add to DOM, click, and cleanup
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL
    window.URL.revokeObjectURL(url);

    snackbarMessage.value = `✅ دانلود شروع شد`;
    snackbar.value = true;
  } catch (error) {
    console.error('Download error:', error);

    // Method 2: Try with axios instance (includes auth headers)
    try {
      const axiosResponse = await componentAxiosInstance.get(fileUrlString, {
        responseType: 'blob',
        headers: {
          Accept: 'application/octet-stream,application/pdf,image/*,*/*'
        }
      });

      // Check response type
      const contentType = axiosResponse.headers['content-type'];
      const contentLength = axiosResponse.headers['content-length'];

      console.log('Axios response headers:', {
        contentType,
        contentLength,
        url: fileUrlString
      });

      // If it's XML, convert to text to see the error
      if (contentType && contentType.includes('xml')) {
        const textResponse = await componentAxiosInstance.get(fileUrlString, {
          responseType: 'text'
        });
        console.error('Server returned XML error:', textResponse.data);
        snackbarMessage.value = `❌ خطای سرور: فایل در دسترس نیست`;
        snackbar.value = true;
        return;
      }

      const blob = new Blob([axiosResponse.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      const filename = fileUrlString.split('/').pop() || 'download';
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      snackbarMessage.value = `✅ دانلود شروع شد`;
      snackbar.value = true;
    } catch (axiosError: any) {
      console.error('Axios download error:', axiosError);

      // Try to get the error response as text
      if (axiosError.response) {
        try {
          const errorText = await componentAxiosInstance.get(fileUrlString, {
            responseType: 'text'
          });
          console.error('Server error response:', errorText.data);
        } catch (textError) {
          console.error('Could not get error text:', textError);
        }
      }

      snackbarMessage.value = `❌ خطا در دانلود فایل`;
      snackbar.value = true;
    }
  }
};

/**
 * Handles pagination page change and refetches server data.
 */
const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
  debouncedFetchData();
};

onMounted(() => {
  if (props.autoFetch) {
    fetchData();
  }
});

const openCustomActionDialog = (action: CustomAction, item: any) => {
  customActionComponent.value = action.component;

  // Find the original server data for this item
  const originalItem = originalServerData.value.find((originalItem) => {
    const itemId = typeof props.uniqueKey === 'function' ? props.uniqueKey(item) : item[props.uniqueKey as string];
    const originalId = typeof props.uniqueKey === 'function' ? props.uniqueKey(originalItem) : originalItem[props.uniqueKey as string];
    return itemId === originalId;
  });

  // Pass original server data to custom action components
  customActionItem.value = originalItem ? { ...originalItem } : { ...item };
  customActionDialog.value = true;
};

const getColumnStyle = (column: any, item: any) => {
  const header = props.headers.find((h) => h.key === column.key);
  if (!header) return {};

  const baseStyle = header.style || {};
  if (header.conditionalStyle) {
    const conditionalStyle = header.conditionalStyle(item[column.key], item);
    return { ...baseStyle, ...conditionalStyle };
  }
  return baseStyle;
};

// Helper function to get nested object values
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

/**
 * Returns the display value for a cell, applying custom renderer/formatter
 * and enum translation when configured on the column header.
 */
const getTranslatedValue = (value: any, column: any, item: any) => {
  const header = props.headers.find((h) => h.key === column.key);
  if (!header) return value;

  // Use custom renderer if provided
  if (header.customRenderer) {
    return header.customRenderer(item);
  }

  // Use custom formatter if provided
  if (header.formatter) {
    return header.formatter(value, item);
  }

  // Money type formatting with separators
  if (String(header.type).toLowerCase() === 'money') {
    try {
      return formatNumberWithCommas(value ?? 0, 0);
    } catch (e) {
      return value;
    }
  }

  if (header.translate) {
    if (header.options) {
      // Find matching option for enum value
      const option = header.options.find((opt) => opt.value === value);
      return option?.title || value;
    }
    // Fallback to basic translation if no options provided
    return translateValue(value);
  }
  return value;
};

const translateValue = (value: string) => {
  // Example translation mapping
  const translations: Record<string, string> = {
    ACTIVE: 'فعال',
    INACTIVE: 'غیرفعال',
    PENDING: 'در انتظار',
    COMPLETED: 'تکمیل شده'
    // Add more translations as needed
  };
  return translations[value] || value;
};

/**
 * Truncates text if it exceeds maxTextLength and adds ellipsis
 */
const truncateText = (text: any, maxLength: number = props.maxTextLength): string => {
  if (text === null || text === undefined) return '';
  const textStr = String(text);
  if (textStr.length <= maxLength) return textStr;
  return textStr.substring(0, maxLength) + '...';
};

/**
 * Checks if text should be truncated for a specific column
 */
const shouldTruncate = (text: any, header: Header | null): boolean => {
  if (text === null || text === undefined || !header) return false;
  // If header explicitly disables truncation, don't truncate
  if (header.truncate === false) return false;
  // If global truncation is enabled and header doesn't explicitly disable it, check length
  if (props.enableTextTruncation && (header.truncate === true || header.truncate === undefined)) {
    return String(text).length > props.maxTextLength;
  }
  // If header explicitly enables truncation (even if global is off), check length
  if (header.truncate === true) {
    return String(text).length > props.maxTextLength;
  }
  return false;
};

/**
 * Gets the header configuration for a column key
 */
const getHeaderForColumn = (columnKey: string): Header | null => {
  return props.headers.find((h) => h.key === columnKey) || null;
};

/**
 * Checks if copy button should be shown for a specific column
 */
const shouldShowCopyButton = (header: Header | null): boolean => {
  return header?.showCopyButton === true;
};

/**
 * Opens dialog to show full text with copy functionality
 */
const openTextPreview = (text: any, columnTitle: string, item: any) => {
  previewText.value = text === null || text === undefined ? '' : String(text);
  previewTitle.value = columnTitle;
  previewItem.value = item;
  textPreviewDialog.value = true;
};

/**
 * Copies text to clipboard
 */
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    snackbarMessage.value = '✅ متن با موفقیت کپی شد!';
    snackbar.value = true;
  } catch (err) {
    console.error('Failed to copy text:', err);
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      snackbarMessage.value = '✅ متن با موفقیت کپی شد!';
      snackbar.value = true;
    } catch (fallbackErr) {
      snackbarMessage.value = '❌ خطا در کپی کردن متن!';
      snackbar.value = true;
    }
  }
};

/**
 * Copies the complete record (all fields) to clipboard
 */
const copyCompleteRecord = async () => {
  if (!previewItem.value) return;
  
  try {
    // Format the complete record as JSON
    const recordText = JSON.stringify(previewItem.value, null, 2);
    await copyToClipboard(recordText);
  } catch (err) {
    console.error('Failed to copy record:', err);
    snackbarMessage.value = '❌ خطا در کپی کردن رکورد!';
    snackbar.value = true;
  }
};

/**
 * Applies currently edited filters and refetches from the first page.
 */
const applyFilter = () => {
  currentPage.value = 1; // Reset to first page when applying new filters
  debouncedFetchData();
  filterDialog.value = false;
};

/**
 * Clears filters and refetches from the first page.
 */
const resetFilter = () => {
  filterModel.value = {};
  currentPage.value = 1;
  debouncedFetchData();
  filterDialog.value = false;
};

// Handle filter apply from custom filter component
/**
 * Receives filter data from a custom filter component and refetches.
 */
const handleFilterApply = (filterData: any) => {
  filterModel.value = filterData;
  currentPage.value = 1;
  debouncedFetchData();
  filterDialog.value = false;
};
</script>

<template>
  <!-- Page Title -->
  <div v-if="props.title" class="page-title">
    <h3 class="title-text">{{ props.title }}</h3>
  </div>

  <!-- Action Buttons OUTSIDE the table container -->
  <div class="action-buttons">
    <v-btn v-if="props.actions?.includes('create')" color="green" class="me-2" @click="openDialog()">ایجاد ✅</v-btn>
    <v-btn v-if="hasFilterComponent" class="me-2" @click="filterDialog = true">فیلتر 🔍</v-btn>
    <v-btn v-if="props.showRefreshButton" color="blue" @click="debouncedFetchData" :loading="loading">بروزرسانی 🔄</v-btn>

    <!-- Selection Actions -->
    <div v-if="props.selectable && hasSelection" class="selection-actions">
      <v-chip color="primary" class="me-2"> {{ selectedCount }} آیتم انتخاب شده </v-chip>
      <v-btn color="error" size="small" class="me-2" @click="clearSelection"> پاک کردن انتخاب </v-btn>
    </div>

    <!-- Action Buttons for Selected Items -->
    <transition name="slide-left" appear>
      <div v-if="(props.bulkMode && hasValidSelection) || (props.enableGroupDelete && hasSelection)" class="selected-actions">
        <!-- Group Actions -->
        <v-btn v-if="props.enableGroupDelete" color="red" size="small" class="me-2" @click="openGroupDeleteDialog">
          <span class="me-1">🗑️</span>
          حذف گروهی ({{ selectedCount }})
        </v-btn>

        <!-- Individual Actions for Selected Items (only in bulk mode) -->
        <template v-if="props.bulkMode" v-for="item in validSelectedItems" :key="getUniqueValue(item)">
          <!-- CRUD Actions -->
          <v-btn v-if="props.actions?.includes('edit')" color="blue" size="small" class="me-2" @click="openDialog(item)">
            <span class="me-1">✏️</span>
            ویرایش
          </v-btn>

          <v-btn v-if="props.actions?.includes('delete')" color="red" size="small" class="me-2" @click="openDeleteDialog(item)">
            <span class="me-1">🗑️</span>
            حذف
          </v-btn>

          <v-btn v-if="props.actions?.includes('view')" color="purple" size="small" class="me-2" @click="goToRoute('view', item)">
            <span class="me-1">👁️</span>
            نمایش
          </v-btn>

          <!-- Route Actions -->
          <template v-for="(routePath, routeKey) in getRoutesForItem(item)" :key="routeKey">
            <v-btn color="indigo" size="small" class="me-2" @click="goToRoute(routeKey, item)">
              <span class="me-1">➡️</span>
              {{ String(routeKey) }}
            </v-btn>
          </template>

          <!-- Download Actions -->
          <v-btn v-for="(value, key) in props.downloadLink" size="small" class="me-2" :key="key" @click="download(key, item)">
            <span class="me-1">⬇️</span>
            {{ key }}
          </v-btn>

          <!-- Custom Actions -->
          <template v-for="(action, index) in props.customActions" :key="action.title || index">
            <v-btn
              v-if="!action.condition || action.condition(item)"
              color="orange"
              size="small"
              class="me-2"
              @click="openCustomActionDialog(action, item)"
            >
              {{ action.title }}
            </v-btn>
          </template>

          <!-- Custom Buttons -->
          <template v-if="props.customButtonsFn">
            <v-btn
              v-for="button in props.customButtonsFn(item)"
              :key="button.label"
              :color="button.color || 'primary'"
              size="small"
              class="me-2"
              :disabled="button.disabled"
              @click="button.onClick(item)"
            >
              <span v-if="(button as any).icon" class="me-1">{{ (button as any).icon }}</span>
              {{ button.label }}
            </v-btn>
          </template>
          <template v-else>
            <v-btn
              v-for="button in props.customButtons"
              :key="button.label"
              :color="button.color || 'primary'"
              size="small"
              class="me-2"
              @click="button.onClick(item)"
            >
              <span v-if="(button as any).icon" class="me-1">{{ (button as any).icon }}</span>
              {{ button.label }}
            </v-btn>
          </template>
        </template>
      </div>
    </transition>
  </div>

  <!-- Data Table Container (fills parent height) -->
  <div
    class="data-table-container"
    v-bind="$attrs"
    role="region"
    :aria-busy="loading || isLoadingMore"
    :aria-live="loading || isLoadingMore ? 'polite' : 'off'"
  >
    <template v-if="loading && !isLoadingMore">
      <div class="skeleton-container" :style="{ height: `${props.height}px` }">
        <v-skeleton-loader type="table" :loading="loading" class="mx-auto" max-width="100%" :boilerplate="false" />
      </div>
    </template>
    <template v-else>
      <!-- Grouped Table Structure -->
      <div v-if="props.groupBy && groupedItems.length > 0" class="grouped-table">
        <!-- Group Controls -->
        <div class="group-controls mb-3">
          <v-btn size="small" color="primary" @click="expandAllGroups" class="me-2"> گسترش همه </v-btn>
          <v-btn size="small" color="secondary" @click="collapseAllGroups" class="me-2"> جمع کردن همه </v-btn>
        </div>

        <!-- Single Scrollable Container for All Groups -->
        <div class="groups-scroll-container" :style="{ height: `${props.height - 120}px` }">
          <div class="groups-container">
            <div v-for="group in groupedItems" :key="group.groupKey" class="group-section">
              <!-- Group Header -->
              <div
                class="group-header"
                role="button"
                tabindex="0"
                @click.stop="toggleGroup(group.groupKey)"
                @mousedown.stop
                @keydown.enter.prevent="toggleGroup(group.groupKey)"
                @keydown.space.prevent="toggleGroup(group.groupKey)"
                :aria-expanded="group.isExpanded ? 'true' : 'false'"
                :aria-controls="`group-panel-${group.groupKey}`"
                :id="`group-header-${group.groupKey}`"
                :class="{ expanded: group.isExpanded }"
              >
                <IconChevronDown v-if="group.isExpanded" class="me-2 chevron-icon" />
                <IconChevronRight v-else class="me-2 chevron-icon" />
                <span class="group-label">{{ group.groupLabel }}</span>
                <v-chip size="small" color="darkprimary" class="ms-auto">{{ group.count }}</v-chip>
              </div>

              <!-- Group Items -->
              <transition name="group-expand" appear>
                <div
                  v-if="group.isExpanded"
                  class="group-items"
                  :id="`group-panel-${group.groupKey}`"
                  :aria-labelledby="`group-header-${group.groupKey}`"
                  role="region"
                >
                  <v-data-table
                    :headers="groupedHeaders"
                    :items="group.items"
                    :items-per-page="itemsPerPage"
                    hide-default-footer
                    class="elevation-1 group-table"
                    no-data-text="رکوردی یافت نشد"
                    hover
                    :height="'auto'"
                    density="compact"
                  >
                    <!-- Custom Header for Selection -->
                    <template v-slot:header.selection="{ column }">
                      <v-checkbox
                        v-if="props.selectable && props.multiSelect"
                        :model-value="selectAll"
                        @update:model-value="toggleSelectAll"
                        :indeterminate="selectedCount > 0 && selectedCount < items.length"
                        hide-details
                        density="compact"
                      />
                    </template>
                    <template v-slot:item="{ item, columns, index }">
                      <tr
                        :style="{
                          background:
                            isSelected(item) && props.bulkMode
                              ? 'rgb(var(--v-theme-primary200))'
                              : index % 2 === 0
                                ? 'rgb(var(--v-theme-surface))'
                                : 'rgb(var(--v-theme-lightprimary))',
                          cursor: props.bulkMode && props.selectable ? 'pointer' : 'default'
                        }"
                        :tabindex="props.selectable ? 0 : -1"
                        @keydown.enter.prevent="props.selectable && toggleSelection(item)"
                        @click="props.bulkMode && props.selectable && selectSingleItem(item)"
                      >
                        <td
                          v-for="column in columns"
                          :key="column.key || 'unknown'"
                          :style="{
                            ...getColumnStyle(column, item),
                            ...(column.width
                              ? { width: column.width + 'px', minWidth: column.width + 'px', maxWidth: column.width + 'px' }
                              : {})
                          }"
                        >
                          <!-- Selection Checkbox/Radio -->
                          <template v-if="column.key === 'selection'">
                            <v-radio
                              v-if="props.bulkMode"
                              :model-value="radioGroupValue"
                              :value="getUniqueValue(item)"
                              @click.stop="selectSingleItem(item)"
                              :disabled="!props.selectable"
                              hide-details
                              density="compact"
                            />
                            <v-checkbox
                              v-else
                              :model-value="isSelected(item)"
                              @update:model-value="toggleSelection(item)"
                              :disabled="!props.selectable"
                              hide-details
                              density="compact"
                            />
                          </template>
                          <template v-if="column.key === 'actions' && hasAnyActions">
                            <v-btn v-if="props.actions?.includes('edit')" color="blue" size="small" class="mr-2" @click="openDialog(item)">
                              ویرایش ✏️
                            </v-btn>
                            <v-btn
                              v-if="props.actions?.includes('delete')"
                              color="red"
                              size="small"
                              class="mr-2"
                              @click="openDeleteDialog(item)"
                              >حذف ❌
                            </v-btn>
                            <v-btn
                              v-if="props.actions?.includes('view')"
                              color="purple"
                              size="small"
                              class="mr-2"
                              @click="goToRoute('view', item)"
                              >🔍 نمایش
                            </v-btn>
                            <template v-for="(routePath, routeKey) in getRoutesForItem(item)" :key="routeKey">
                              <v-btn color="indigo" size="small" class="mr-2" @click="goToRoute(routeKey, item)">
                                {{ routeKey.toUpperCase() }}
                              </v-btn>
                            </template>
                            <v-btn
                              v-for="(value, key) in props.downloadLink"
                              size="small"
                              class="mr-2"
                              :key="key"
                              @click="download(key, item)"
                            >
                              {{ key }} ⬇️
                            </v-btn>
                            <template v-for="(action, index) in props.customActions" :key="action.title || index">
                              <v-btn
                                v-if="!action.condition || action.condition(item)"
                                color="orange"
                                size="small"
                                class="mr-2"
                                @click="openCustomActionDialog(action, item)"
                              >
                                {{ action.title }}
                              </v-btn>
                            </template>
                            <template v-if="props.customButtonsFn">
                              <v-btn
                                v-for="button in props.customButtonsFn(item)"
                                :key="button.label"
                                :color="button.color || 'primary'"
                                size="small"
                                class="mr-2"
                                :disabled="button.disabled"
                                @click="button.onClick(item)"
                              >
                                {{ button.label }}
                              </v-btn>
                            </template>
                            <template v-else>
                              <v-btn
                                v-for="button in props.customButtons"
                                :key="button.label"
                                :color="button.color || 'primary'"
                                size="small"
                                class="mr-2"
                                @click="button.onClick(item)"
                              >
                                {{ button.label }}
                              </v-btn>
                            </template>
                          </template>
                          <template v-else>
                            <div class="d-flex align-center" style="gap: 4px;">
                              <span
                                v-if="shouldTruncate(getTranslatedValue(getNestedValue(item, column.key || ''), column, item), getHeaderForColumn(column.key || ''))"
                                class="truncated-text"
                                :style="{ cursor: 'pointer', color: 'rgb(var(--v-theme-primary))', textDecoration: 'underline' }"
                                @click.stop="openTextPreview(getTranslatedValue(getNestedValue(item, column.key || ''), column, item), (column.title || column.key || '') as string, item)"
                              >
                                {{ truncateText(getTranslatedValue(getNestedValue(item, column.key || ''), column, item)) }}
                              </span>
                              <span
                                v-else
                                @click.stop="shouldShowCopyButton(getHeaderForColumn(column.key || '')) && openTextPreview(getTranslatedValue(getNestedValue(item, column.key || ''), column, item), (column.title || column.key || '') as string, item)"
                                :style="{ cursor: shouldShowCopyButton(getHeaderForColumn(column.key || '')) ? 'pointer' : 'default' }"
                              >
                                {{ getTranslatedValue(getNestedValue(item, column.key || ''), column, item) }}
                              </span>
                              <v-btn
                                v-if="shouldShowCopyButton(getHeaderForColumn(column.key || ''))"
                                icon
                                size="x-small"
                                variant="text"
                                color="primary"
                                @click.stop="openTextPreview(getTranslatedValue(getNestedValue(item, column.key || ''), column, item), (column.title || column.key || '') as string, item)"
                                style="min-width: 24px; width: 24px; height: 24px;"
                              >
                                <v-icon size="16">mdi-content-copy</v-icon>
                              </v-btn>
                            </div>
                          </template>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Regular Table Structure (when not grouped) -->
      <v-data-table
        v-else
        :headers="normalHeaders"
        :items="items"
        :items-per-page="itemsPerPage"
        hide-default-footer
        class="elevation-1"
        no-data-text="رکوردی یافت نشد"
        hover
        :height="props.height"
        density="compact"
      >
        <!-- Custom Header for Selection -->
        <template v-slot:header.selection="{ column }">
          <v-checkbox
            v-if="props.selectable && props.multiSelect"
            :model-value="selectAll"
            @update:model-value="toggleSelectAll"
            :indeterminate="selectedCount > 0 && selectedCount < items.length"
            hide-details
            density="compact"
          />
        </template>
        <template v-slot:item="{ item, columns, index }">
          <tr
            :style="{
              color: isSelected(item) && props.bulkMode ? 'rgb(var(--v-theme-white))' : 'rgb(var(--v-theme-darkText))',
              background:
                isSelected(item) && props.bulkMode
                  ? 'rgb(var(--v-theme-primary))'
                  : index % 2 === 0
                    ? 'rgb(var(--v-theme-surface))'
                    : 'rgb(var(--v-theme-lightprimary))',
              cursor: props.bulkMode && props.selectable ? 'pointer' : 'default'
            }"
            :tabindex="props.selectable ? 0 : -1"
            @keydown.enter.prevent="props.selectable && toggleSelection(item)"
            @click="props.bulkMode && props.selectable && selectSingleItem(item)"
          >
            <td
              v-for="column in columns"
              :key="column.key || 'unknown'"
              :style="{
                ...getColumnStyle(column, item),
                ...(column.width ? { width: column.width + 'px', minWidth: column.width + 'px', maxWidth: column.width + 'px' } : {})
              }"
            >
              <!-- Selection Checkbox/Radio -->
              <template v-if="column.key === 'selection'">
                <v-radio
                  v-if="props.bulkMode"
                  :model-value="radioGroupValue"
                  :value="getUniqueValue(item)"
                  @click.stop="selectSingleItem(item)"
                  :disabled="!props.selectable"
                  hide-details
                  density="compact"
                />
                <v-checkbox
                  v-else
                  :model-value="isSelected(item)"
                  @update:model-value="toggleSelection(item)"
                  :disabled="!props.selectable"
                  hide-details
                  density="compact"
                />
              </template>
              <template v-if="column.key === 'actions' && hasAnyActions">
                <v-btn v-if="props.actions?.includes('edit')" color="blue" size="small" class="mr-2" @click="openDialog(item)">
                  ویرایش ✏️
                </v-btn>
                <v-btn v-if="props.actions?.includes('delete')" color="red" size="small" class="mr-2" @click="openDeleteDialog(item)"
                  >حذف ❌
                </v-btn>
                <v-btn v-if="props.actions?.includes('view')" color="purple" size="small" class="mr-2" @click="goToRoute('view', item)"
                  >🔍 نمایش
                </v-btn>
                <template v-for="(routePath, routeKey) in getRoutesForItem(item)" :key="routeKey">
                  <v-btn color="indigo" size="small" class="mr-2" @click="goToRoute(routeKey, item)">
                    {{ routeKey.toUpperCase() }}
                  </v-btn>
                </template>
                <v-btn v-for="(value, key) in props.downloadLink" size="small" class="mr-2" :key="key" @click="download(key, item)">
                  {{ key }} ⬇️
                </v-btn>
                <template v-for="(action, index) in props.customActions" :key="action.title || index">
                  <v-btn
                    v-if="!action.condition || action.condition(item)"
                    color="orange"
                    size="small"
                    class="mr-2"
                    @click="openCustomActionDialog(action, item)"
                  >
                    {{ action.title }}
                  </v-btn>
                </template>
                <template v-if="props.customButtonsFn">
                  <v-btn
                    v-for="button in props.customButtonsFn(item)"
                    :key="button.label"
                    :color="button.color || 'primary'"
                    size="small"
                    class="mr-2"
                    :disabled="button.disabled"
                    @click="button.onClick(item)"
                  >
                    {{ button.label }}
                  </v-btn>
                </template>
                <template v-else>
                  <v-btn
                    v-for="button in props.customButtons"
                    :key="button.label"
                    :color="button.color || 'primary'"
                    size="small"
                    class="mr-2"
                    @click="button.onClick(item)"
                  >
                    {{ button.label }}
                  </v-btn>
                </template>
              </template>
              <template v-else>
                <div class="d-flex align-center" style="gap: 4px;">
                  <span
                    v-if="shouldTruncate(getTranslatedValue(getNestedValue(item, column.key || ''), column, item), getHeaderForColumn(column.key || ''))"
                    class="truncated-text"
                    :style="{ cursor: 'pointer', color: 'rgb(var(--v-theme-primary))', textDecoration: 'underline' }"
                    @click.stop="openTextPreview(getTranslatedValue(getNestedValue(item, column.key || ''), column, item), (column.title || column.key || '') as string, item)"
                  >
                    {{ truncateText(getTranslatedValue(getNestedValue(item, column.key || ''), column, item)) }}
                  </span>
                  <span
                    v-else
                    @click.stop="shouldShowCopyButton(getHeaderForColumn(column.key || '')) && openTextPreview(getTranslatedValue(getNestedValue(item, column.key || ''), column, item), (column.title || column.key || '') as string, item)"
                    :style="{ cursor: shouldShowCopyButton(getHeaderForColumn(column.key || '')) ? 'pointer' : 'default' }"
                  >
                    {{ getTranslatedValue(getNestedValue(item, column.key || ''), column, item) }}
                  </span>
                  <v-btn
                    v-if="shouldShowCopyButton(getHeaderForColumn(column.key || ''))"
                    icon
                    size="x-small"
                    variant="text"
                    color="primary"
                    @click.stop="openTextPreview(getTranslatedValue(getNestedValue(item, column.key || ''), column, item), (column.title || column.key || '') as string, item)"
                    style="min-width: 24px; width: 24px; height: 24px;"
                  >
                    <v-icon size="16">mdi-content-copy</v-icon>
                  </v-btn>
                </div>
              </template>
            </td>
          </tr>
        </template>
      </v-data-table>

      <!-- Loading indicator for infinite scroll -->
      <div v-if="isLoadingMore" class="d-flex justify-center align-center pa-4">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
    </template>

    <!-- Custom Pagination always visible at the bottom -->
    <div v-if="props.showPagination" class="pagination-wrapper">
      <div class="d-flex justify-space-between align-center pa-4">
        <div class="text-subtitle-2">
          نمایش {{ (currentPage - 1) * itemsPerPage + 1 }} تا {{ Math.min(currentPage * itemsPerPage, totalSize) }} از {{ totalSize }} رکورد
        </div>
        <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" size="small" @update:model-value="handlePageChange" />
      </div>
    </div>
  </div>

  <v-dialog v-model="dialog" max-width="1400">
    <v-card>
      <v-card-title>{{ isEditing ? 'ویرایش' : 'ایجاد' }}</v-card-title>
      <v-card-text>
        <v-container>
          <component v-if="props.formComponent" :is="props.formComponent" v-model="formModel" />
          <template v-else>
            <v-row>
              <v-col
                v-for="header in formHeaders"
                :key="resolveHeaderKey(header)"
                :cols="header.cols ? (typeof header.cols === 'number' ? header.cols : Number(header.cols)) : 4"
                :md="header.cols ? (typeof header.cols === 'number' ? header.cols : Number(header.cols)) : 4"
              >
                <template v-if="!header.hidden">
                  <ShamsiDatePicker
                    v-if="header.isDate"
                    v-model="formModel[resolveHeaderKey(header)]"
                    :label="resolveHeaderTitle(header)"
                    :disabled="isHeaderDisabled(header)"
                  />
                  <v-autocomplete
                    v-else-if="hasAutocomplete(header)"
                    v-model="formModel[resolveHeaderKey(header)]"
                    :label="resolveHeaderTitle(header)"
                    :items="resolveAutocompleteItems(header, formModel.value)"
                    :item-title="resolveAutocompleteItemTitle(header)"
                    :item-value="resolveAutocompleteItemValue(header)"
                    :return-object="resolveAutocompleteReturnObject(header)"
                    :multiple="resolveAutocompleteMultiple(header)"
                    :chips="resolveAutocompleteMultiple(header)"
                    :closable-chips="resolveAutocompleteMultiple(header)"
                    :disabled="isHeaderDisabled(header)"
                    clearable
                    variant="outlined"
                  />
                  <MoneyInput
                    v-else-if="isMoneyHeader(header)"
                    v-model="formModel[resolveHeaderKey(header)] as number"
                    :label="resolveHeaderTitle(header)"
                    :disabled="isHeaderDisabled(header)"
                  />
                  <v-textarea
                    v-else-if="isTextareaHeader(header)"
                    v-model="formModel[resolveHeaderKey(header)]"
                    :label="resolveHeaderTitle(header)"
                    variant="outlined"
                    :disabled="isHeaderDisabled(header)"
                    :dir="(header as Header).dir"
                    auto-grow
                    rows="3"
                  />
                  <v-text-field
                    v-else
                    v-model="formModel[resolveHeaderKey(header)]"
                    :label="resolveHeaderTitle(header)"
                    variant="outlined"
                    :disabled="isHeaderDisabled(header)"
                    :type="getFieldInputType(header)"
                    :dir="(header as Header).dir"
                  />
                </template>
              </v-col>
            </v-row>
          </template>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="tonal" color="error" @click="dialog = false">انصراف</v-btn>
        <v-btn color="primary" var @click="saveItem">{{ isEditing ? 'ذخیره' : 'ایجاد' }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title>حذف آیتم</v-card-title>
      <v-card-text> آیا مایل به حذف این رکورد هستید ?</v-card-text>
      <v-card-actions>
        <v-btn color="grey" @click="deleteDialog = false">انصراف</v-btn>
        <v-btn color="red" @click="deleteItem(String(itemToDelete?.id || ''))">حذف</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Group Delete Confirmation Dialog -->
  <v-dialog v-model="groupDeleteDialog" max-width="500">
    <v-card>
      <v-card-title class="text-h6">
        <v-icon color="red" class="me-2">🗑️</v-icon>
        حذف گروهی
      </v-card-title>
      <v-card-text>
        <p>
          آیا مایل به حذف <strong>{{ selectedCount }}</strong> آیتم انتخاب شده هستید؟
        </p>
        <v-alert type="warning" variant="tonal" class="mt-3"> این عمل قابل بازگشت نیست! </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="groupDeleteDialog = false">انصراف</v-btn>
        <v-btn color="red" @click="deleteGroupItems" :loading="loading"> حذف {{ selectedCount }} آیتم </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="customActionDialog" max-width="1300">
    <v-card>
      <v-card-title>
        {{ props.customActions?.find((a) => a.component === customActionComponent)?.title || '' }}
      </v-card-title>
      <v-card-text>
        <component v-if="customActionComponent" :is="customActionComponent" :item="customActionItem" @close="customActionDialog = false" />
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Filter Dialog -->
  <v-dialog v-model="filterDialog" max-width="800">
    <v-card>
      <v-card-title>فیلتر</v-card-title>
      <v-card-text>
        <component
          v-if="props.filterComponent"
          :is="props.filterComponent"
          v-model="filterModel"
          @update:modelValue="filterModel = $event"
          @apply="handleFilterApply"
        />
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Text Preview Dialog -->
  <v-dialog v-model="textPreviewDialog" max-width="800">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ previewTitle }}</span>
        <v-btn icon variant="text" @click="textPreviewDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-textarea
          :model-value="previewText"
          readonly
          auto-grow
          variant="outlined"
          rows="10"
          class="mb-4"
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="copyToClipboard(previewText)">
          <v-icon start>mdi-content-copy</v-icon>
          کپی متن
        </v-btn>
        <v-btn color="success" @click="copyCompleteRecord">
          <v-icon start>mdi-content-copy</v-icon>
          کپی رکورد کامل
        </v-btn>
        <v-btn color="grey" @click="textPreviewDialog = false">بستن</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Snackbar for messages -->
  <v-snackbar v-if="snackbar" v-model="snackbar" :timeout="3000" location="top">
    {{ snackbarMessage }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="snackbar = false"> بستن </v-btn>
    </template>
  </v-snackbar>
</template>

