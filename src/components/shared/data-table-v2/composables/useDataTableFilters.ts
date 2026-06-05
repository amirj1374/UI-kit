import { computed, ref } from 'vue';
import type { FilterOperator, Header } from '@/types/componentTypes/DataTableTypes';
import { defaultFilterAdapter } from '@/utils/defaultFilterAdapter';
import type { DataTableV2Props } from '../types';
import { resolveHeaderKey } from '../headerFieldUtils';

const FILTER_OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: 'برابر با',
  notEquals: 'مخالف با',
  contains: 'شامل',
  doesNotContain: 'شامل نباشد',
  in: 'یکی از',
  specified: 'خالی / غیر خالی',
  greaterThan: 'بزرگتر از',
  lessThan: 'کوچکتر از',
  greaterThanOrEqual: 'بزرگتر یا مساوی',
  lessThanOrEqual: 'کوچکتر یا مساوی'
};

export function useDataTableFilters(props: DataTableV2Props) {
  const filterDialog = ref(false);
  const filterModel = ref<Record<string, any>>({});
  const filterOperatorModel = ref<Record<string, FilterOperator>>({});

  const cleanFilterModel = computed(() => {
    const model = { ...filterModel.value };
    for (const key of Object.keys(model)) {
      if (model[key] === null || model[key] === undefined || model[key] === '') {
        delete model[key];
      }
    }
    return model;
  });

  const hasActiveInlineFilters = computed(() => Object.keys(cleanFilterModel.value).length > 0);

  const getHeaderFilterOperators = (header: Header) => {
    const configured = header.filterOperators;
    const effective: FilterOperator[] =
      configured && configured.length > 0 ? configured : (['equals', 'contains', 'in'] as FilterOperator[]);
    return effective.map((op) => ({
      value: op,
      label: FILTER_OPERATOR_LABELS[op] || op
    }));
  };

  const getDefaultFilterOperator = (header: Header): FilterOperator => header.defaultFilterOperator || 'equals';

  const hasFilterOperators = (header: Header): boolean =>
    Array.isArray(header.filterOperators) && header.filterOperators.length > 0;

  const buildFilterParams = (): Record<string, unknown> => {
    if (props.filterComponent) return cleanFilterModel.value;

    const base: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(cleanFilterModel.value)) {
      const header = props.headers.find((h) => h.key === key);
      if (header && hasFilterOperators(header)) {
        const op = filterOperatorModel.value[key] || getDefaultFilterOperator(header);
        const paramKey = `${key}.${op}`;
        if (op === 'in' && Array.isArray(value)) {
          base[paramKey] = value.join(',');
        } else if (op === 'specified') {
          base[paramKey] = Boolean(value);
        } else {
          base[paramKey] = value;
        }
      } else {
        base[key] = value;
      }
    }
    return base;
  };

  const getFilters = (): Record<string, any> => ({ ...cleanFilterModel.value });

  const initFilterOperatorsOnOpen = (formHeaders: Header[]) => {
    for (const header of formHeaders) {
      if (!hasFilterOperators(header)) continue;
      const key = resolveHeaderKey(header);
      if (!filterOperatorModel.value[key]) {
        filterOperatorModel.value[key] = getDefaultFilterOperator(header);
      }
    }
  };

  return {
    filterDialog,
    filterModel,
    filterOperatorModel,
    cleanFilterModel,
    hasActiveInlineFilters,
    getHeaderFilterOperators,
    getDefaultFilterOperator,
    hasFilterOperators,
    buildFilterParams,
    getFilters,
    initFilterOperatorsOnOpen
  };
}

export function resolveFilter(
  raw: Record<string, any>,
  filterAdapter: DataTableV2Props['filterAdapter']
): Record<string, any> {
  return filterAdapter ? filterAdapter(raw) : defaultFilterAdapter(raw);
}
