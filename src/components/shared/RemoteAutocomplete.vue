<script setup lang="ts">
import { ref, watch } from 'vue';

export interface RemoteAutocompleteResult<T = Record<string, unknown>> { items: T[]; total?: number }
export type RemoteAutocompleteLoader<T = Record<string, unknown>> = (context: { search: string; page: number; pageSize: number }) => Promise<T[] | RemoteAutocompleteResult<T>>;

const props = withDefaults(defineProps<{
  loader: RemoteAutocompleteLoader<any>;
  label?: string;
  itemTitle?: any;
  itemValue?: any;
  multiple?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  pageSize?: number;
  debounce?: number;
  loadOnFocus?: boolean;
  cache?: boolean;
  noDataText?: string;
  errorText?: string;
}>(), { itemTitle: 'title', itemValue: 'value', pageSize: 20, debounce: 300, loadOnFocus: true, cache: true, clearable: true, noDataText: 'موردی یافت نشد', errorText: 'دریافت اطلاعات ناموفق بود' });

const model = defineModel<any>();
const items = ref<any[]>([]);
const loading = ref(false);
const error = ref(false);
const search = ref('');
const loaded = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
let requestId = 0;

async function load(force = false) {
  if (props.cache && loaded.value && !force && !search.value) return;
  const currentRequest = ++requestId;
  loading.value = true;
  error.value = false;
  try {
    const result = await props.loader({ search: search.value, page: 1, pageSize: props.pageSize });
    if (currentRequest !== requestId) return;
    items.value = Array.isArray(result) ? result : result.items;
    loaded.value = !search.value;
  } catch {
    if (currentRequest === requestId) { items.value = []; error.value = true; }
  } finally {
    if (currentRequest === requestId) loading.value = false;
  }
}

function onFocus(focused: boolean) { if (focused && props.loadOnFocus) void load(); }
watch(search, () => { clearTimeout(timer); timer = setTimeout(() => void load(true), props.debounce); });
defineExpose({ reload: () => load(true) });
</script>

<template>
  <v-autocomplete v-model="model" v-model:search="search" :items="items" :label="label" :item-title="itemTitle" :item-value="itemValue" :multiple="multiple" :clearable="clearable" :disabled="disabled" :loading="loading" :no-data-text="error ? errorText : noDataText" @update:focused="onFocus">
    <template v-for="(_, name) in $slots" #[name]="slotData"><slot :name="name" v-bind="slotData || {}" /></template>
  </v-autocomplete>
</template>
