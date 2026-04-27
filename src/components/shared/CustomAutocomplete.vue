<script setup lang="ts">
import { computed, watch } from 'vue';

type DisplayStyle = 'compact' | 'detailed';

interface TooltipFn<T = any> {
  (item: T): string;
}

interface SubtitleFn<T = any> {
  (item: T): string | undefined;
}

const props = withDefaults(
  defineProps<{
    // Optional unified dynamic field mapping
    fields?: {
      title?: string | ((item: any) => string);
      value?: string | ((item: any) => unknown);
      subtitle?: string | SubtitleFn;
      group?: string;
      isMainGroup?: string;
    };
    modelValue: any;
    items: any[];
    itemTitle?: string | ((item: any) => string);
    itemValue?: string | ((item: any) => unknown);
    displayStyle?: DisplayStyle;
    multiple?: boolean;
    clearable?: boolean;
    label?: string;
    placeholder?: string;
    density?: 'default' | 'comfortable' | 'compact';
    disabled?: boolean;
    loading?: boolean;
    error?: boolean;
    rules?: ((v: any) => true | string)[];
    returnObject?: boolean;
    chips?: boolean;
    maxWidth?: string | number;
    // Optional secondary line for detailed style
    itemSubtitle?: string | SubtitleFn;
    // Tooltip: string or function per item; slot overrides this
    tooltip?: string | TooltipFn;
    // Props for underlying VTooltip
    tooltipLocation?: 'top' | 'bottom' | 'start' | 'end';
    tooltipOpenDelay?: number;
    tooltipCloseDelay?: number;
    // Group functionality
    groupField?: string; // field name for group identification (default: 'groupId')
    isMainGroupField?: string; // field name for main group flag (default: 'isMainGroup')
  }>(),
  {
    itemTitle: 'title',
    itemValue: 'value',
    displayStyle: 'compact',
    multiple: false,
    clearable: true,
    density: 'comfortable',
    returnObject: false,
    chips: true,
    tooltipLocation: 'top',
    tooltipOpenDelay: 0,
    tooltipCloseDelay: 0,
    groupField: 'groupId',
    isMainGroupField: 'isMainGroup'
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

// ==================== توابع resolve اصلی (بدون تغییر) ====================

function resolveTitle(item: any): string {
  // Priority: fields.title -> itemTitle -> raw
  const titleMapper = props.fields?.title ?? props.itemTitle;
  if (typeof titleMapper === 'function') return titleMapper(item);
  if (titleMapper && typeof item === 'object' && item) return String(item[titleMapper] ?? '');
  return String(item ?? '');
}

function resolveValue(item: any): unknown {
  // Priority: fields.value -> itemValue -> raw
  const valueMapper = props.fields?.value ?? props.itemValue;
  if (typeof valueMapper === 'function') return valueMapper(item);
  if (valueMapper && typeof item === 'object' && item) return item[valueMapper];
  return item;
}

function resolveSubtitle(item: any): string | undefined {
  // Priority: fields.subtitle -> itemSubtitle
  const subtitleMapper = props.fields?.subtitle ?? props.itemSubtitle;
  if (!subtitleMapper) return undefined;
  if (typeof subtitleMapper === 'function') return subtitleMapper(item);
  if (typeof item === 'object' && item) return item[subtitleMapper];
  return undefined;
}

function resolveTooltip(item: any): string | undefined {
  if (!props.tooltip) return undefined;
  if (typeof props.tooltip === 'function') return props.tooltip(item);
  return props.tooltip;
}

function getGroupId(item: any): any {
  const groupField = props.fields?.group ?? props.groupField;
  if (typeof item === 'object' && item) return item[groupField];
  return null;
}

// Get group members for main group items
function getGroupMembers(mainGroupItem: any): any[] {
  const groupField = props.fields?.group ?? props.groupField;
  const isMainField = props.fields?.isMainGroup ?? props.isMainGroupField;
  if (!mainGroupItem || !mainGroupItem[isMainField as string]) return [];
  const groupId = mainGroupItem[groupField as string];
  if (groupId === null || groupId === undefined) return [];
  return props.items.filter((item) => item[groupField as string] === groupId && !item[isMainField as string]);
}

// Check if item is a main group
function isMainGroup(item: any): boolean {
  const isMainField = props.fields?.isMainGroup ?? props.isMainGroupField;
  return !!(item && item[isMainField as string] === true);
}

// ==================== منطق انتخاب متقابل ====================

// تابع برای پردازش تغییرات انتخاب با اعمال منطق متقابل
function processSelectionChange(newValue: any): any {
  if (!props.multiple) {
    // در حالت single selection
    return newValue;
  }

  if (!Array.isArray(newValue)) return newValue;

  let result = [...newValue];

  // بررسی برای هر آیتم انتخاب شده
  newValue.forEach((selected) => {
    const selectedValue = props.returnObject ? resolveValue(selected) : selected;
    const selectedItem = props.items.find((item) =>
      resolveValue(item) === selectedValue
    );

    if (!selectedItem) return;

    const groupId = getGroupId(selectedItem);
    if (!groupId) return;

    const isMain = isMainGroup(selectedItem);

    if (isMain) {
      // اگر گروه اصلی انتخاب شد، تمام اعضای گروه را حذف کن
      result = result.filter(item => {
        const itemValue = props.returnObject ? resolveValue(item) : item;
        const itemObj = props.items.find(i => resolveValue(i) === itemValue);
        if (!itemObj) return true;

        const itemGroupId = getGroupId(itemObj);
        const itemIsMain = isMainGroup(itemObj);

        // اگر عضو همان گروه است و main نیست، حذفش کن
        return !(itemGroupId === groupId && !itemIsMain);
      });
    } else {
      // اگر عضو گروه انتخاب شد، گروه اصلی را حذف کن
      result = result.filter(item => {
        const itemValue = props.returnObject ? resolveValue(item) : item;
        const itemObj = props.items.find(i => resolveValue(i) === itemValue);
        if (!itemObj) return true;

        const itemGroupId = getGroupId(itemObj);
        const itemIsMain = isMainGroup(itemObj);

        // اگر گروه اصلی همان گروه است، حذفش کن
        return !(itemGroupId === groupId && itemIsMain);
      });
    }
  });

  return result;
}

// بررسی آیا گروه اصلی انتخاب شده است
function isMainGroupSelected(groupId: any): boolean {
  if (!props.multiple) {
    const selectedValue = props.returnObject ? props.modelValue : props.modelValue;
    const selectedItem = props.items.find((item) =>
      resolveValue(item) === selectedValue
    );
    return selectedItem && getGroupId(selectedItem) === groupId && isMainGroup(selectedItem);
  } else {
    return (
      Array.isArray(props.modelValue) &&
      props.modelValue.some((selected) => {
        const selectedValue = props.returnObject ? resolveValue(selected) : selected;
        const selectedItem = props.items.find((item) =>
          resolveValue(item) === selectedValue
        );
        return selectedItem && getGroupId(selectedItem) === groupId && isMainGroup(selectedItem);
      })
    );
  }
}

// بررسی آیا عضوی از گروه انتخاب شده است
function isGroupMemberSelected(groupId: any): boolean {
  if (!props.multiple) {
    const selectedValue = props.returnObject ? props.modelValue : props.modelValue;
    const selectedItem = props.items.find((item) =>
      resolveValue(item) === selectedValue
    );
    return selectedItem && getGroupId(selectedItem) === groupId && !isMainGroup(selectedItem);
  } else {
    return (
      Array.isArray(props.modelValue) &&
      props.modelValue.some((selected) => {
        const selectedValue = props.returnObject ? resolveValue(selected) : selected;
        const selectedItem = props.items.find((item) =>
          resolveValue(item) === selectedValue
        );
        return selectedItem && getGroupId(selectedItem) === groupId && !isMainGroup(selectedItem);
      })
    );
  }
}

// تابع برای بررسی disabled بودن یک آیتم
function isItemDisabled(item: any): boolean {
  if (props.disabled) return true;

  const groupId = getGroupId(item);
  if (!groupId) return false;

  const isMain = isMainGroup(item);

  if (isMain) {
    // گروه اصلی غیرفعال شود اگر عضوی از گروه انتخاب شده
    return isGroupMemberSelected(groupId);
  } else {
    // عضو گروه غیرفعال شود اگر گروه اصلی انتخاب شده
    return isMainGroupSelected(groupId);
  }
}

// فیلتر سفارشی برای جستجو
function customFilter(item: any, queryText: string, itemText: string): boolean {
  // اگر آیتم disabled باشد، در جستجو نشان نده
  if (isItemDisabled(item.raw ?? item)) {
    return false;
  }

  // جستجوی عادی
  const text = resolveTitle(item.raw ?? item);
  const query = queryText.toLowerCase();
  return text.toLowerCase().includes(query);
}

// ==================== computed و model ====================

const model = computed({
  get: () => props.modelValue,
  set: (v: any) => {
    // قبل از emit کردن، منطق متقابل را اعمال کن
    const processedValue = processSelectionChange(v);
    emit('update:modelValue', processedValue);
  }
});

// ==================== Watchers ====================

// تماشای تغییرات modelValue برای اعمال منطق (backup)
watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    if (props.multiple && Array.isArray(newValue)) {
      const processed = processSelectionChange(newValue);
      if (JSON.stringify(processed) !== JSON.stringify(newValue)) {
        // اگر تغییراتی لازم بود، emit کن
        emit('update:modelValue', processed);
      }
    }
  },
  { deep: true }
);
</script>

