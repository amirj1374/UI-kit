<template>
  <div class="description-input">
    <v-textarea
      v-model="internalValue"
      :label="label"
      :placeholder="placeholder"
      :rows="rows"
      :maxlength="maxlength"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="clearable"
      :counter="showCounter || undefined"
      variant="outlined"
      density="comfortable"
      auto-grow
      @keydown="handleKeydown"
      @input="handleInput"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  maxlength?: number;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  showCounter?: boolean;
  autoNumbering?: boolean; // Enable/disable auto numbering
  startNumber?: number; // Starting number for auto numbering
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: 'توضیحات',
  placeholder: 'توضیحات خود را وارد کنید...',
  rows: 4,
  maxlength: 1000,
  disabled: false,
  readonly: false,
  clearable: true,
  showCounter: true,
  autoNumbering: true,
  startNumber: 1
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}>();

const internalValue = ref(props.modelValue);

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue;
});

// Watch for internal value changes and emit
watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue);
});

// Handle keydown events for auto numbering
const handleKeydown = (event: KeyboardEvent) => {
  if (!props.autoNumbering || props.disabled || props.readonly) {
    return;
  }

  const target = event.target as HTMLTextAreaElement;
  const { key, ctrlKey, shiftKey, altKey } = event;

  // Handle Enter key (new line with incrementing number)
  if (key === 'Enter' && !ctrlKey && !shiftKey && !altKey) {
    event.preventDefault();
    insertNumberedLine(target, true);
  }
  
  // Handle Inter key (new line with decrementing number)
  if (key === 'Inter' || (key === 'Enter' && shiftKey)) {
    event.preventDefault();
    insertNumberedLine(target, false);
  }
};

// Insert a numbered line
const insertNumberedLine = (textarea: HTMLTextAreaElement, increment: boolean) => {
  const { selectionStart, selectionEnd, value } = textarea;
  
  // Get current line number
  const currentLineNumber = getCurrentLineNumber(value, selectionStart);
  
  // Calculate new line number
  const newLineNumber = increment ? currentLineNumber + 1 : Math.max(1, currentLineNumber - 1);
  
  // Create the new line text
  const newLineText = `\n${newLineNumber} - `;
  
  // Insert the new line
  const newValue = value.slice(0, selectionStart) + newLineText + value.slice(selectionEnd);
  internalValue.value = newValue;
  
  // Set cursor position after the new line
  const newCursorPosition = selectionStart + newLineText.length;
  
  // Use nextTick to ensure DOM is updated
  setTimeout(() => {
    textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    textarea.focus();
  }, 0);
};

// Get the current line number from the text
const getCurrentLineNumber = (text: string, cursorPosition: number): number => {
  // Find the current line
  const lines = text.split('\n');
  let currentPos = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const lineLength = lines[i].length + 1; // +1 for newline
    
    if (currentPos + lineLength > cursorPosition) {
      // We found the current line
      const line = lines[i];
      
      // Check if line starts with a number pattern (e.g., "1 - ", "2 - ", etc.)
      const numberMatch = line.match(/^(\d+)\s*-\s*/);
      if (numberMatch) {
        return parseInt(numberMatch[1]);
      }
      
      // If no number found, return the line index + startNumber
      return props.startNumber + i;
    }
    
    currentPos += lineLength;
  }
  
  // If we're at the end, return the next number
  return props.startNumber + lines.length;
};

// Handle input changes
const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  const value = target.value;
  
  // Auto-format existing text to add numbering if needed
  if (props.autoNumbering && value && !value.match(/^\d+\s*-\s/)) {
    const formattedValue = formatTextWithNumbering(value);
    if (formattedValue !== value) {
      internalValue.value = formattedValue;
    }
  }
};

// Format text to add numbering
const formatTextWithNumbering = (text: string): string => {
  const lines = text.split('\n');
  const formattedLines = lines.map((line, index) => {
    // Skip empty lines
    if (!line.trim()) {
      return line;
    }
    
    // If line already has numbering, keep it
    if (line.match(/^\d+\s*-\s/)) {
      return line;
    }
    
    // Add numbering
    return `${props.startNumber + index} - ${line}`;
  });
  
  return formattedLines.join('\n');
};

// Handle blur event
const handleBlur = () => {
  emit('change', internalValue.value);
};
</script>

<style scoped>
.description-input {
  width: 100%;
}

.description-input :deep(.v-textarea textarea) {
  font-family: 'Vazir', 'Tahoma', sans-serif;
  line-height: 1.6;
}

.description-input :deep(.v-textarea textarea:focus) {
  outline: none;
}
</style>
