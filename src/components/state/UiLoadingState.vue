<script setup lang="ts">
import { computed } from 'vue';
import { useUiKit } from '../../platform/uiKit';
const props = withDefaults(defineProps<{ title?: string; description?: string; inline?: boolean; variant?: 'compact' | 'full'; progress?: number }>(), { title: undefined, description: undefined, inline: false, variant: 'full', progress: undefined });
const ui = useUiKit();
const title = computed(() => props.title ?? ui.t('loading'));
const progress = computed(() => props.progress === undefined ? undefined : Math.min(100, Math.max(0, props.progress)));
</script>
<template>
  <div class="ui-state" :class="{ 'ui-state--inline': inline || variant === 'compact' }" :dir="ui.direction.value" role="status" aria-live="polite" aria-busy="true">
    <slot name="icon"><component :is="ui.icon('loading')" class="ui-state__icon ui-state__icon--spin" aria-hidden="true" /></slot>
    <div><slot><strong>{{ title }}</strong><p v-if="description">{{ description }}</p><progress v-if="progress !== undefined" :value="progress" max="100" :aria-label="title" /></slot></div>
  </div>
</template>
