<script setup lang="ts">
import { computed } from 'vue';
import UiReadonlyField from './UiReadonlyField.vue';
export interface UiObjectField { key: string; label?: string; secondaryLabel?: string; hidden?: boolean; format?: (value: unknown, data: Record<string, unknown>) => unknown }
const props = withDefaults(defineProps<{ data?: Record<string, unknown> | null; fields?: UiObjectField[]; columns?: number; emptyText?: string; hideEmpty?: boolean }>(), { columns: 3, emptyText: '—' });
const humanize=(value:string)=>value.replace(/([A-Z])/g,' $1').replace(/[_-]+/g,' ').replace(/^./,c=>c.toUpperCase());
const entries=computed(()=>{const data=props.data??{};const fields:UiObjectField[]=props.fields??Object.keys(data).map(key=>({key}));return fields.filter(field=>!field.hidden).map(field=>({ ...field,label:field.label??humanize(field.key),value:field.format?field.format(data[field.key],data):data[field.key]})).filter(field=>!props.hideEmpty||![null,undefined,''].includes(field.value as never));});
</script>
<template><div class="ui-object-details" :style="{'--ui-object-columns':columns}"><slot v-for="field in entries" :key="field.key" name="field" :field="field" :data="data"><UiReadonlyField :label="field.label" :secondary-label="field.secondaryLabel" :value="field.value" :empty-text="emptyText"/></slot><slot v-if="!entries.length" name="empty"/></div></template>
<style scoped>.ui-object-details{display:grid;grid-template-columns:repeat(var(--ui-object-columns),minmax(0,1fr));gap:12px}@media(max-width:960px){.ui-object-details{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.ui-object-details{grid-template-columns:1fr}}</style>
