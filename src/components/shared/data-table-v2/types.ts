import type { AxiosInstance } from 'axios';
import type {
  CustomAction,
  CustomButtonAction,
  DataTableProps,
  FilterOperator,
  Header,
  TableItem
} from '@/types/componentTypes/DataTableTypes';
import type { Ref } from 'vue';

export type { ApiResponse, CustomAction, CustomButtonAction, FilterOperator, Header, TableItem } from '@/types/componentTypes/DataTableTypes';

export type AutocompleteItemsSource =
  | any[]
  | Ref<any[] | undefined>
  | ((context?: Record<string, any>) => any[] | undefined);

export type EnhancedHeader = Header & {
  autocompleteItems?: AutocompleteItemsSource;
  autocompleteItemTitle?: string;
  autocompleteItemValue?: string;
  autocompleteReturnObject?: boolean;
  autocompleteMultiple?: boolean;
};

/** V2 props — same surface as CustomDataTable; `height` required, `filters` optional */
export interface DataTableV2Props extends Omit<DataTableProps, 'routes' | 'filters'> {
  routes?: Record<string, string> | ((item: TableItem) => Record<string, string>);
  enableGroupDelete?: boolean;
  filters?: Record<string, any>;
  /** Enable infinite scroll when paginating (loads next page near bottom) */
  enableInfiniteScroll?: boolean;
  axiosInstance?: AxiosInstance;
}

export interface DataTableV2Context {
  props: DataTableV2Props;
  items: Ref<TableItem[]>;
  loading: Ref<boolean>;
  isLoadingMore: Ref<boolean>;
  getUniqueValue: (item: TableItem) => string | number;
  isSelected: (item: TableItem) => boolean;
  toggleSelection: (item: TableItem) => void;
  selectSingleItem: (item: TableItem) => void;
  radioGroupValue: Ref<string | number | null>;
  getRoutesForItem: (item: TableItem) => Record<string, string>;
  goToRoute: (key: string, item?: TableItem) => void;
  download: (key: string | number, item: TableItem) => Promise<void>;
  openDialog: (item?: TableItem) => void;
  openDeleteDialog: (item: TableItem) => void;
  openCustomActionDialog: (action: CustomAction, item: TableItem) => void;
  getColumnStyle: (column: { key?: string }, item: TableItem) => Record<string, string>;
  getNestedValue: (obj: Record<string, unknown>, path: string) => unknown;
  getTranslatedValue: (value: unknown, column: { key?: string; title?: string }, item: TableItem) => unknown;
  truncateText: (text: unknown, maxLength?: number) => string;
  shouldTruncate: (text: unknown, header: Header | null) => boolean;
  getHeaderForColumn: (columnKey: string) => Header | null;
  shouldShowCopyButton: (header: Header | null) => boolean;
  openTextPreview: (text: unknown, columnTitle: string, item: TableItem) => void;
  hasAnyActions: Ref<boolean>;
}
