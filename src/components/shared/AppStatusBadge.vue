<script setup lang="ts">
withDefaults(defineProps<{ label: string; color?: string; icon?: string; dot?: boolean }>(), { color: 'primary', dot: true });
</script>
<template><span class="app-status-badge" :style="{ '--status-color': `rgb(var(--v-theme-${color}))` }"><v-icon v-if="icon" :icon="icon" size="15" /><i v-else-if="dot" />{{ label }}</span></template>
<style scoped>.app-status-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:999px;background:color-mix(in srgb,var(--status-color) 13%,transparent);color:var(--status-color);font-size:.78rem;font-weight:700;white-space:nowrap}.app-status-badge i{width:7px;height:7px;border-radius:50%;background:currentColor}</style>
