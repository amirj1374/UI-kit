import type { UiIconSource } from './icons';
export type UiComponentSize = 'x-small' | 'small' | 'default' | 'large' | 'x-large';
export type UiDensity = 'default' | 'comfortable' | 'compact';
export interface UiActionDefinition<T = unknown> { id: string; label: string; icon?: UiIconSource; disabled?: boolean; handler?: (item: T) => void }
/** @deprecated Prefer the table-specific pagination contract for DataTable features. */
export interface UiPaginationState { page: number; itemsPerPage: number; total?: number }
export interface UiSortState { key: string; order: 'asc' | 'desc' }
export interface UiFilterState { [key: string]: unknown }
