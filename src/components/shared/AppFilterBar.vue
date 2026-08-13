<script setup lang="ts">
import { computed } from 'vue';
import { useUiKit } from '../../platform/uiKit';
withDefaults(defineProps<{ title?: string; modelValue?: boolean; showToggle?: boolean }>(), { modelValue: true, showToggle: true });
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; reset: []; submit: [] }>();
const ui = useUiKit();
const resolvedTitle = computed(() => ui.t('filters'));
</script>

<template>
  <section class="app-filter-bar">
    <div class="app-filter-bar__head"><div class="app-filter-bar__title"><slot name="title">{{ title || resolvedTitle }}</slot></div><div class="app-filter-bar__head-actions"><slot name="head-actions" /><v-btn v-if="showToggle" icon="$expand" variant="text" size="small" @click="emit('update:modelValue', !modelValue)" /></div></div>
    <v-expand-transition><div v-show="modelValue" class="app-filter-bar__body"><div class="app-filter-bar__fields"><slot /></div><div class="app-filter-bar__actions"><slot name="actions"><v-btn variant="text" @click="emit('reset')">{{ ui.t('resetFilters') }}</v-btn><v-btn color="primary" @click="emit('submit')">{{ ui.t('applyFilters') }}</v-btn></slot></div></div></v-expand-transition>
  </section>
</template>

<style scoped>
.app-filter-bar{border-radius:var(--app-text-field-radius,12px);background:rgb(var(--v-theme-surface));overflow:hidden}.app-filter-bar__head{min-height:58px;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(var(--v-theme-borderLight),.6)}.app-filter-bar__title{font-weight:800}.app-filter-bar__head-actions,.app-filter-bar__actions{display:flex;gap:8px;align-items:center}.app-filter-bar__body{padding:20px}.app-filter-bar__fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px}.app-filter-bar__actions{padding-top:20px;justify-content:flex-start}@media(max-width:600px){.app-filter-bar__body{padding:16px}}
</style>
