<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue';
import { watch } from 'vue';

export type TextFieldVariant = 'outlined' | 'filled' | 'solo' | 'plain' | 'underlined';
export type TextFieldHeight = 'compact' | 'default' | 'comfortable';

const props = withDefaults(
  defineProps<{
    textFieldBorderRadius?: number;
    textFieldVariant?: TextFieldVariant;
    textFieldHeight?: TextFieldHeight;
    textScale?: number;
    applyPreview?: boolean;
    showActions?: boolean;
  }>(),
  {
    textFieldBorderRadius: 10,
    textFieldVariant: 'outlined',
    textFieldHeight: 'default',
    textScale: 100,
    applyPreview: true,
    showActions: true
  }
);

const emit = defineEmits<{
  'update:textFieldBorderRadius': [value: number];
  'update:textFieldVariant': [value: TextFieldVariant];
  'update:textFieldHeight': [value: TextFieldHeight];
  'update:textScale': [value: number];
  apply: [];
  reset: [];
}>();

const variants: Array<{ value: TextFieldVariant; title: string }> = [
  { value: 'outlined', title: 'دورخطی' },
  { value: 'filled', title: 'پرشده' },
  { value: 'solo', title: 'سایه‌دار' },
  { value: 'plain', title: 'تخت' },
  { value: 'underlined', title: 'زیرخطی' }
];

