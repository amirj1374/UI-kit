import { ref, computed, watch } from 'vue';
import getAxiosInstance from '@/services/axiosInstance';
import { useDebounceFn } from '@vueuse/core';
import type { Ref } from 'vue';

export interface DataTableOptions {
  apiResource: string;
  queryParams?: Record<string, any>;
  pageSize?: number;
  autoFetch?: boolean;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export function useDataTable<T = any>(options: DataTableOptions) {
  const items = ref<T[]>([]) as Ref<T[]>;
  const loading = ref(false);
  const error = ref<string | null>(null);
  const hasMore = ref(true);
  const isLoadingMore = ref(false);

  const pagination = ref<PaginationState>({
    currentPage: 1,
    itemsPerPage: options.pageSize || 10,
    totalItems: 0,
    totalPages: 1
  });

  const fetchData = async (params: Record<string, any> = {}) => {
    if (loading.value) return;

    loading.value = true;
    error.value = null;

    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(options.apiResource, {
        params: {
          page: pagination.value.currentPage,
          per_page: pagination.value.itemsPerPage,
          ...options.queryParams,
          ...params
        }
      });

      const { data, meta } = response.data;

      if (meta) {
        items.value = data;
        pagination.value = {
          currentPage: meta.current_page || 1,
          itemsPerPage: meta.per_page || options.pageSize || 10,
          totalItems: meta.total || 0,
          totalPages: meta.last_page || 1
        };
        hasMore.value = meta.current_page < meta.last_page;
      } else {
        items.value = data;
        hasMore.value = false;
      }

      return data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch data';
      console.error('Error fetching data:', err);
      throw err;
    } finally {
      loading.value = false;
      isLoadingMore.value = false;
    }
  };

  const debouncedFetchData = useDebounceFn(fetchData, 300);

  const loadMore = async () => {
    if (loading.value || !hasMore.value) return;

    isLoadingMore.value = true;
    pagination.value.currentPage += 1;

    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(options.apiResource, {
        params: {
          page: pagination.value.currentPage,
          per_page: pagination.value.itemsPerPage,
          ...options.queryParams
        }
      });

      const { data, meta } = response.data;

      if (meta) {
        items.value = [...items.value, ...data];
        hasMore.value = meta.current_page < meta.last_page;
      } else {
        items.value = [...items.value, ...data];
        hasMore.value = false;
      }
    } catch (err) {
      console.error('Error loading more data:', err);
      pagination.value.currentPage -= 1;
      throw err;
    } finally {
      isLoadingMore.value = false;
    }
  };

  const setPage = (page: number) => {
    if (page < 1 || page > pagination.value.totalPages) return;
    pagination.value.currentPage = page;
    fetchData();
  };

  const setItemsPerPage = (size: number) => {
    pagination.value.itemsPerPage = size;
    pagination.value.currentPage = 1;
    fetchData();
  };

  // Watch for changes in query params
  watch(
    () => options.queryParams,
    (newParams) => {
      if (options.autoFetch !== false) {
        debouncedFetchData(newParams);
      }
    },
    { deep: true }
  );

  // Initial fetch
  if (options.autoFetch !== false) {
    fetchData();
  }

  return {
    items,
    loading,
    error,
    hasMore,
    isLoadingMore,
    pagination,
    fetchData,
    loadMore,
    setPage,
    setItemsPerPage
  };
}
