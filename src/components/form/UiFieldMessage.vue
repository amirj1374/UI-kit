<script setup lang="ts">
import { computed } from 'vue';
import { useUiKit } from '../../platform/uiKit';
import type { UiIconSource } from '../../platform/types';
import type { UiFieldMessageVariant } from './types';

const props = withDefaults(defineProps<{ id?: string; message?: string; variant?: UiFieldMessageVariant; icon?: UiIconSource; hideIcon?: boolean }>(), { variant: 'hint', hideIcon: false });
const ui = useUiKit();
const resolvedIcon = computed<UiIconSource | undefined>(() => {
  if (props.hideIcon || props.variant === 'hint') return undefined;
  if (props.icon) return props.icon;
  return ui.icon(props.variant === 'error' ? 'error' : props.variant);
});
const role = computed(() => props.variant === 'error' ? 'alert' : props.variant === 'warning' ? 'status' : undefined);
const live = computed<'polite' | undefined>(() => props.variant === 'warning' || props.variant === 'success' ? 'polite' : undefined);
</script>

<template>
  <p :id="id" class="ui-field-message" :class="`ui-field-message--${variant}`" :dir="ui.direction.value" :role="role" :aria-live="live">
    <slot name="icon" :icon="resolvedIcon"><component :is="resolvedIcon" v-if="resolvedIcon" class="ui-field-message__icon" aria-hidden="true" /></slot>
    <span><slot>{{ message }}</slot></span>
  </p>
</template>
