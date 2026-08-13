<script setup lang="ts">
import { computed } from 'vue';
import { useUiKit } from '../../platform/uiKit';
const props = withDefaults(defineProps<{ modelValue: boolean; title?: string; description?: string; confirmText?: string; cancelText?: string; color?: string; loading?: boolean }>(), { color: 'primary', loading: false });
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; confirm: []; cancel: [] }>();
const ui = useUiKit();
const resolvedTitle = computed(() => props.title ?? ui.t('operationConfirmation'));
const resolvedConfirm = computed(() => props.confirmText ?? ui.t('confirm'));
const resolvedCancel = computed(() => props.cancelText ?? ui.t('cancel'));
</script>
<template><v-dialog :model-value="modelValue" max-width="430" @update:model-value="emit('update:modelValue',$event)"><v-card class="app-confirm-action"><v-card-title>{{ resolvedTitle }}</v-card-title><v-card-text v-if="description">{{ description }}</v-card-text><v-card-actions><v-spacer/><v-btn variant="text" :disabled="loading" @click="emit('cancel');emit('update:modelValue',false)">{{ resolvedCancel }}</v-btn><v-btn :color="color" :loading="loading" @click="emit('confirm')">{{ resolvedConfirm }}</v-btn></v-card-actions></v-card></v-dialog></template>
