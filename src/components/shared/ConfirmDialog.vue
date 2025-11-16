<template>
  <v-dialog v-model="isOpen" :persistent="persistent" :max-width="width">
    <v-card>
      <v-card-title class="text-h6">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <div v-if="message" class="mb-2">{{ message }}</div>
        <slot />
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn :loading="loading" :color="color" variant="flat" @click="onConfirm">
          {{ confirmText }}
        </v-btn>
        <v-btn :disabled="loading" variant="text" @click="onCancel">
          {{ cancelText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
  confirmText: 'تایید',
  cancelText: 'انصراف',
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


