<script lang="ts" setup>
import { computed, ref, watch, onMounted } from 'vue';

// Your Regex for thousand separator
const THOUSAND_SEPARATOR_REGEX = /\B(?=(\d{3})+(?!\d))/g;

// Helper functions (previously in formatters.ts)
const formatNumber = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null || value === '') return '';
  const stringValue = value.toString().replace(/,/g, ''); // Remove existing commas
  if (stringValue === '') return '';
  return stringValue.replace(THOUSAND_SEPARATOR_REGEX, ',');
};

const unformatNumber = (value: string | undefined | null): string => {
  if (value === undefined || value === null) return '';
  return value.toString().replace(/,/g, '');
};

const props = defineProps<{
  modelValue: string | number | undefined | null; // The raw, unformatted numeric string or number
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  errorMessages?: string | string[];
  min?: number; // For validation, not direct input blocking here
  max?: number; // For validation
  // Add any other v-text-field props you want to support
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
}>();

// Internal ref to manage the displayed (formatted) value in the text field
const displayValue = ref('');
const isFocused = ref(false);

// When the underlying modelValue changes, update the displayValue (formatted)
watch(() => props.modelValue, (newModelValue) => {
  if (!isFocused.value) {
    displayValue.value = formatNumber(newModelValue);
  } else {
    // If focused, the display value should be unformatted for editing
    // but ensure it syncs if modelValue changes externally while focused
    const unformattedModel = unformatNumber(newModelValue !== null && newModelValue !== undefined ? newModelValue.toString() : '');
    if (unformatNumber(displayValue.value) !== unformattedModel) {
      displayValue.value = unformattedModel;
    }
  }
}, { immediate: true });

onMounted(() => {
  displayValue.value = formatNumber(props.modelValue);
});

const handleInput = (event: Event) => {
  const inputElement = event.target as HTMLInputElement;
  let caretPosition = inputElement.selectionStart; // Store caret position

  let rawValue = inputElement.value;
  let unformatted = rawValue.replace(/[^\d]/g, ''); // Allow only digits

  // Handle min/max (simplified: primarily for validation, not strict input blocking here)
  if (props.min !== undefined && parseInt(unformatted, 10) < props.min) {
    // unformatted = props.min.toString(); // Could clamp, but might be jarring.
  }
  if (props.max !== undefined && parseInt(unformatted, 10) > props.max) {
    // unformatted = props.max.toString();
  }

  emit('update:modelValue', unformatted); // Emit the raw unformatted value

  // Update displayValue immediately with formatted version for the input field
  // This can be tricky with cursor position.
  const currentFormatted = formatNumber(unformatted);
  
  // Calculate difference in length to adjust caret
  const oldFormattedLength = displayValue.value.length;
  const newFormattedLength = currentFormatted.length;

  displayValue.value = currentFormatted; // Update internal display value

  // Attempt to restore caret position
  // This is a common challenge with formatted inputs.
  // Vue nextTick is important here to wait for DOM update.
  inputElement.value = currentFormatted; // Force update input element directly
  if (caretPosition !== null) {
    const diff = newFormattedLength - oldFormattedLength;
    try {
      inputElement.setSelectionRange(caretPosition + diff, caretPosition + diff);
    } catch (e) {
      // Some browsers might have issues if not fully visible or other edge cases
    }
  }
};

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true;
  displayValue.value = unformatNumber(props.modelValue !== null && props.modelValue !== undefined ? props.modelValue.toString() : ''); // Show raw number for editing
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false;
  displayValue.value = formatNumber(props.modelValue); // Format on blur
  emit('blur', event);
};

</script>

<template>
  <v-text-field
    :model-value="displayValue"
    :label="props.label"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :clearable="props.clearable"
    :error-messages="props.errorMessages"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
    inputmode="numeric" 
    pattern="[0-9,]*"
  >
    <!-- Pass through slots if needed -->
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </v-text-field>
</template> 