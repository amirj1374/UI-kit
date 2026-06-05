import { ref } from 'vue';
import { formatNumberWithCommas } from '@/utils/number-formatter';
import type { Header, TableItem } from '@/types/componentTypes/DataTableTypes';
import type { DataTableV2Props } from '../types';

export function useDataTableCellDisplay(props: DataTableV2Props, notify: (message: string) => void) {
  const textPreviewDialog = ref(false);
  const previewText = ref('');
  const previewTitle = ref('');
  const previewItem = ref<TableItem | null>(null);

  const translateValue = (value: string) => {
    const translations: Record<string, string> = {
      ACTIVE: 'فعال',
      INACTIVE: 'غیرفعال',
      PENDING: 'در انتظار',
      COMPLETED: 'تکمیل شده'
    };
    return translations[value] || value;
  };

  const getTranslatedValue = (value: unknown, column: { key?: string }, item: TableItem) => {
    const header = props.headers.find((h) => h.key === column.key);
    if (!header) return value;
    if (header.customRenderer) return header.customRenderer(item);
    if (header.formatter) return header.formatter(value, item);
    if (String(header.type).toLowerCase() === 'money') {
      try {
        return formatNumberWithCommas((value as string | number) ?? 0, 0);
      } catch {
        return value;
      }
    }
    if (header.translate) {
      if (header.options) {
        const option = header.options.find((opt) => opt.value === value);
        return option?.title ?? value;
      }
      return translateValue(String(value));
    }
    return value;
  };

  const truncateText = (text: unknown, maxLength: number = props.maxTextLength ?? 50): string => {
    if (text === null || text === undefined) return '';
    const textStr = String(text);
    return textStr.length <= maxLength ? textStr : `${textStr.substring(0, maxLength)}...`;
  };

  const shouldTruncate = (text: unknown, header: Header | null): boolean => {
    if (text === null || text === undefined || !header) return false;
    if (header.truncate === false) return false;
    if (props.enableTextTruncation && (header.truncate === true || header.truncate === undefined)) {
      return String(text).length > (props.maxTextLength ?? 50);
    }
    if (header.truncate === true) return String(text).length > (props.maxTextLength ?? 50);
    return false;
  };

  const getHeaderForColumn = (columnKey: string): Header | null =>
    props.headers.find((h) => h.key === columnKey) ?? null;

  const shouldShowCopyButton = (header: Header | null) => header?.showCopyButton === true;

  const openTextPreview = (text: unknown, columnTitle: string, item: TableItem) => {
    previewText.value = text === null || text === undefined ? '' : String(text);
    previewTitle.value = columnTitle;
    previewItem.value = item;
    textPreviewDialog.value = true;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify('✅ متن با موفقیت کپی شد!');
    } catch {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        notify('✅ متن با موفقیت کپی شد!');
      } catch {
        notify('❌ خطا در کپی کردن متن!');
      }
    }
  };

  const copyCompleteRecord = async () => {
    if (!previewItem.value) return;
    await copyToClipboard(JSON.stringify(previewItem.value, null, 2));
  };

  const getColumnStyle = (column: { key?: string }, item: TableItem) => {
    const header = props.headers.find((h) => h.key === column.key);
    if (!header) return {};
    const baseStyle = header.style || {};
    if (header.conditionalStyle) {
      return { ...baseStyle, ...header.conditionalStyle(item[column.key!], item) };
    }
    return baseStyle;
  };

  return {
    textPreviewDialog,
    previewText,
    previewTitle,
    previewItem,
    getTranslatedValue,
    truncateText,
    shouldTruncate,
    getHeaderForColumn,
    shouldShowCopyButton,
    openTextPreview,
    copyToClipboard,
    copyCompleteRecord,
    getColumnStyle
  };
}