<template>
  <v-autocomplete
    v-model="model"
    :items="items"
    :item-title="(item: any) => resolveTitle(item.raw ?? item)"
    :item-value="(item: any) => resolveValue(item.raw ?? item)"
    :multiple="multiple"
    :clearable="clearable"
    :label="label"
    :placeholder="placeholder"
    :density="density"
    :disabled="disabled"
    :loading="loading"
    :error="error"
    :rules="rules"
    :return-object="returnObject"
    :chips="chips"
    :style="maxWidth ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth } : undefined"
    v-bind="$attrs"
    variant="outlined"
    :menu-props="{ attach: 'body', zIndex: 10000 }"
    :filter="customFilter"
  >
    <template #item="{ props: itemProps, item }">
      <template v-if="isMainGroup(item.raw ?? item)">
        <v-tooltip
          :location="tooltipLocation"
          :open-delay="tooltipOpenDelay"
          :close-delay="tooltipCloseDelay"
          :text="undefined"
          width="300px"
          height="300px"
          color="surface"
          :disabled="isItemDisabled(item.raw ?? item)"
        >
          <template #activator="{ props: activatorProps }">
            <v-list-item
              v-bind="{ ...itemProps, ...activatorProps }"
              :two-line="displayStyle === 'detailed'"
              :class="{
                'ca-main-group': true,
                'ca-disabled-item': isItemDisabled(item.raw ?? item)
              }"
              :disabled="isItemDisabled(item.raw ?? item)"
            >
              <template #title>
                <div class="ca-item-title">
                  {{ resolveTitle(item.raw ?? item) }}
                  <v-chip size="small" color="primary" variant="tonal" class="ca-group-chip"> گروه </v-chip>
                  <v-chip v-if="isItemDisabled(item.raw ?? item)" size="small" color="error" variant="outlined" class="ca-disabled-chip">
                    غیرفعال
                  </v-chip>
                </div>
              </template>
              <template v-if="displayStyle === 'detailed' && resolveSubtitle(item.raw ?? item)" #subtitle>
                <div class="ca-item-subtitle">{{ resolveSubtitle(item.raw ?? item) }}</div>
              </template>
              <slot name="item-append" :item="item.raw ?? item" />
            </v-list-item>
          </template>
          <template #default>
            <slot name="tooltip" :item="item.raw ?? item" :group-members="getGroupMembers(item.raw ?? item)">
              <div class="ca-group-tooltip">
                <div class="ca-group-tooltip-header">
                  <strong>{{ resolveTitle(item.raw ?? item) }}</strong>
                  <span class="ca-group-count">{{ getGroupMembers(item.raw ?? item).length }} آیتم</span>
                </div>
                <div class="ca-group-members">
                  <div
                    v-for="(member, idx) in getGroupMembers(item.raw ?? item)"
                    :key="`${resolveValue(member)}-${idx}`"
                    class="ca-group-member"
                    :class="{ 'ca-disabled-member': isItemDisabled(item.raw ?? item) }"
                  >
                    {{ resolveTitle(member) }}
                    <v-icon v-if="isItemDisabled(item.raw ?? item)" size="small" color="error"> mdi-block-helper </v-icon>
                  </div>
                </div>
              </div>
            </slot>
          </template>
        </v-tooltip>
      </template>
      <template v-else>
        <v-list-item
          v-bind="itemProps"
          :two-line="displayStyle === 'detailed'"
          :class="{ 'ca-disabled-item': isItemDisabled(item.raw ?? item) }"
          :disabled="isItemDisabled(item.raw ?? item)"
        >
          <template #title>
            <div class="ca-item-title">
              {{ resolveTitle(item.raw ?? item) }}
              <v-chip v-if="isItemDisabled(item.raw ?? item)" size="small" color="error" variant="outlined" class="ca-disabled-chip">
                غیرفعال
              </v-chip>
            </div>
          </template>
          <template v-if="displayStyle === 'detailed' && resolveSubtitle(item.raw ?? item)" #subtitle>
            <div class="ca-item-subtitle">{{ resolveSubtitle(item.raw ?? item) }}</div>
          </template>
          <slot name="item-append" :item="item.raw ?? item" />
        </v-list-item>
      </template>
    </template>

    <template #selection="{ item, index }">
      <v-chip class="ca-chip" variant="tonal" :color="isMainGroup(item.raw ?? item) ? 'primary' : 'secondary'">
        <span class="ca-chip-title">{{ resolveTitle(item.raw ?? item) }}</span>
        <template v-if="displayStyle === 'detailed' && resolveSubtitle(item.raw ?? item)">
          <span class="ca-chip-sep">•</span>
          <span class="ca-chip-subtitle">{{ resolveSubtitle(item.raw ?? item) }}</span>
        </template>
        <v-icon v-if="isMainGroup(item.raw ?? item)" size="small" class="ml-1"> mdi-account-group </v-icon>
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<style scoped>
.ca-item-title {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ca-item-subtitle {
  opacity: 0.7;
  font-size: 0.875rem;
}
.ca-chip {
  margin: 2px;
}
.ca-chip-title {
  font-weight: 600;
}
.ca-chip-sep {
  margin: 0 6px;
  opacity: 0.6;
}
.ca-chip-subtitle {
  opacity: 0.85;
}

/* Group styling */
.ca-main-group {
  background-color: rgba(var(--v-theme-primary), 0.05);
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.ca-group-chip {
  margin-right: auto;
}

/* Group tooltip styling */
.ca-group-tooltip {
  max-width: 300px;
  padding: 8px;
  color: rgb(var(--v-theme-on-surface));
}

.ca-group-tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.ca-group-tooltip-header strong {
  color: rgb(var(--v-theme-on-surface));
  font-weight: 600;
}

.ca-group-count {
  font-size: 0.8rem;
  color: rgb(var(--v-theme-on-primary));
  background-color: rgb(var(--v-theme-primary));
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.ca-group-members {
  max-height: 300px;
  overflow-y: auto;
}

.ca-group-member {
  padding: 4px 0;
  font-size: 0.9rem;
  color: rgb(var(--v-theme-on-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.ca-group-member:last-child {
  border-bottom: none;
}

.ca-disabled-item {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: rgba(0, 0, 0, 0.04);
}

.ca-disabled-chip {
  margin-right: 8px;
  font-size: 0.7rem;
}

.ca-disabled-member {
  opacity: 0.5;
  text-decoration: line-through;
}

/* اضافه کردن به استایل‌های موجود */
.ca-main-group {
  background-color: rgba(var(--v-theme-primary), 0.05);
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.ca-main-group.ca-disabled-item {
  background-color: rgba(var(--v-theme-error), 0.05);
  border-left: 3px solid rgb(var(--v-theme-error));
}
</style>