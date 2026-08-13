<script setup lang="ts">
import { computed, useId } from 'vue';
import { useUiKit } from '../../platform/uiKit';
import UiFieldMessage from './UiFieldMessage.vue';

const props = withDefaults(defineProps<{ id?: string; label?: string; hint?: string; errors?: string | readonly string[]; success?: string; required?: boolean; disabled?: boolean; readonly?: boolean; direction?: 'rtl' | 'ltr' }>(), { required: false, disabled: false, readonly: false });
const ui = useUiKit();
const generatedId = useId();
const fieldId = computed(() => props.id ?? `ui-field-${generatedId.replace(/[^a-zA-Z0-9_-]/g, '')}`);
const normalizedErrors = computed(() => typeof props.errors === 'string' ? [props.errors] : [...(props.errors ?? [])]);
const hintId = computed(() => props.hint ? `${fieldId.value}-hint` : undefined);
const errorId = computed(() => normalizedErrors.value.length ? `${fieldId.value}-error` : undefined);
const successId = computed(() => props.success && !normalizedErrors.value.length ? `${fieldId.value}-success` : undefined);
const describedBy = computed(() => [hintId.value, errorId.value, successId.value].filter(Boolean).join(' ') || undefined);
const slotProps = computed(() => ({ id: fieldId.value, disabled: props.disabled, readonly: props.readonly, required: props.required, 'aria-invalid': normalizedErrors.value.length > 0 ? true : undefined, 'aria-describedby': describedBy.value }));
</script>

<template>
  <div class="ui-field" :class="{ 'ui-field--disabled': disabled, 'ui-field--readonly': readonly, 'ui-field--invalid': normalizedErrors.length }" :dir="direction ?? ui.direction.value">
    <div v-if="label || $slots.label || $slots.action" class="ui-field__heading">
      <label v-if="label || $slots.label" class="ui-field__label" :for="fieldId">
        <slot name="label" :id="fieldId" :required="required">{{ label }}</slot>
        <span v-if="required" class="ui-field__required" aria-hidden="true">*</span>
      </label>
      <div v-if="$slots.action" class="ui-field__action"><slot name="action" v-bind="slotProps" /></div>
    </div>
    <div class="ui-field__control"><slot v-bind="slotProps" /></div>
    <UiFieldMessage v-if="hint" :id="hintId" variant="hint"><slot name="hint">{{ hint }}</slot></UiFieldMessage>
    <UiFieldMessage v-if="normalizedErrors.length" :id="errorId" variant="error"><slot name="error" :errors="normalizedErrors"><span v-for="(error, index) in normalizedErrors" :key="index" class="ui-field__error">{{ error }}</span></slot></UiFieldMessage>
    <UiFieldMessage v-else-if="success" :id="successId" variant="success"><slot name="success">{{ success }}</slot></UiFieldMessage>
  </div>
</template>
