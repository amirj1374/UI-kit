import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import {
  getHeaderType,
  isDateHeader,
  isMoneyHeader,
  isTextareaHeader,
  isToggleHeader,
  getFieldInputType,
  getNestedValue,
  getUniqueValueFromItem,
  resolveAutocompleteItemTitle,
  resolveAutocompleteItemValue,
  resolveAutocompleteReturnObject,
  resolveAutocompleteMultiple,
  resolveAutocompleteItems,
  resolveHeaderDefaultValue
} from './headerFieldUtils';
import type { Header } from '@/types/componentTypes/DataTableTypes';

const h = (o: Partial<Header>): Header => o as Header;

describe('getHeaderType & type guards', () => {
  it('lowercases explicit type', () => {
    expect(getHeaderType(h({ type: 'Money' as any }))).toBe('money');
  });

  it('derives type from boolean flags', () => {
    expect(getHeaderType(h({ isDate: true }))).toBe('date');
    expect(getHeaderType(h({ textarea: true }))).toBe('textarea');
    expect(getHeaderType(h({ toggleSwitch: true }))).toBe('toggle');
    expect(getHeaderType(h({}))).toBeUndefined();
  });

  it('exposes type guards', () => {
    expect(isDateHeader(h({ isDate: true }))).toBe(true);
    expect(isMoneyHeader(h({ type: 'money' as any }))).toBe(true);
    expect(isTextareaHeader(h({ textarea: true }))).toBe(true);
    expect(isToggleHeader(h({ toggleSwitch: true }))).toBe(true);
    expect(isToggleHeader(h({ type: 'toggleswitch' as any }))).toBe(true);
  });

  it('returns a plain input type only for non-special types', () => {
    expect(getFieldInputType(h({ type: 'number' as any }))).toBe('number');
    expect(getFieldInputType(h({ type: 'date' as any }))).toBeUndefined();
    expect(getFieldInputType(h({}))).toBeUndefined();
  });
});

describe('getNestedValue', () => {
  it('reads a nested path', () => {
    expect(getNestedValue({ a: { b: { c: 5 } } }, 'a.b.c')).toBe(5);
  });

  it('returns null for a missing path', () => {
    expect(getNestedValue({ a: {} }, 'a.b.c')).toBeNull();
    expect(getNestedValue({}, 'x')).toBeNull();
  });
});

describe('getUniqueValueFromItem', () => {
  it('uses a function key', () => {
    expect(getUniqueValueFromItem({ id: 1 } as any, (i: any) => `k-${i.id}`)).toBe('k-1');
  });

  it('uses a string path', () => {
    expect(getUniqueValueFromItem({ meta: { code: 'X' } } as any, 'meta.code')).toBe('X');
  });

  it('falls back to id when no key given', () => {
    expect(getUniqueValueFromItem({ id: 42 } as any, undefined)).toBe(42);
  });
});

describe('autocomplete resolvers', () => {
  it('return sensible defaults', () => {
    expect(resolveAutocompleteItemTitle(h({}))).toBe('title');
    expect(resolveAutocompleteItemValue(h({}))).toBe('value');
    expect(resolveAutocompleteReturnObject(h({}))).toBe(true);
    expect(resolveAutocompleteMultiple(h({}))).toBe(false);
  });

  it('honor explicit overrides', () => {
    expect(resolveAutocompleteReturnObject(h({ autocompleteReturnObject: false } as any))).toBe(false);
    expect(resolveAutocompleteMultiple(h({ autocompleteMultiple: true } as any))).toBe(true);
  });

  it('resolveAutocompleteItems handles arrays, refs and functions', () => {
    expect(resolveAutocompleteItems(h({ autocompleteItems: [1, 2] } as any), undefined, {})).toEqual([1, 2]);
    expect(resolveAutocompleteItems(h({ autocompleteItems: ref([3, 4]) } as any), undefined, {})).toEqual([3, 4]);
    expect(
      resolveAutocompleteItems(h({ autocompleteItems: (() => [5, 6]) as any } as any), undefined, {})
    ).toEqual([5, 6]);
  });

  it('resolveAutocompleteItems returns [] when no source', () => {
    expect(resolveAutocompleteItems(h({}), undefined, {})).toEqual([]);
  });
});

describe('resolveHeaderDefaultValue', () => {
  it('returns undefined when no default', () => {
    expect(resolveHeaderDefaultValue(h({}), {})).toBeUndefined();
  });

  it('returns a static default', () => {
    expect(resolveHeaderDefaultValue(h({ defaultValue: 7 } as any), {})).toBe(7);
  });

  it('invokes a function default with context', () => {
    expect(resolveHeaderDefaultValue(h({ defaultValue: ((ctx: any) => ctx.x) as any } as any), { x: 9 })).toBe(9);
  });
});
