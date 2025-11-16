import { computed } from 'vue';

export interface TableHeader {
  title?: string;
  key?: string;
  sortable?: boolean;
  editable?: boolean;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  align?: 'start' | 'center' | 'end';
  fixed?: boolean | 'left' | 'right';
  resizable?: boolean;
  filterable?: boolean;
  filterOptions?: Array<{ text: string; value: any }>;
  filterMultiple?: boolean;
  filterMethod?: (value: any, row: any, column: any) => boolean;
  sortMethod?: (a: any, b: any) => number;
  sortBy?: string | ((row: any) => any) | (string | ((row: any) => any))[];
  sortOrders?: ('ascending' | 'descending')[];
  formatter?: (row: any, column: any, cellValue: any, index: number) => any;
  className?: string | ((data: { row: any; rowIndex: number; column: any; columnIndex: number }) => string);
  headerClassName?: string | ((data: { row: any; rowIndex: number; column: any; columnIndex: number }) => string);
  showOverflowTooltip?: boolean | { [key: string]: any };
  renderHeader?: (data: { column: any; $index: number }) => any;
  render?: (data: { row: any; column: any; $index: number }) => any;
  children?: TableHeader[];
  type?: 'selection' | 'index' | 'expand';
  index?: number | ((index: number) => number);
  selectable?: (row: any, index: number) => boolean;
  reserveSelection?: boolean;
  filters?: { text: string; value: any }[];
  filterPlacement?: string;
  filteredValue?: any[];
  columnKey?: string;
  [key: string]: any;
}

export interface HeaderOptions {
  selectable?: boolean;
  hasActions?: boolean;
  actionsWidth?: number | string;
  showSelection?: boolean;
  showIndex?: boolean;
  indexLabel?: string;
  indexMethod?: (index: number) => number;
}

export function useTableHeaders(headers: TableHeader[], options: HeaderOptions = {}) {
  const {
    selectable = false,
    hasActions = false,
    actionsWidth = '200px',
    showSelection = true,
    showIndex = false,
    indexLabel = '#',
    indexMethod
  } = options;

  // Add selection column if needed
  const withSelection = computed<TableHeader[]>(() => {
    if (!selectable || !showSelection) return headers;

    return [
      {
        type: 'selection',
        width: '50px',
        align: 'center',
        fixed: 'left',
        selectable: (row: any, index: number) => true
      },
      ...headers
    ];
  });

  // Add index column if needed
  const withIndex = computed<TableHeader[]>(() => {
    if (!showIndex) return withSelection.value;

    return [
      {
        type: 'index',
        label: indexLabel,
        width: '60px',
        align: 'center',
        fixed: 'left',
        index: indexMethod || ((index: number) => index + 1)
      },
      ...withSelection.value
    ];
  });

  // Add actions column if needed
  const withActions = computed<TableHeader[]>(() => {
    if (!hasActions) return withIndex.value;

    return [
      ...withIndex.value,
      {
        label: 'Actions',
        key: 'actions',
        width: actionsWidth,
        fixed: 'right',
        align: 'center',
        render: (data: { row: any, column: any, $index: number }) => {
          // This will be handled by the parent component
          return null;
        }
      }
    ];
  });

  // Final headers with all transformations applied
  const processedHeaders = computed<TableHeader[]>(() => {
    return withActions.value.map(header => ({
      sortable: false,
      resizable: true,
      minWidth: 80,
      align: 'start',
      showOverflowTooltip: true,
      ...header,
      // Ensure width is always a string with px if it's a number
      width: typeof header.width === 'number' ? `${header.width}px` : header.width
    }));
  });

  // Get column by key
  const getColumnByKey = (key: string): TableHeader | undefined => {
    return processedHeaders.value.find(header => header.key === key);
  };

  // Get column index by key
  const getColumnIndex = (key: string): number => {
    return processedHeaders.value.findIndex(header => header.key === key);
  };

  // Get visible columns
  const visibleColumns = computed(() => {
    return processedHeaders.value.filter(header => header.hidden !== true);
  });

  // Get fixed columns
  const fixedColumns = computed(() => {
    return processedHeaders.value.filter(header => header.fixed === true || header.fixed === 'left' || header.fixed === 'right');
  });

  // Get left fixed columns
  const leftFixedColumns = computed(() => {
    return processedHeaders.value.filter(header => header.fixed === 'left');
  });

  // Get right fixed columns
  const rightFixedColumns = computed(() => {
    return processedHeaders.value.filter(header => header.fixed === 'right');
  });

  // Get scrollable columns (not fixed)
  const scrollableColumns = computed(() => {
    return processedHeaders.value.filter(header => !header.fixed);
  });

  return {
    headers: processedHeaders,
    visibleColumns,
    fixedColumns,
    leftFixedColumns,
    rightFixedColumns,
    scrollableColumns,
    getColumnByKey,
    getColumnIndex
  };
}
