<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue';

withDefaults(
  defineProps<{
    label?: string;
    hint?: string;
  }>(),
  {
    label: 'اعمال و ذخیره تنظیمات',
    hint: 'تغییرات پس از تأیید ذخیره می‌شوند.'
  }
);

const emit = defineEmits<{ apply: [] }>();
</script>

<template>
  <div class="app-customizer-submit">
    <div class="app-customizer-submit__hint">{{ hint }}</div>
    <v-btn class="app-customizer-submit__button" color="primary" size="large" block @click="emit('apply')">
      <IconCheck size="20" class="ml-2" />
      {{ label }}
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
.app-customizer-submit__hint {
  margin-bottom: 8px;
  color: rgb(var(--v-theme-lightText));
  font-size: .78rem;
  text-align: center;
}

.app-customizer-submit__button { font-weight: 700; }
</style>
