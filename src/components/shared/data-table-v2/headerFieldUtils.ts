import { isRef, unref, type Ref } from 'vue';
import type { Header } from '@/types/componentTypes/DataTableTypes';
import type { AutocompleteItemsSource, EnhancedHeader, TableItem } from './types';

export const getHeaderType = (header: Header): string | undefined => {
  if (header.type) return header.type.toLowerCase();
  if (header.isDate) return 'date';
  if (header.textarea) return 'textarea';
  if (header.toggleSwitch) return 'toggle';
  return undefined;
};

export const isDateHeader = (header: Header): boolean => getHeaderType(header) === 'date';
export const isMoneyHeader = (header: Header): boolean => getHeaderType(header) === 'money';
export const isTextareaHeader = (header: Header): boolean => getHeaderType(header) === 'textarea';
export const isToggleHeader = (header: Header): boolean => {
  const type = getHeaderType(header);
  return type === 'toggle' || type === 'toggleswitch';
};

export const getFieldInputType = (header: Header): string | undefined => {
  const type = getHeaderType(header);
  if (type && !['date', 'textarea', 'money', 'toggle', 'toggleswitch', 'autocomplete'].includes(type)) {
    return type;
  }
  return undefined;
};

export const resolveHeaderKey = (header: Header): string => header.key;
export const resolveHeaderTitle = (header: Header): string => header.title;
export const isHeaderDisabled = (header: Header): boolean => header.editable === false;

export const hasAutocomplete = (header: Header): header is EnhancedHeader =>
  Boolean((header as EnhancedHeader).autocompleteItems);

export const resolveAutocompleteItemTitle = (header: Header): string =>
  (header as EnhancedHeader).autocompleteItemTitle ?? 'title';

export const resolveAutocompleteItemValue = (header: Header): string =>
  (header as EnhancedHeader).autocompleteItemValue ?? 'value';

export const resolveAutocompleteReturnObject = (header: Header): boolean =>
  (header as EnhancedHeader).autocompleteReturnObject !== false;

export const resolveAutocompleteMultiple = (header: Header): boolean =>
  (header as EnhancedHeader).autocompleteMultiple === true;

export const resolveAutocompleteItems = (
  header: Header,
  context: Record<string, any> | undefined,
  formModel: Record<string, any>
): any[] => {
  const enhancedHeader = header as EnhancedHeader;
  const source = enhancedHeader.autocompleteItems;
  if (!source) return [];

  try {
    if (typeof source === 'function') {
      return source(context ?? formModel) ?? [];
    }
    if (isRef(source)) {
      return source.value ?? [];
    }
    const resolved = unref(source as AutocompleteItemsSource);
    return Array.isArray(resolved) ? resolved : [];
  } catch (error) {
    console.error('Error resolving autocomplete items for header:', header.key, error);
    return [];
  }
};

export const resolveHeaderDefaultValue = (header: Header, context: Record<string, any>): unknown => {
  const { defaultValue } = header;
  if (defaultValue === undefined) return undefined;
  if (typeof defaultValue === 'function') {
    return (defaultValue as (ctx: Record<string, any>) => unknown)(context);
  }
  return defaultValue;
};

export const getNestedValue = (obj: Record<string, unknown>, path: string): unknown =>
  path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in (current as object)) {
      return (current as Record<string, unknown>)[key];
    }
    return null;
  }, obj);

export const getUniqueValueFromItem = (
  item: TableItem,
  uniqueKey: string | ((item: TableItem) => string | number) | undefined
): string | number => {
  if (typeof uniqueKey === 'function') return uniqueKey(item);
  if (typeof uniqueKey === 'string') {
    return String(uniqueKey)
      .split('.')
      .reduce<unknown>((obj, key) => (obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[key] : undefined), item) as
      | string
      | number;
  }
  return (item.id as string | number) ?? '';
};
