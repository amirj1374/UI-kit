<script setup lang="ts">
withDefaults(defineProps<{ title: string; description?: string; icon?: string; actionText?: string }>(), { icon: '$info' });
const emit = defineEmits<{ action: [] }>();
</script>
<template><section class="app-empty-state"><div class="app-empty-state__icon"><v-icon :icon="icon" size="42" /></div><h3>{{ title }}</h3><p v-if="description">{{ description }}</p><slot><v-btn v-if="actionText" color="primary" @click="emit('action')">{{ actionText }}</v-btn></slot></section></template>
<style scoped>.app-empty-state{min-height:230px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:32px;color:rgb(var(--v-theme-lightText))}.app-empty-state__icon{display:grid;place-items:center;width:82px;height:82px;margin-bottom:16px;border-radius:50%;background:rgb(var(--v-theme-lightprimary));color:rgb(var(--v-theme-primary))}.app-empty-state h3{margin:0;color:rgb(var(--v-theme-on-surface));font-size:1.1rem}.app-empty-state p{max-width:380px;margin:8px 0 18px}</style>
