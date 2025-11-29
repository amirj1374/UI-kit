<script setup lang="ts">
import { computed } from 'vue';

interface StringOption {
  value: string;
  label?: string;
  icon?: any;
  slot?: string;
}

interface Props {
  modelValue: string | boolean;
  label: string;
  type?: 'boolean' | 'string';
  options?: StringOption[];
  trueLabel?: string;
  falseLabel?: string;
  trueIcon?: any;
  falseIcon?: any;
  activeColor?: string;
  inactiveColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'boolean',
  options: () => [],
  activeColor: 'rgb(var(--v-theme-primary))',
  inactiveColor: '#e0e0e0'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | boolean): void;
}>();

const isBooleanMode = computed(() => props.type === 'boolean');

const isStringMode = computed(() => props.type === 'string');

// For boolean mode
const isActive = computed(() => {
  if (isBooleanMode.value) {
    return props.modelValue === true;
  }
  return false;
});

// For string mode - get current index
const currentIndex = computed(() => {
  if (isStringMode.value && props.options.length > 0) {
    return props.options.findIndex(opt => opt.value === props.modelValue);
  }
  return 0;
});

const handleToggle = () => {
  if (isBooleanMode.value) {
    emit('update:modelValue', !props.modelValue);
  } else if (isStringMode.value && props.options.length > 0) {
    const nextIndex = (currentIndex.value + 1) % props.options.length;
    emit('update:modelValue', props.options[nextIndex].value);
  }
};

// Check if toggle should be in active state
const isToggleActive = computed(() => {
  if (isBooleanMode.value) {
    return isActive.value;
  } else {
    // For string mode with 2 options, active when on the second option (index 1)
    // For more options, active when not on the first option
    if (props.options.length >= 2) {
      return currentIndex.value >= 1;
    } else if (props.options.length === 1) {
      return true; // Always active if only one option
    }
    return false;
  }
});

// Get current option for string mode
const currentOption = computed(() => {
  if (isStringMode.value && props.options.length > 0) {
    return props.options[currentIndex.value] || props.options[0];
  }
  return null;
});

// Get display icon
const displayIcon = computed(() => {
  if (isBooleanMode.value) {
    return isActive.value ? props.trueIcon : props.falseIcon;
  } else {
    return currentOption.value?.icon;
  }
});
</script>

<template>
  <div class="mb-6">
    <h6 class="text-subtitle-1 font-weight-medium mb-3">{{ label }}</h6>
    <div class="theme-toggle-container">
      <div 
        class="theme-toggle"
        :class="{ 
          'active': isToggleActive,
          'string-mode': isStringMode
        }"
        :style="{
          background: isToggleActive ? props.activeColor : props.inactiveColor
        }"
        @click="handleToggle"
      >
        <div class="toggle-slider">
          <div class="toggle-icon">
            <slot name="icon" :value="modelValue" :option="currentOption">
              <component v-if="displayIcon" :is="displayIcon" size="24" stroke-width="2" />
            </slot>
          </div>
        </div>
      </div>
    </div>
 
  </div>
</template>

<style lang="scss" scoped>
.theme-toggle-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}

.theme-toggle {
  position: relative;
  width: 100px;
  height: 50px;
  background: rgb(var(--v-theme-primary));
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &.active {
    .toggle-slider {
      transform: translateX(50px);
    }
  }

  &:not(.active) {
    .toggle-slider {
      transform: translateX(0);
      background: #ffffff;
    }
  }

  .toggle-slider {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 40px;
    height: 40px;
    background: #ffffff;
    border-radius: 50%;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toggle-icon {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    color: #f39c12;
  }
}
</style>

