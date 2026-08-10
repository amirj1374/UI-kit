<script setup lang="ts">
export interface PreviewFile { id: string | number; name: string; size?: string; type?: string; url?: string }
defineProps<{ files: PreviewFile[]; removable?: boolean; downloadable?: boolean }>();
const emit = defineEmits<{ remove: [file: PreviewFile]; download: [file: PreviewFile] }>();
</script>
<template><v-list class="app-file-preview" lines="two"><v-list-item v-for="file in files" :key="file.id"><template #prepend><v-avatar color="lightprimary"><v-icon icon="$file" color="primary" /></v-avatar></template><v-list-item-title>{{ file.name }}</v-list-item-title><v-list-item-subtitle>{{ [file.type,file.size].filter(Boolean).join(' • ') }}</v-list-item-subtitle><template #append><v-btn v-if="downloadable" icon="$download" variant="text" size="small" @click="emit('download',file)"/><v-btn v-if="removable" icon="$close" variant="text" size="small" color="error" @click="emit('remove',file)"/></template></v-list-item><slot /></v-list></template>
<style scoped>.app-file-preview{border:1px dashed rgba(var(--v-theme-borderLight),.9);border-radius:var(--app-text-field-radius,10px);background:transparent}</style>
