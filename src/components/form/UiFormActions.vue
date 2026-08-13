<script setup lang="ts">
import { computed } from 'vue';
import { useUiKit } from '../../platform/uiKit';
import type { UiFormActionsAlign } from './types';

const props = withDefaults(defineProps<{ submitLabel?: string; cancelLabel?: string; loading?: boolean; disabled?: boolean; cancelDisabled?: boolean; showCancel?: boolean; align?: UiFormActionsAlign; sticky?: boolean; direction?: 'rtl' | 'ltr' }>(), { loading: false, disabled: false, cancelDisabled: false, showCancel: true, align: 'end', sticky: false });
const emit = defineEmits<{ submit: []; cancel: [] }>();
const ui = useUiKit();
const isSubmitDisabled = computed(() => props.disabled || props.loading);
</script>

<template>
  <div class="ui-form-actions" :class="[`ui-form-actions--${align}`, { 'ui-form-actions--sticky': sticky }]" :dir="direction ?? ui.direction.value" :aria-busy="loading || undefined">
    <div v-if="$slots.secondary" class="ui-form-actions__secondary"><slot name="secondary" /></div>
    <div class="ui-form-actions__primary">
      <slot :submit="() => emit('submit')" :cancel="() => emit('cancel')" :loading="loading" :disabled="isSubmitDisabled">
        <button v-if="showCancel" type="button" class="ui-form-actions__button ui-form-actions__button--cancel" :disabled="cancelDisabled || loading" @click="emit('cancel')">
          <component :is="ui.icon('cancel')" aria-hidden="true" />{{ cancelLabel ?? ui.t('cancel') }}
        </button>
        <button type="submit" class="ui-form-actions__button ui-form-actions__button--submit" :disabled="isSubmitDisabled" @click="emit('submit')">
          <component :is="ui.icon(loading ? 'loading' : 'confirm')" :class="{ 'ui-form-actions__spinner': loading }" aria-hidden="true" />{{ submitLabel ?? ui.t('save') }}
        </button>
      </slot>
    </div>
  </div>
</template>
