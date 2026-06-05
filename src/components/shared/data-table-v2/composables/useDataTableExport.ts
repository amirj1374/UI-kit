import * as XLSX from 'xlsx';
import { ref, type Ref } from 'vue';
import { DateConverter } from '@/utils/date-convertor';
import type { ApiService } from '@/services/apiService';
import type { Header, TableItem } from '@/types/componentTypes/DataTableTypes';
import type { DataTableV2Props } from '../types';
import { isDateHeader } from '../headerFieldUtils';
import { resolveFilter } from './useDataTableFilters';

const base64ToBlob = (base64: string, mimeType: string) => {
  const cleanedBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
  const byteCharacters = atob(cleanedBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
};

export function useDataTableExport(
  props: DataTableV2Props,
  api: ApiService,
  items: Ref<TableItem[]>,
  buildFilterParams: () => Record<string, unknown>,
  externalCriteria: Ref<Record<string, unknown>>,
  currentPage: Ref<number>,
  itemsPerPage: Ref<number>
) {
  const exportLoading = ref(false);

  const handleExportClientSide = () => {
    const sourceItems: TableItem[] = (props.items?.length ? props.items : items.value) ?? [];
    if (sourceItems.length === 0) {
      console.warn('داده‌ای برای خروجی اکسل وجود ندارد.');
      return;
    }

    const validHeaders = props.headers.filter((h: Header) => !!h.key && !!h.title);
    const excelData = sourceItems.map((item) => {
      const row: Record<string, unknown> = {};
      for (const header of validHeaders) {
        let value = header.nestedKey
          ? (item[header.key] as Record<string, unknown>)?.[header.nestedKey]
          : item[header.key];
        if (header.formatter) {
          value = header.formatter(value, item);
        } else if (isDateHeader(header) && value) {
          try {
            value = DateConverter.toShamsi(value as string);
          } catch {
            /* keep value */
          }
        } else if (typeof value === 'boolean') {
          value = value ? 'بله' : 'خیر';
        }
        row[header.title] = value ?? '';
      }
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet['!cols'] = validHeaders.map((h) => ({
      wch: h.width ? Math.max(10, Math.round(h.width / 7)) : 20
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Export');
    const safeName = (props.exportFileName || 'export-data').trim();
    const fileName = safeName.toLowerCase().endsWith('.xlsx') ? safeName : `${safeName}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleExportServer = async () => {
    const rawFilter = buildFilterParams();
    const finalFilter = resolveFilter(rawFilter, props.filterAdapter);
    const hasExternalCriteria = externalCriteria.value && Object.keys(externalCriteria.value).length > 0;

    let params: Record<string, unknown> = {
      ...(hasExternalCriteria ? {} : finalFilter),
      ...props.queryParams,
      ...(externalCriteria.value || {})
    };

    if (props.showPagination !== false) {
      params = { ...params, page: currentPage.value - 1, size: itemsPerPage.value };
    }

    const response = await api.exportExcel(params, props.exportUrl);
    const base64Data =
      typeof response.data === 'string'
        ? response.data
        : response.data?.data || response.data?.file || response.data?.content || '';

    if (!base64Data || typeof base64Data !== 'string') {
      throw new Error('Export response is not a valid base64 string.');
    }

    const blob = base64ToBlob(base64Data, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = props.exportFileName || 'export.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const onExportClick = async () => {
    exportLoading.value = true;
    try {
      if (props.exportUrl) {
        await handleExportServer();
      } else {
        handleExportClientSide();
      }
    } catch (err) {
      console.error('Export Error:', err);
    } finally {
      exportLoading.value = false;
    }
  };

  return { exportLoading, onExportClick };
}
