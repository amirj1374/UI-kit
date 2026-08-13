<script setup lang="ts">
export interface UiAction { key: string; label: string; color?: string; variant?: 'flat'|'text'|'outlined'|'tonal'|'plain'|'elevated'; icon?: string; disabled?: boolean; hidden?: boolean; confirm?: boolean }
withDefaults(defineProps<{ actions: UiAction[]; title?: string; loading?: string|null; sticky?: boolean }>(), { loading: null });
const emit=defineEmits<{ action:[action:UiAction] }>();
</script>
<template><v-card class="ui-action-bar" :class="{'ui-action-bar--sticky':sticky}" elevation="1"><v-card-text class="ui-action-bar__content"><strong v-if="title">{{title}}</strong><slot name="prepend"/><v-spacer/><template v-for="action in actions" :key="action.key"><v-btn v-if="!action.hidden" :color="action.color" :variant="action.variant??'text'" :prepend-icon="action.icon" :disabled="action.disabled" :loading="loading===action.key" @click="emit('action',action)">{{action.label}}</v-btn></template><slot/></v-card-text></v-card></template>
<style scoped>.ui-action-bar__content{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.ui-action-bar--sticky{position:sticky;top:70px;z-index:4}@media(max-width:600px){.ui-action-bar__content :deep(.v-btn){flex:1 1 auto}}</style>
