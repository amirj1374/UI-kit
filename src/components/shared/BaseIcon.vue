<template>
  <button
    v-if="resolvedIcon && isInteractive"
    type="button"
    :class="['base-icon-button', buttonClass]"
    :aria-label="ariaLabel || iconLabel"
    @click="handleClick"
  >
    <component :is="resolvedIcon" class="icon" aria-hidden="true" />
  </button>
  <component v-else-if="resolvedIcon" :is="resolvedIcon" :class="['icon', buttonClass]" aria-hidden="true" />
</template>

<script lang="ts" setup>
import { computed, type Component, type PropType } from 'vue';
import { useUiKit } from '../../platform/uiKit';
import type { UiSemanticIconName } from '../../platform/types';

const props = defineProps({
  icon: {
    type: [String, Object, Function] as PropType<string | Component>,
    required: false,
  },
  buttonClass: {
    type: String,
    default: '',
  },
  emitFunc: {
    type: Function,
    required: false,
  },
  semantic: String as PropType<UiSemanticIconName>,
  rowData: Object,
  ariaLabel: String,
  interactive: {
    type: Boolean,
    default: undefined,
  },
});

const emit = defineEmits<{
  (event: 'action', rowData: unknown): void;
  (event: 'click', mouseEvent: MouseEvent): void;
}>();
const ui = useUiKit();
const resolvedIcon = computed(() => props.icon ?? (props.semantic ? ui.icon(props.semantic) : undefined));

const isInteractive = computed(() => props.interactive ?? typeof props.emitFunc === 'function');
const iconLabel = computed(() => props.semantic ?? (typeof props.icon === 'string' ? props.icon : 'Icon action'));

function handleClick(event: MouseEvent) {
  props.emitFunc?.(props.rowData);
  emit('action', props.rowData);
  emit('click', event);
}
</script>

<style scoped>
.base-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  color: inherit;
  background: transparent;
  cursor: pointer;
}
</style>

