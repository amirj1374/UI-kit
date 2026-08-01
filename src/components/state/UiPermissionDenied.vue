<script setup lang="ts">
import { computed } from 'vue';
import { useUiKit } from '../../platform/uiKit';
const props = withDefaults(defineProps<{ title?: string; description?: string; actionLabel?: string; variant?: 'compact' | 'full' }>(), { variant: 'full' });
const emit = defineEmits<{ action: [] }>();
const ui = useUiKit();
const title = computed(() => props.title ?? ui.t('permissionDeniedTitle'));
const description = computed(() => props.description ?? ui.t('permissionDeniedDescription'));
</script>
<template><section class="ui-state" :class="{ 'ui-state--inline': variant === 'compact' }" :dir="ui.direction.value" role="alert"><slot name="icon"><component :is="ui.icon('permissionDenied')" class="ui-state__icon" aria-hidden="true" /></slot><div><slot><strong>{{ title }}</strong><p>{{ description }}</p></slot><div class="ui-state__actions"><slot name="actions"><button v-if="actionLabel" type="button" class="ui-state__button" @click="emit('action')">{{ actionLabel }}</button></slot></div></div></section></template>
