<script setup lang="ts">
import '@/scss/components/_VStepper.scss';
import { IconCheck, IconClock, IconPencil } from '@tabler/icons-vue';
import type { Component, ComponentPublicInstance } from 'vue';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  steps: {
    type: Array as () => { title: string; section: Component }[],
    required: true
  },
  modelValue: {
    type: Number,
    required: true
  },
  contentMinHeight: {
    type: String,
    default: undefined
  },
  disableClick: {
    type: Boolean,
    default: false
  },
  stepProps: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue', 'step-click']);

const stepperHeaderRef = ref<HTMLElement | null>(null);
const stepRefs = ref<Array<HTMLElement | null>>([]);
const currentStepComponentRef = ref();

function setStepRef(el: Element | ComponentPublicInstance | null, index: number) {
  stepRefs.value[index] = (el instanceof HTMLElement) ? el : null;
}

// Auto-scroll to active step with cleanup
const stopWatch = watch(() => props.modelValue, async () => {
  await nextTick();
  const activeStepEl = stepRefs.value[props.modelValue - 1];
  if (activeStepEl) {
    activeStepEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
});

onMounted(() => {
  nextTick(() => {
    if (stepperHeaderRef.value) {
      // RTL: scroll all the way to the right
      stepperHeaderRef.value.scrollLeft = stepperHeaderRef.value.scrollWidth;
    }
  });
});

// Cleanup watcher
onBeforeUnmount(() => {
  stopWatch();
});

defineExpose({ currentStepComponentRef });
</script>

<template>
  <div class="app-stepper-root" dir="rtl">
    <div class="app-stepper-header-card">
      <div ref="stepperHeaderRef" class="app-stepper-header">
        <span
          v-for="(step, index) in steps"
          :key="index"
          :ref="el => setStepRef(el, index)"
          class="app-stepper-step"
          :class="{
            active: modelValue === index + 1,
            resolved: modelValue > index + 1,
            pending: modelValue < index + 1,
            'no-click': disableClick
          }"
        >
          <span class="app-stepper-badge"
                :class="{
              'badge-active': modelValue === index + 1,
              'badge-resolved': modelValue > index + 1,
              'badge-pending': modelValue < index + 1
            }"
          >
            <slot name="badge" :status="modelValue > index + 1 ? 'resolved' : modelValue === index + 1 ? 'active' : 'pending'" :index="index">
              <template v-if="modelValue > index + 1">
                <IconCheck :size="16" />
              </template>
              <template v-else-if="modelValue === index + 1">
                <IconPencil :size="16" />
              </template>
              <template v-else>
                <IconClock :size="16" />
              </template>
            </slot>
          </span>
          <span class="app-stepper-title">{{ step.title }}</span>
          <span
            v-if="index < steps.length - 1"
            :class="[
              'app-stepper-connector',
              { 'active': modelValue > index + 1, 'resolved': modelValue > index + 1 }
            ]"
          ></span>
        </span>
      </div>
    </div>
    <div
      class="app-stepper-content"
      :style="props.contentMinHeight ? { minHeight: props.contentMinHeight } : undefined"
    >
      <component :is="steps[modelValue - 1].section" ref="currentStepComponentRef" v-bind="stepProps" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-stepper-step {
  &.no-click {
    pointer-events: none !important;
    cursor: default !important;
    opacity: 0.8;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
}

.app-stepper-header {
  &.no-click {
    pointer-events: none !important;
  }
}
</style> 