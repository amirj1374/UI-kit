<template>
  <v-dialog
    v-model="isOpen"
    :persistent="persistent"
    :max-width="width"
    :aria-labelledby="titleId"
    :aria-describedby="message ? messageId : undefined"
  >
    <v-card>
      <v-card-title :id="titleId" class="text-h6">
        {{ resolvedTitle }}
      </v-card-title>
      <v-card-text>
        <div v-if="message" :id="messageId" class="mb-2">{{ message }}</div>
        <slot />
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn autofocus :loading="loading" :color="color" variant="flat" :aria-label="resolvedConfirmText" @click="onConfirm">
          {{ resolvedConfirmText }}
        </v-btn>
        <v-btn :disabled="loading" variant="text" :aria-label="resolvedCancelText" @click="onCancel">
          {{ resolvedCancelText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { useUiKit } from '../../platform/uiKit'

const id = useId()
const titleId = `confirm-dialog-title-${id}`
const messageId = `confirm-dialog-message-${id}`

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  color?: string
  persistent?: boolean
  loading?: boolean
  width?: string | number
}>(), {
  title: '',
  message: '',
  confirmText: undefined,
  cancelText: undefined,
  color: 'primary',
  persistent: false,
  loading: false,
  width: 420,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
const ui = useUiKit()
const resolvedTitle = computed(() => props.title ?? '')
const resolvedConfirmText = computed(() => props.confirmText ?? ui.t('confirm'))
const resolvedCancelText = computed(() => props.cancelText ?? ui.t('cancel'))

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

function onCancel() {
  emit('cancel')
  isOpen.value = false
}

function onConfirm() {
  emit('confirm')
}
</script>

<style scoped>
</style>


