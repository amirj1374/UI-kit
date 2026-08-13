<script setup lang="ts">
import { computed } from 'vue';
import { useUiKit } from '../../platform/uiKit';
const props = withDefaults(defineProps<{ title?: string; description?: string; retryLabel?: string; error?: unknown; showDetails?: boolean; variant?: 'compact' | 'full' }>(), { showDetails: false, variant: 'full' });
const emit = defineEmits<{ retry: [] }>();
const ui = useUiKit();
const title = computed(() => props.title ?? ui.t('errorTitle'));
const description = computed(() => props.description ?? ui.t('errorDescription'));
const details = computed(() => props.error instanceof Error ? props.error.message : typeof props.error === 'string' ? props.error : undefined);
</script>
<template><section class="ui-state" :class="{ 'ui-state--inline': variant === 'compact' }" :dir="ui.direction.value" role="alert"><slot name="icon"><component :is="ui.icon('error')" class="ui-state__icon" aria-hidden="true" /></slot><div><slot><strong>{{ title }}</strong><p>{{ description }}</p><pre v-if="showDetails && details" class="ui-state__details">{{ details }}</pre></slot><div class="ui-state__actions"><slot name="actions" :retry="() => emit('retry')"><button type="button" class="ui-state__button" @click="emit('retry')"><component :is="ui.icon('retry')" aria-hidden="true" />{{ retryLabel ?? ui.t('retry') }}</button></slot></div></div></section></template>
