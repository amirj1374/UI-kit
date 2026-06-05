import { computed, type ComputedRef } from 'vue';
import type { Header } from '@/types/componentTypes/DataTableTypes';
import type { DataTableV2Props } from '../types';
import { computeActionColumnWidth } from '../computeActionColumnWidth';

const selectionHeader = { title: '', key: 'selection', sortable: false, width: 50 } as const;

const estimateColumnWidth = (header: Header): number => {
  const title = header.title || '';
  const basePadding = 32;
  const charWidth = 9;
  return Math.min(Math.max(title.length * charWidth + basePadding, 80), 400);
};

export function useDataTableHeaders(props: DataTableV2Props, hasAnyActions: ComputedRef<boolean>) {
  const autoHeaders = computed(() =>
    props.headers.map((h) => ({
      ...h,
      width: h.width ?? estimateColumnWidth(h)
    }))
  );

  const buildHeadersWithActions = (includeSelection: boolean) => {
    const base = [...(includeSelection && props.selectable ? [selectionHeader] : []), ...autoHeaders.value];
    if (!hasAnyActions.value) return base;
    const actionWidth = computeActionColumnWidth(props);
    return [...base, { title: 'عملیات', key: 'actions', sortable: false, width: actionWidth }];
  };

  const groupedHeaders = computed(() => buildHeadersWithActions(Boolean(props.selectable)));
  const normalHeaders = computed(() => buildHeadersWithActions(Boolean(props.selectable)));

  const formHeaders = computed(() => props.headers.filter((h) => !h.excludeFromForm));

  return {
    autoHeaders,
    groupedHeaders,
    normalHeaders,
    formHeaders,
    selectionHeader
  };
}

export function useHasAnyActions(props: DataTableV2Props) {
  return computed(() => {
    if (props.bulkMode) return false;
    const hasCrudActions = Array.isArray(props.actions) && props.actions.length > 0;
    const hasRoutes =
      !!props.routes && (typeof props.routes === 'function' || Object.keys(props.routes).length > 0);
    const hasDownloadLinks = !!props.downloadLink && Object.keys(props.downloadLink).length > 0;
    const hasCustomActions = Array.isArray(props.customActions) && props.customActions.length > 0;
    const hasCustomButtons =
      (Array.isArray(props.customButtons) && props.customButtons.length > 0) || !!props.customButtonsFn;
    return hasCrudActions || hasRoutes || hasDownloadLinks || hasCustomActions || hasCustomButtons;
  });
}
