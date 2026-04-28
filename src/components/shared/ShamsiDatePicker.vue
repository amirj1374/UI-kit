<template>
  <div class="shamsi-date-picker">
    <Vue3PersianDatetimePicker
      :label="label"
      v-model="selectedDate"
      :format="format"
      :display-format="displayFormat"
      :editable="false"
      :clearable="clearable"
      :disabled="disabled"
      :min="minDate"
      :max="maxDate"
      :placeholder="placeholder"
      :input-class="inputClass"
      :wrapper-class="wrapperClass"
      :range="isRangeMode"
      :color="color"
      @change="onDateChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type OutputFormat = 'iso' | 'date-only';

interface Props {
  modelValue?: string | [string, string] | null;
  label?: string;
  placeholder?: string;
  variant?: 'outlined' | 'filled' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled';
  density?: 'default' | 'comfortable' | 'compact' | 'prominent';
  color?: string;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  rules?: any[];
  hideDetails?: boolean | 'auto';
  prependInnerIcon?: string;
  appendInnerIcon?: string;
  format?: string;
  displayFormat?: string;
  minDate?: string;
  maxDate?: string;
  mode?: 'single' | 'range';
  icon?: string;
  outputFormat?: OutputFormat; // حالت خروجی: 'iso' (با timezone) یا 'date-only' (فقط تاریخ)
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: 'تاریخ',
  placeholder: 'تاریخ را انتخاب کنید',
  variant: 'outlined',
  density: 'default',
  color: 'primary',
  disabled: false,
  readonly: false,
  clearable: true,
  rules: () => [],
  hideDetails: 'auto',
  prependInnerIcon: '',
  appendInnerIcon: '',
  format: 'YYYY-MM-DD',
  displayFormat: 'jYYYY/jMM/jDD',
  minDate: '',
  maxDate: '',
  mode: 'single',
  icon: '',
  outputFormat: 'iso' // دیفالت: فرمت ISO با timezone
});

const emit = defineEmits<{
  'update:modelValue': [value: string | [string, string] | null];
}>();

const selectedDate = computed({
  get: () => {
    if (props.mode === 'range' && Array.isArray(props.modelValue)) {
      return props.modelValue;
    } else if (typeof props.modelValue === 'string' && props.modelValue) {
      if (props.modelValue.includes('T')) {
        const date = new Date(props.modelValue);
        const localDate =
          date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
        return localDate;
      }
      return props.modelValue;
    }
    return props.modelValue;
  },
  set: (value) => {
    emit('update:modelValue', value);
  }
});

const onDateChange = (date: any) => {
  if (props.mode === 'range') {
    if (Array.isArray(date) && date.length === 2) {
      const [startDate, endDate] = date;
      const gregorianStart = formatOutput(startDate);
      const gregorianEnd = formatOutput(endDate);
      emit('update:modelValue', [gregorianStart, gregorianEnd]);
    } else {
      emit('update:modelValue', null);
    }
  } else {
    if (date) {
      const formattedDate = formatOutput(date);
      emit('update:modelValue', formattedDate);
    } else {
      emit('update:modelValue', '');
    }
  }
};

const formatOutput = (date: any): string => {
  if (!date) return '';

  let dateObj: Date;

  if (date._isAMomentObject && date.isValid()) {
    dateObj = date.toDate();
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return '';
  }

  if (isNaN(dateObj.getTime())) return '';

  if (props.outputFormat === 'date-only') {
    // فرمت: 2026-04-28
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } else {
    // فرمت: 2026-04-28T00:00:00.000Z (ISO با timezone)
    return dateObj.toISOString();
  }
};

const inputClass = computed(() => {
  const classes = ['v-text-field', 'v-input', 'v-input--density-comfortable'];
  if (props.variant === 'outlined') {
    classes.push('v-text-field--variant-outlined');
  }
  return classes.join(' ');
});

const wrapperClass = computed(() => {
  return 'v-field v-field--variant-outlined v-field--density-comfortable';
});

const isRangeMode = computed(() => props.mode === 'range');
</script>

<style scoped>
/* کانتینر اصلی دیت‌پیکر */
.shamsi-date-picker {
  position: relative;
}

