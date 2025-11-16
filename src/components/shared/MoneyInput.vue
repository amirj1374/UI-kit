<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    required: false,
    default: 0,
    validator: (value) => value === null || value === undefined || typeof value === 'string' || typeof value === 'number'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'outlined'
  },
  errorMessages: {
    type: [String, Array],
    default: () => []
  },
  min: {
    type: Number,
    default: undefined
  },
  max: {
    type: Number,
    default: undefined
  },
  suffix: {
    type: String,
    default: ''
  },
  prefix: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

// Memoization for better performance
const lastProcessedValue = ref<string | number | null | undefined>(null);
const lastFormattedValue = ref<string>('');

const displayValue = computed({
  get() {
    // Format with commas for display
    const val = props.modelValue;
    if (val === undefined || val === null || val === 0) return '';
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  set(val: string | null | undefined) {
    // Remove all non-digit characters and emit as number
    const safeVal = (val ?? '').replace(/[^\d]/g, '');
    emit('update:modelValue', safeVal === '' ? 0 : Number(safeVal));
  }
});

function onKeyPress(event: KeyboardEvent) {
  if (!/[0-9]/.test(event.key)) {
    event.preventDefault();
  }
}
</script>

<template>
  <v-text-field
    v-model="displayValue"
    :label="props.label"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :clearable="props.clearable"
    :variant="props.variant as any"
    :error-messages="props.errorMessages as string[]"
    :suffix="props.suffix"
    :prefix="props.prefix"
    inputmode="numeric"
    pattern="[0-9]*"
    type="text"
    @keypress="onKeyPress"
  >
    <template v-for="(slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </v-text-field>
</template>