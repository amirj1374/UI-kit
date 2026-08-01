<script setup lang="ts">
import type { UiAsyncStatus } from '../../platform/types';
import UiLoadingState from './UiLoadingState.vue';
import UiEmptyState from './UiEmptyState.vue';
import UiErrorState from './UiErrorState.vue';
import UiPermissionDenied from './UiPermissionDenied.vue';
defineProps<{ status: UiAsyncStatus }>();
const emit = defineEmits<{ retry: [] }>();
</script>
<template>
  <slot v-if="status === 'loading'" name="loading"><UiLoadingState /></slot>
  <slot v-else-if="status === 'empty'" name="empty"><UiEmptyState /></slot>
  <slot v-else-if="status === 'error'" name="error" :retry="() => emit('retry')"><UiErrorState @retry="emit('retry')" /></slot>
  <slot v-else-if="status === 'permission-denied'" name="permission-denied"><UiPermissionDenied /></slot>
  <slot v-else :status="status" />
</template>
