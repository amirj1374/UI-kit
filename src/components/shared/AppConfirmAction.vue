<script setup lang="ts">
withDefaults(defineProps<{ modelValue: boolean; title?: string; description?: string; confirmText?: string; cancelText?: string; color?: string; loading?: boolean }>(), { title: 'تأیید عملیات', confirmText: 'تأیید', cancelText: 'انصراف', color: 'primary', loading: false });
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; confirm: []; cancel: [] }>();
</script>
<template><v-dialog :model-value="modelValue" max-width="430" @update:model-value="emit('update:modelValue',$event)"><v-card class="app-confirm-action"><v-card-title>{{ title }}</v-card-title><v-card-text v-if="description">{{ description }}</v-card-text><v-card-actions><v-spacer/><v-btn variant="text" :disabled="loading" @click="emit('cancel');emit('update:modelValue',false)">{{ cancelText }}</v-btn><v-btn :color="color" :loading="loading" @click="emit('confirm')">{{ confirmText }}</v-btn></v-card-actions></v-card></v-dialog></template>
