<script setup lang="ts">
import { computed } from 'vue';
import { useUiKit } from '../../platform/uiKit';
const props = withDefaults(defineProps<{ title?: string; description?: string; variant?: 'compact' | 'full'; headingLevel?: 2 | 3 | 4 | 5 | 6; primaryLabel?: string; secondaryLabel?: string }>(), { variant: 'full', headingLevel: 2 });
const emit = defineEmits<{ primary: []; secondary: [] }>();
const ui = useUiKit();
const title = computed(() => props.title ?? ui.t('emptyTitle'));
const description = computed(() => props.description ?? ui.t('emptyDescription'));
const heading = computed(() => `h${props.headingLevel}`);
</script>
<template><section class="ui-state" :class="{ 'ui-state--inline': variant === 'compact' }" :dir="ui.direction.value" role="status"><slot name="icon"><component :is="ui.icon('empty')" class="ui-state__icon" aria-hidden="true" /></slot><div><slot><component :is="heading">{{ title }}</component><p>{{ description }}</p></slot><div class="ui-state__actions"><slot name="actions"><button v-if="primaryLabel" type="button" class="ui-state__button" @click="emit('primary')">{{ primaryLabel }}</button><button v-if="secondaryLabel" type="button" class="ui-state__button" @click="emit('secondary')">{{ secondaryLabel }}</button></slot></div></div></section></template>