const heights: Array<{ value: TextFieldHeight; title: string }> = [
  { value: 'compact', title: 'کوتاه' },
  { value: 'default', title: 'متوسط' },
  { value: 'comfortable', title: 'بلند' }
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function setRadius(value: number) {
  emit('update:textFieldBorderRadius', clamp(value, 0, 24));
}

function setScale(value: number) {
  emit('update:textScale', clamp(value, 85, 115));
}

function applyPreview() {
  if (!props.applyPreview || typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--app-text-field-radius', `${props.textFieldBorderRadius}px`);
  root.style.setProperty('--app-text-scale', String(props.textScale / 100));
  root.dataset.textFieldVariant = props.textFieldVariant;
  root.dataset.uiDensity = props.textFieldHeight;
}

watch(
  () => [props.textFieldBorderRadius, props.textFieldVariant, props.textFieldHeight, props.textScale],
  applyPreview,
  { immediate: true }
);
</script>

<template>
  <section class="app-customizer-controls">
    <div class="app-customizer-controls__section">
      <div class="app-customizer-controls__heading">
        <h6 class="text-subtitle-1 font-weight-medium">گردی فیلدهای متنی</h6>
        <v-chip size="small" color="primary" variant="tonal">{{ textFieldBorderRadius }}px</v-chip>
      </div>
      <v-slider
        :model-value="textFieldBorderRadius"
        min="0"
        max="24"
        step="1"
        color="primary"
        thumb-label
        hide-details
        aria-label="تنظیم گردی فیلدهای متنی"
        @update:model-value="setRadius"
      />
    </div>

    <div class="app-customizer-controls__section">
      <div class="app-customizer-controls__heading">
        <h6 class="text-subtitle-1 font-weight-medium">اندازه متن رابط</h6>
        <v-chip size="small" color="primary" variant="tonal">{{ textScale }}%</v-chip>
      </div>
      <v-slider
        :model-value="textScale"
        min="85"
        max="115"
        step="1"
        color="primary"
        thumb-label
        hide-details
        aria-label="تنظیم اندازه متن رابط"
        @update:model-value="setScale"
      />
    </div>

    <div class="app-customizer-controls__appearance">
      <div class="app-customizer-controls__row">
        <h6 class="text-subtitle-1 font-weight-medium">سبک فیلدها</h6>
        <div class="app-customizer-controls__toggle">
          <v-btn
            v-for="variant in variants"
            :key="variant.value"
            :color="textFieldVariant === variant.value ? 'primary' : undefined"
            :variant="textFieldVariant === variant.value ? 'flat' : 'outlined'"
            :aria-label="variant.title"
            :title="variant.title"
            @click="emit('update:textFieldVariant', variant.value)"
          >
            <span class="app-customizer-controls__variant-preview" :class="variant.value" aria-hidden="true"><span /></span>
          </v-btn>
        </div>
      </div>

      <div class="app-customizer-controls__row">
        <h6 class="text-subtitle-1 font-weight-medium">ارتفاع فیلدها</h6>
        <div class="app-customizer-controls__toggle">
          <v-btn
            v-for="height in heights"
            :key="height.value"
            :color="textFieldHeight === height.value ? 'primary' : undefined"
            :variant="textFieldHeight === height.value ? 'flat' : 'outlined'"
            :aria-label="height.title"
            :title="height.title"
            @click="emit('update:textFieldHeight', height.value)"
          >
            <span class="app-customizer-controls__height-preview" :class="height.value" aria-hidden="true"><span /></span>
          </v-btn>
        </div>
      </div>
    </div>

    <div v-if="showActions" class="app-customizer-controls__actions">
      <div>تغییرات پس از تأیید ذخیره می‌شوند.</div>
      <v-btn color="primary" size="large" block @click="emit('apply')">
        <IconCheck size="20" class="ml-2" />
        اعمال و ذخیره تنظیمات
      </v-btn>
    </div>
  </section>
</template>

<style scoped lang="scss">
.app-customizer-controls { display: grid; gap: 24px; }
.app-customizer-controls__heading, .app-customizer-controls__row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.app-customizer-controls h6 { margin: 0; white-space: nowrap; }
.app-customizer-controls__appearance { display: grid; gap: 12px; }
.app-customizer-controls__toggle { display: flex; gap: 4px; }
.app-customizer-controls__toggle :deep(.v-btn) { min-width: 44px; width: 44px; min-height: 40px; padding-inline: 5px; }
.app-customizer-controls__variant-preview { color: rgb(var(--v-theme-primary)); width: 34px; height: 20px; display: flex; align-items: center; padding: 0 6px; border: 2px solid currentColor; border-radius: 5px; }
.app-customizer-controls__variant-preview span { width: 100%; border-top: 2px solid currentColor; opacity: .45; }
.app-customizer-controls__variant-preview.filled { border: 0; border-bottom: 2px solid currentColor; border-radius: 5px 5px 0 0; background: currentColor; }
.app-customizer-controls__variant-preview.filled span { border-color: rgb(var(--v-theme-surface)); opacity: .7; }
.app-customizer-controls__variant-preview.solo { border: 0; background: rgb(var(--v-theme-surface)); box-shadow: 0 2px 5px rgba(0,0,0,.35); }
.app-customizer-controls__variant-preview.plain { border: 0; border-radius: 0; }
.app-customizer-controls__variant-preview.underlined { border: 0; border-bottom: 2px solid currentColor; border-radius: 0; }
.app-customizer-controls__height-preview { display: grid; place-items: center; width: 32px; height: 28px; color: rgb(var(--v-theme-primary)); }
.app-customizer-controls__height-preview span { display: block; width: 28px; border: 2px solid currentColor; border-radius: 4px; }
.app-customizer-controls__height-preview.compact span { height: 14px; }
.app-customizer-controls__height-preview.default span { height: 19px; }
.app-customizer-controls__height-preview.comfortable span { height: 24px; }
.app-customizer-controls__toggle :deep(.v-btn--variant-flat) .app-customizer-controls__variant-preview, .app-customizer-controls__toggle :deep(.v-btn--variant-flat) .app-customizer-controls__height-preview { color: rgb(var(--v-theme-on-primary)); }
.app-customizer-controls__toggle :deep(.v-btn--variant-flat) .app-customizer-controls__variant-preview.filled span { border-color: rgb(var(--v-theme-primary)); }
.app-customizer-controls__actions { display: grid; gap: 8px; padding: 16px 0 0; border-top: 1px solid rgba(var(--v-theme-borderLight), .5); color: rgb(var(--v-theme-lightText)); font-size: .78rem; text-align: center; }

@media (max-width: 420px) { .app-customizer-controls__row { align-items: flex-start; flex-direction: column; } }
</style>
