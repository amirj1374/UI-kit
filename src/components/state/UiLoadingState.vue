<script setup lang="ts">
import { computed } from 'vue';
import { useUiKit } from '../../platform/uiKit';
const props = withDefaults(defineProps<{ title?: string; description?: string; inline?: boolean }>(), { title: undefined, description: undefined, inline: false });
const ui = useUiKit();
const title = computed(() => props.title ?? ui.t('loading'));
</script>
<template><div class="ui-state" :class="{ 'ui-state--inline': inline }" :dir="ui.direction.value" role="status" aria-live="polite" aria-busy="true"><slot name="icon"><component :is="ui.icon('loading')" class="ui-state__icon ui-state__icon--spin" aria-hidden="true" /></slot><div><slot><strong>{{ title }}</strong><p v-if="description">{{ description }}</p></slot></div></div></template>
