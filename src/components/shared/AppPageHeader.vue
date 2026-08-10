<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; backTo?: string }>();
const emit = defineEmits<{ back: [] }>();
</script>

<template>
  <header class="app-page-header">
    <div class="app-page-header__main">
      <v-btn v-if="backTo || $slots.back" icon="$prev" variant="text" density="comfortable" @click="emit('back')"><slot name="back" /></v-btn>
      <div><h1>{{ title }}</h1><p v-if="subtitle">{{ subtitle }}</p><slot name="breadcrumb" /></div>
    </div>
    <div v-if="$slots.actions" class="app-page-header__actions"><slot name="actions" /></div>
  </header>
</template>

<style scoped>
.app-page-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;border-radius:var(--app-text-field-radius,12px);background:rgb(var(--v-theme-surface));}.app-page-header__main,.app-page-header__actions{display:flex;align-items:center;gap:12px}.app-page-header h1{margin:0;color:rgb(var(--v-theme-on-surface));font-size:1.35rem;font-weight:800}.app-page-header p{margin:4px 0 0;color:rgb(var(--v-theme-lightText));font-size:.9rem}@media(max-width:600px){.app-page-header{align-items:flex-start;flex-direction:column;padding:16px}.app-page-header__actions{width:100%;justify-content:flex-start}}
</style>
