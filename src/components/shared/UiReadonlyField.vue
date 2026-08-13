<script setup lang="ts">
import { computed } from 'vue';
import { useUiKit } from '../../platform/uiKit';
const props = withDefaults(defineProps<{ label: string; secondaryLabel?: string; value?: unknown; emptyText?: string; copyable?: boolean; direction?: 'rtl'|'ltr'|'auto' }>(), { emptyText: '—', direction: 'auto' });
const ui = useUiKit();
const text = computed(() => props.value === null || props.value === undefined || props.value === '' ? props.emptyText : typeof props.value === 'boolean' ? (props.value ? ui.t('yes') : ui.t('no')) : String(props.value));
async function copy() { await navigator.clipboard?.writeText(text.value); }
</script>
<template><div class="ui-readonly-field"><div class="ui-readonly-field__label">{{ label }}<small v-if="secondaryLabel">{{ secondaryLabel }}</small></div><div class="ui-readonly-field__value" :dir="direction"><slot :value="value" :text="text">{{ text }}</slot><v-btn v-if="copyable && text !== emptyText" icon="$copy" size="x-small" variant="text" :aria-label="`${ui.t('copy')} ${label}`" @click="copy"/></div></div></template>
<style scoped>.ui-readonly-field{min-width:0;padding:12px 14px;border:1px solid rgba(var(--v-border-color),var(--v-border-opacity));border-radius:var(--app-text-field-radius,10px);background:rgb(var(--v-theme-surface))}.ui-readonly-field__label{display:flex;flex-direction:column;color:rgb(var(--v-theme-lightText));font-size:.78rem}.ui-readonly-field__label small{direction:ltr;text-align:start;opacity:.78}.ui-readonly-field__value{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:5px;color:rgb(var(--v-theme-on-surface));font-weight:650;overflow-wrap:anywhere}</style>
