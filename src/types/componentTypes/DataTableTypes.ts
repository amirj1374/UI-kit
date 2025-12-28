/**
 * Enhanced type definitions for CustomDataTable component
 * Replaces all 'any' types with proper TypeScript types
 */
import type { Ref } from 'vue';
import type { AxiosInstance } from 'axios';

export interface TableItem {
  id?: string | number | null;
  [key: string]: unknown;
}

export interface Header {
  title: string;
  key: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  editable?: boolean;
  filterable?: boolean;
  width?: number;
  hidden?: boolean;
  defaultValue?: unknown;
  style?: Record<string, string>;
  translate?: boolean;
  options?: Array<{ title: string; value: string | number | boolean }>;
  conditionalStyle?: (value: unknown, item: TableItem) => Record<string, string>;
  nestedKey?: string;
  customRenderer?: (item: TableItem) => string | number | boolean;
  formatter?: (value: unknown, item: TableItem) => string;
  type?: 'text' | 'date' | 'textarea' | 'money' | 'toggle' | 'toggleSwitch' | 'autocomplete' | string; // Field type for form rendering
  autocompleteItems?: any[] | Ref<any[] | undefined> | ((context?: Record<string, any>) => any[] | undefined);
  autocompleteItemTitle?: string;
  autocompleteItemValue?: string;
  autocompleteReturnObject?: boolean;
  autocompleteMultiple?: boolean;
  truncate?: boolean; // Enable truncation for this column (requires enableTextTruncation prop)
  showCopyButton?: boolean; // Show copy button for this column (works even without truncation)
  cols?: number | string; // Column span for form layout (default: 12 for mobile, 4 for md and up)
  dir?: 'ltr' | 'rtl'; // Text direction for the input field
  excludeFromForm?: boolean; // If true, field will be shown in table but excluded from create/edit forms (e.g., createdAt, updatedAt)
  // Deprecated: Use type='date' instead
  isDate?: boolean;
  // Deprecated: Use type='textarea' instead
  textarea?: boolean;
  // Deprecated: Use type='toggle' or type='toggleSwitch' instead
  toggleSwitch?: boolean;

  /**
   * Optional list of supported filter operators for this column when using
   * the auto-generated filter form.
   * Example (Java/Spring style): ['equals', 'in', 'contains']
   */
  filterOperators?: FilterOperator[];

  /**
   * Default filter operator for this header in the auto filter UI.
   * Defaults to 'equals' when not provided.
   */
  defaultFilterOperator?: FilterOperator;

  /**
   * Date picker mode for date type headers.
   * - 'single': Single date selection (default)
   * - 'range': Date range selection (returns [startDate, endDate])
   */
  dateMode?: 'single' | 'range';
}

export interface CustomAction {
  title: string;
  component: any; // Vue component - keeping as any for Vue component types
  condition?: (item: TableItem) => boolean;
}

export interface CustomButtonAction {
  label: string;
  color?: string;
  onClick: (item: TableItem) => void;
  disabled?: boolean;
}

export interface PaginationConfig {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface TableRoutes {
  [key: string]: string;
}

export interface TableQueryParams {
  [key: string]: unknown;
}

export interface DownloadLink {
  [key: string]: string;
}

/**
 * Supported Java-style filter operators for auto-generated filters.
 * These typically map to backend query params like `field.equals`, `field.in`, etc.
 */
export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'doesNotContain'
  | 'in'
  | 'specified'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual';

export interface DataTableProps {
  apiResource: string;
  headers: Header[];
  actions?: ('create' | 'edit' | 'delete' | 'view' | 'filter')[];
  routes?: TableRoutes | ((item: TableItem) => TableRoutes);
  downloadLink?: DownloadLink;
  formComponent?: any; // Vue component
  customActions?: CustomAction[];
  customButtons?: CustomButtonAction[];
  customButtonsFn?: (item: TableItem) => CustomButtonAction[];
  filterComponent?: any; // Vue component
  autoFetch?: boolean;
  queryParams?: TableQueryParams;
  showPagination?: boolean;
  height: number;
  pagination?: PaginationConfig | boolean;
  showRefreshButton?: boolean;
  title?: string;
  selectable?: boolean;
  multiSelect?: boolean;
  selectedItems?: TableItem[];
  uniqueKey?: string | ((item: TableItem) => string | number);
  pageSize?: number;
  groupBy?: string | ((item: TableItem) => string | number);
  groupHeaderTemplate?: (groupKey: string | number, groupItems: TableItem[]) => string;
  defaultExpanded?: boolean;
  defaultSelected?: string;
  dateWithTimezone?: boolean;
  bulkMode?: boolean;
  axiosInstance?: AxiosInstance; // Optional custom axios instance
  enableTextTruncation?: boolean; // Enable text truncation feature globally (default: false)
  maxTextLength?: number; // Maximum characters to show before truncating (default: 50, only used when enableTextTruncation is true)
}

export interface ApiResponse<T = TableItem> {
  data: {
    content: T[];
    page: {
      totalElements: number;
      totalPages: number;
      number: number;
      size: number;
    };
  };
}

export interface FilterModel {
  [key: string]: unknown;
}

export interface SortConfig {
  key: string;
  order: 'asc' | 'desc';
}

export interface GroupedItems {
  [key: string]: TableItem[];
}

export interface SelectionState {
  selectedItems: TableItem[];
  isAllSelected: boolean;
  isIndeterminate: boolean;
}
