import type { InjectionKey } from 'vue';
import type { DataTableV2Context } from './types';

export const dataTableV2Key: InjectionKey<DataTableV2Context> = Symbol('DataTableV2');
