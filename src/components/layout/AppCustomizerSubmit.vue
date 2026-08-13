<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue';
import { computed } from 'vue';
import type { AppLanguage } from '../../utils/customizerPreferences';

const props = withDefaults(
  defineProps<{
    label?: string;
    hint?: string;
    language?: AppLanguage;
  }>(),
  {
    label: '',
    hint: '',
    language: 'fa'
  }
);

const emit = defineEmits<{ apply: [] }>();
const resolvedLabel = computed(() => props.label || (props.language === 'en' ? 'Apply and save settings' : 'اعمال و ذخیره تنظیمات'));
const resolvedHint = computed(() => props.hint || (props.language === 'en' ? 'Changes are saved after confirmation.' : 'تغییرات پس از تأیید ذخیره می‌شوند.'));
</script>

<template>
  <div class="app-customizer-submit">
    <div class="app-customizer-submit__hint">{{ resolvedHint }}</div>
    <v-btn class="app-customizer-submit__button" color="primary" size="large" block @click="emit('apply')">
      <IconCheck size="20" class="ml-2" />
      {{ resolvedLabel }}
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