/* استایل‌دهی به گروه ورودی (input container) */
.shamsi-date-picker :deep(.vpd-input-group) {
  border: 1px solid rgb(var(--v-theme-borderLight));
  border-radius: 10px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  background: rgb(var(--v-theme-surface));
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

/* حالت hover روی ورودی */
.shamsi-date-picker :deep(.vpd-input-group:hover) {
  border-color: rgb(var(--v-theme-secondary));
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

/* حالت focus روی ورودی */
.shamsi-date-picker :deep(.vpd-input-group:focus-within) {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.1);
}

/* استایل فیلد ورودی */
.shamsi-date-picker :deep(.vpd-input-group input) {
  padding: 12px 16px;
  font-size: 14px;
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  box-sizing: border-box;
  color: rgb(var(--v-theme-onSurface));
}

/* استایل placeholder ورودی */
.shamsi-date-picker :deep(.vpd-input-group input::placeholder) {
  color: rgb(var(--v-theme-onSurfaceVariant));
  opacity: 0.7;
}

/* دکمه آیکون (آیکون تقویم) */
.shamsi-date-picker :deep(.vpd-icon-btn) {
  padding: 8px;
  border-radius: 6px;
  margin: 4px;
  cursor: pointer;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%) !important;
  color: white !important;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* حالت hover دکمه آیکون */
.shamsi-date-picker :deep(.vpd-icon-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* حالت active دکمه آیکون */
.shamsi-date-picker :deep(.vpd-icon-btn:active) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* آیکون داخل دکمه */
.shamsi-date-picker :deep(.vpd-icon-btn i) {
  font-size: 16px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/* نوار نمایش بازه تاریخ در ورودی */
.shamsi-date-picker :deep(.vpd-range) {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%) !important;
  opacity: 0.2;
}

/* کانتینر اصلی تقویم (picker) */
.shamsi-date-picker :deep(.vpd-picker) {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-borderLight));
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* هدر تقویم (بخش بالایی با گرادیانت) */
.shamsi-date-picker :deep(.vpd-header) {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: white;
}

/* متن بالای هدر در حالت range picker */
.shamsi-date-picker :deep(.vpd-header-title) {
  color: white !important;
  font-weight: 600;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  opacity: 0.95;
}

/* دکمه‌های ناوبری (فلش‌های چپ و راست) */
.shamsi-date-picker :deep(.vpd-nav-btn) {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  border-radius: 6px;
  transition: all 0.2s ease;
}

/* حالت hover دکمه‌های ناوبری */
.shamsi-date-picker :deep(.vpd-nav-btn:hover) {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: scale(1.05);
}

/* روزهای تقویم */
.shamsi-date-picker :deep(.vpd-day) {
  color: rgb(var(--v-theme-onSurface)) !important;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
}

/* حالت hover روی روزها */
.shamsi-date-picker :deep(.vpd-day:hover) {
  background: rgb(var(--v-theme-primaryContainer)) !important;
  color: rgb(var(--v-theme-onPrimaryContainer)) !important;
}

/* روز انتخاب شده */
.shamsi-date-picker :deep(.vpd-day.vpd-selected) {
  background: rgb(var(--v-theme-primary)) !important;
  color: white !important;
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
}

/* روز امروز */
.shamsi-date-picker :deep(.vpd-day.vpd-today) {
  border: 2px solid rgb(var(--v-theme-primary));
  font-weight: bold;
}

/* نمایش ماه و سال در هدر */
.shamsi-date-picker :deep(.vpd-month-year) {
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* نام روزهای هفته */
.shamsi-date-picker :deep(.vpd-weekday) {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  background: rgb(var(--v-theme-primaryContainer));
  border-radius: 6px;
  margin: 0px;
}

/* دکمه‌های فوتر (امروز، پاک کردن و ...) */
.shamsi-date-picker :deep(.vpd-actions button) {
  background: rgb(var(--v-theme-secondary)) !important;
  color: white !important;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  margin: 4px;
}

/* حالت hover دکمه‌های فوتر */
.shamsi-date-picker :deep(.vpd-actions button:hover) {
  background: rgb(var(--v-theme-primary)) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* حالت active دکمه‌های فوتر */
.shamsi-date-picker :deep(.vpd-actions button:active) {
  transform: translateY(0);
}

/* محتوای اصلی تقویم */
.shamsi-date-picker :deep(.vpd-content) {
  opacity: 1;
  transition: all 0.4s cubic-bezier(0.25, 0.1, 0.17, 1.84);
  text-align: right;
  direction: rtl;
  width: 316px;
  background-color: rgb(var(--v-theme-surface)) !important;
  box-shadow: 5px 22px 95px -14px #000;
  cursor: default;
}

/* استایل‌های ریسپانسیو برای تبلت */
@media (max-width: 768px) {
  .shamsi-date-picker :deep(.vpd-input-group) {
    border-radius: 8px;
  }

  .shamsi-date-picker :deep(.vpd-input-group input) {
    padding: 10px 12px;
    font-size: 14px;
  }

  .shamsi-date-picker :deep(.vpd-icon-btn) {
    padding: 6px;
    margin: 2px;
    min-width: 32px;
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .shamsi-date-picker :deep(.vpd-icon-btn i) {
    font-size: 14px;
  }

  .shamsi-date-picker :deep(.vpd-picker) {
    max-width: 320px;
    margin: 0 auto;
  }

  .shamsi-date-picker :deep(.vpd-day) {
    padding: 8px 4px;
    font-size: 14px;
    min-width: 32px;
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .shamsi-date-picker :deep(.vpd-weekday) {
    padding: 6px 2px;
    font-size: 12px;
    min-width: 28px;
    min-height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .shamsi-date-picker :deep(.vpd-actions button) {
    padding: 6px 12px;
    font-size: 14px;
    margin: 2px;
  }

  .shamsi-date-picker :deep(.vpd-month-year) {
    font-size: 16px;
  }

  .shamsi-date-picker :deep(.vpd-nav-btn) {
    padding: 4px;
    min-width: 28px;
    min-height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

/* استایل‌های ریسپانسیو برای موبایل */
@media (max-width: 480px) {
  .shamsi-date-picker :deep(.vpd-picker) {
    max-width: 280px;
    border-radius: 8px;
  }

  .shamsi-date-picker :deep(.vpd-day) {
    padding: 6px 2px;
    font-size: 12px;
    min-width: 28px;
    min-height: 28px;
  }

  .shamsi-date-picker :deep(.vpd-weekday) {
    padding: 4px 1px;
    font-size: 11px;
    min-width: 24px;
    min-height: 24px;
  }

  .shamsi-date-picker :deep(.vpd-actions button) {
    padding: 4px 8px;
    font-size: 12px;
    margin: 1px;
  }

  .shamsi-date-picker :deep(.vpd-month-year) {
    font-size: 14px;
  }

  .shamsi-date-picker :deep(.vpd-header) {
    border-radius: 8px 8px 0 0;
  }
}

/* بهینه‌سازی برای دستگاه‌های لمسی */
@media (hover: none) and (pointer: coarse) {
  .shamsi-date-picker :deep(.vpd-icon-btn),
  .shamsi-date-picker :deep(.vpd-day),
  .shamsi-date-picker :deep(.vpd-nav-btn),
  .shamsi-date-picker :deep(.vpd-actions button) {
    min-width: 44px;
    min-height: 44px;
  }
}

/* روزهای بین دو تاریخ انتخاب شده در range picker */
.shamsi-date-picker :deep(.vpd-day.vpd-range-between) {
  background: rgba(var(--v-theme-primary), 0.15) !important;
  color: rgb(var(--v-theme-onSurface)) !important;
  border-radius: 0 !important;
}

/* اولین روز انتخاب شده در range picker */
.shamsi-date-picker :deep(.vpd-day.vpd-range-start) {
  background: rgb(var(--v-theme-primary)) !important;
  color: white !important;
  border-radius: 6px 0 0 6px !important;
}

/* آخرین روز انتخاب شده در range picker */
.shamsi-date-picker :deep(.vpd-day.vpd-range-end) {
  background: rgb(var(--v-theme-primary)) !important;
  color: white !important;
  border-radius: 0 6px 6px 0 !important;
}

/* حالت hover روی روزهای بین range */
.shamsi-date-picker :deep(.vpd-day.vpd-range-between:hover) {
  background: rgba(var(--v-theme-primary), 0.25) !important;
}

/* زمانی که روز شروع و پایان یکی باشند */
.shamsi-date-picker :deep(.vpd-day.vpd-range-start.vpd-range-end) {
  border-radius: 6px !important;
}
</style>
