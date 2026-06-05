import { ref, type Ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import type { ApiResponse, TableItem } from '@/types/componentTypes/DataTableTypes';
import { DateConverter } from '@/utils/date-convertor';
import type { ApiService } from '@/services/apiService';
import type { DataTableV2Props } from '../types';
import { isDateHeader } from '../headerFieldUtils';
import { resolveFilter } from './useDataTableFilters';

export interface UseDataTableFetchOptions {
  props: DataTableV2Props;
  api: ApiService;
  buildFilterParams: () => Record<string, unknown>;
  externalCriteria: Ref<Record<string, unknown>>;
  items: Ref<TableItem[]>;
  originalServerData: Ref<TableItem[]>;
  selectedItems: Ref<TableItem[]>;
  emitSelection: () => void;
  initialized: Ref<boolean>;
}

export function useDataTableFetch(options: UseDataTableFetchOptions) {
  const {
    props,
    api,
    buildFilterParams,
    externalCriteria,
    items,
    originalServerData,
    selectedItems,
    emitSelection,
    initialized
  } = options;

  const loading = ref(false);
  const error = ref<string | null>(null);
  const itemsPerPage = ref(props.pageSize ?? 10);
  const totalSize = ref(0);
  const totalPages = ref(0);
  const currentPage = ref(1);
  const isLoadingMore = ref(false);
  const hasMore = ref(true);

  const formatItemsDates = (serverData: TableItem[]): TableItem[] =>
    serverData.map((item) => {
      const newItem = { ...item };
      for (const header of props.headers) {
        if (isDateHeader(header) && newItem[header.key]) {
          try {
            newItem[header.key] = DateConverter.toShamsi(newItem[header.key] as string);
          } catch (e) {
            console.error(`Date convert error: ${header.key}`, e);
          }
        }
      }
      return newItem;
    });

  const buildRequestParams = (queryParams?: Record<string, unknown>) => {
    const rawFilter = buildFilterParams();
    const finalFilter = resolveFilter(rawFilter, props.filterAdapter);
    const hasExternalCriteria = externalCriteria.value && Object.keys(externalCriteria.value).length > 0;

    let params: Record<string, unknown> = {
      ...(hasExternalCriteria ? {} : finalFilter),
      ...props.queryParams,
      ...(externalCriteria.value || {})
    };

    if (queryParams) {
      params = { ...params, ...queryParams };
    }
    return params;
  };

  const fetchData = async (queryParams?: Record<string, unknown>) => {
    loading.value = true;
    error.value = null;

    try {
      const params = buildRequestParams(queryParams);
      const shouldPaginate = props.showPagination !== false;
      const requestParams = shouldPaginate
        ? { ...params, page: currentPage.value - 1, size: itemsPerPage.value }
        : params;

      const response = (await api.fetch(requestParams)) as ApiResponse<TableItem>;

      let serverRawData: TableItem[] = [];
      if (shouldPaginate) {
        serverRawData = response.data?.content ?? [];
      } else if (Array.isArray(response.data)) {
        serverRawData = response.data;
      } else if (Array.isArray(response.data?.content)) {
        serverRawData = response.data.content;
      } else if (response.data && typeof response.data === 'object') {
        serverRawData = [response.data as TableItem];
      }

      const serverData = Array.isArray(serverRawData) ? serverRawData : [];
      originalServerData.value = serverData;
      items.value = formatItemsDates(serverData);

      if (shouldPaginate && response.data?.page) {
        totalSize.value = response.data.page.totalElements;
        totalPages.value = response.data.page.totalPages;
        hasMore.value = currentPage.value < response.data.page.totalPages;
      } else {
        totalSize.value = serverData.length;
        totalPages.value = 1;
        hasMore.value = false;
      }

      if (props.defaultSelected && items.value.length && props.defaultSelected in items.value[0]) {
        const defaultSelectedItems = items.value.filter((item) => item[props.defaultSelected!] === true);
        selectedItems.value = [...defaultSelectedItems];
        emitSelection();
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number }; request?: unknown };
      if (axiosErr.response) {
        error.value = `خطای سرور: ${axiosErr.response.status}`;
      } else if (axiosErr.request) {
        error.value = 'خطای شبکه. لطفا دوباره تلاش کنید.';
      } else {
        error.value = 'یک خطای غیرمنتظره رخ داد.';
      }
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const debouncedFetchData = useDebounceFn(fetchData, 300);

  const loadMore = async () => {
    if (isLoadingMore.value || !hasMore.value || !props.enableInfiniteScroll) return;

    isLoadingMore.value = true;
    currentPage.value++;

    try {
      const params = {
        ...buildRequestParams(),
        page: currentPage.value - 1,
        size: itemsPerPage.value
      };

      const response = (await api.fetch(params)) as ApiResponse<TableItem>;
      const newItems = response.data?.content ?? [];
      items.value = [...items.value, ...formatItemsDates(newItems)];

      const pageMeta = response.data?.page;
      hasMore.value = pageMeta ? currentPage.value < pageMeta.totalPages : false;

      if (props.defaultSelected && props.selectable) {
        const newSelected = newItems.filter((item) => item[props.defaultSelected!] === true);
        if (newSelected.length > 0) {
          selectedItems.value = [...selectedItems.value, ...formatItemsDates(newSelected)];
          emitSelection();
        }
      }
    } catch (err) {
      console.error('Error loading more items:', err);
      currentPage.value--;
    } finally {
      isLoadingMore.value = false;
    }
  };

  const handleScroll = async (event: Event) => {
    if (!props.enableInfiniteScroll) return;
    const target = event.target as HTMLElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    if (scrollHeight - scrollTop - clientHeight < 100 && !isLoadingMore.value && hasMore.value) {
      await loadMore();
    }
  };

  const handlePageChange = (newPage: number) => {
    currentPage.value = newPage;
    debouncedFetchData();
  };

  return {
    loading,
    error,
    itemsPerPage,
    totalSize,
    totalPages,
    currentPage,
    isLoadingMore,
    hasMore,
    fetchData,
    debouncedFetchData,
    loadMore,
    handleScroll,
    handlePageChange
  };
}
