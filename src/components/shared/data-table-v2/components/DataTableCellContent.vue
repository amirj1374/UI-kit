<script setup lang="ts">
import { IconCopy } from '@tabler/icons-vue';
import { inject } from 'vue';
import { dataTableV2Key } from '../context';
import { getNestedValue } from '../headerFieldUtils';

const props = defineProps<{
  item: Record<string, unknown>;
  column: { key?: string; title?: string };
}>();

const ctx = inject(dataTableV2Key);
if (!ctx) throw new Error('DataTableCellContent must be used inside CustomDataTableV2');

const displayValue = () => {
  const raw = getNestedValue(props.item, props.column.key || '');
  return ctx.getTranslatedValue(raw, props.column, props.item);
};

const header = () => ctx.getHeaderForColumn(props.column.key || '');
const columnTitle = () => String(props.column.title || props.column.key || '');
</script>

<template>
  <div class="d-flex align-center" style="gap: 4px">
    <span
      v-if="ctx.shouldTruncate(displayValue(), header())"
      class="truncated-text"
      :style="{ cursor: 'pointer', color: 'rgb(var(--v-theme-primary))', textDecoration: 'underline' }"
      @click.stop="ctx.openTextPreview(displayValue(), columnTitle(), item)"
    >
      {{ ctx.truncateText(displayValue()) }}
    </span>
    <span
      v-else
      @click.stop="ctx.shouldShowCopyButton(header()) && ctx.openTextPreview(displayValue(), columnTitle(), item)"
      :style="{ cursor: ctx.shouldShowCopyButton(header()) ? 'pointer' : 'default' }"
    >
      {{ displayValue() }}
    </span>
    <v-btn
      v-if="ctx.shouldShowCopyButton(header())"
      icon
      size="x-small"
      variant="text"
      color="primary"
      @click.stop="ctx.openTextPreview(displayValue(), columnTitle(), item)"
      style="min-width: 24px; width: 24px; height: 24px"
    >
      <IconCopy :size="16" />
    </v-btn>
  </div>
</template>
