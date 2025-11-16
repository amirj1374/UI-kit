<script setup lang="ts">
import { computed } from 'vue';

type DisplayStyle = 'compact' | 'detailed'

interface TooltipFn<T = any> {
  (item: T): string
}

interface SubtitleFn<T = any> {
  (item: T): string | undefined
}

const props = withDefaults(defineProps<{
  // Optional unified dynamic field mapping
  fields?: {
    title?: string | ((item: any) => string)
    value?: string | ((item: any) => unknown)
    subtitle?: string | SubtitleFn
    group?: string
    isMainGroup?: string
  }
  modelValue: any
  items: any[]
  itemTitle?: string | ((item: any) => string)
  itemValue?: string | ((item: any) => unknown)
  displayStyle?: DisplayStyle
  multiple?: boolean
  clearable?: boolean
  label?: string
  placeholder?: string
  density?: 'default' | 'comfortable' | 'compact'
  disabled?: boolean
  loading?: boolean
  error?: boolean
  rules?: ((v: any) => true | string)[]
  returnObject?: boolean
  chips?: boolean
  maxWidth?: string | number
  // Optional secondary line for detailed style
  itemSubtitle?: string | SubtitleFn
  // Tooltip: string or function per item; slot overrides this
  tooltip?: string | TooltipFn
  // Props for underlying VTooltip
  tooltipLocation?: 'top' | 'bottom' | 'start' | 'end'
  tooltipOpenDelay?: number
  tooltipCloseDelay?: number
  // Group functionality
  groupField?: string // field name for group identification (default: 'groupId')
  isMainGroupField?: string // field name for main group flag (default: 'isMainGroup')
}>(), {
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
  isMainGroupField: 'isMainGroup',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (v: any) => emit('update:modelValue', v),
})

function resolveTitle(item: any): string {
  // Priority: fields.title -> itemTitle -> raw
  const titleMapper = props.fields?.title ?? props.itemTitle
  if (typeof titleMapper === 'function') return titleMapper(item)
  if (titleMapper && typeof item === 'object' && item) return String(item[titleMapper] ?? '')
  return String(item ?? '')
}

function resolveValue(item: any): unknown {
  // Priority: fields.value -> itemValue -> raw
  const valueMapper = props.fields?.value ?? props.itemValue
  if (typeof valueMapper === 'function') return valueMapper(item)
  if (valueMapper && typeof item === 'object' && item) return item[valueMapper]
  return item
}

function resolveSubtitle(item: any): string | undefined {
  // Priority: fields.subtitle -> itemSubtitle
  const subtitleMapper = props.fields?.subtitle ?? props.itemSubtitle
  if (!subtitleMapper) return undefined
  if (typeof subtitleMapper === 'function') return subtitleMapper(item)
  if (typeof item === 'object' && item) return item[subtitleMapper]
  return undefined
}

function resolveTooltip(item: any): string | undefined {
  if (!props.tooltip) return undefined
  if (typeof props.tooltip === 'function') return props.tooltip(item)
  return props.tooltip
}

// Get group members for main group items
function getGroupMembers(mainGroupItem: any): any[] {
  const groupField = props.fields?.group ?? props.groupField
  const isMainField = props.fields?.isMainGroup ?? props.isMainGroupField
  if (!mainGroupItem || !mainGroupItem[isMainField as string]) return []
  const groupId = mainGroupItem[groupField as string]
  if (groupId === null || groupId === undefined) return []
  return props.items.filter(item => item[groupField as string] === groupId && !item[isMainField as string])
}

// Check if item is a main group
function isMainGroup(item: any): boolean {
  const isMainField = props.fields?.isMainGroup ?? props.isMainGroupField
  return !!(item && item[isMainField as string] === true)
}
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
        >
          <template #activator="{ props: activatorProps }">
            <v-list-item
              v-bind="{ ...itemProps, ...activatorProps }"
              :two-line="displayStyle === 'detailed'"
              :class="{ 'ca-main-group': true }"
            >
              <template #title>
                <div class="ca-item-title">
                  {{ resolveTitle(item.raw ?? item) }}
                  <v-chip
                    size="small"
                    color="primary"
                    variant="tonal"
                    class="ca-group-chip"
                  >
                    گروه
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
                  >
                    {{ resolveTitle(member) }}
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
        >
          <template #title>
            <div class="ca-item-title">{{ resolveTitle(item.raw ?? item) }}</div>
          </template>
          <template v-if="displayStyle === 'detailed' && resolveSubtitle(item.raw ?? item)" #subtitle>
            <div class="ca-item-subtitle">{{ resolveSubtitle(item.raw ?? item) }}</div>
          </template>
          <slot name="item-append" :item="item.raw ?? item" />
        </v-list-item>
      </template>
    </template>

    <template #selection="{ item, index }">
      <v-chip
        class="ca-chip"
        variant="tonal"
      >
        <span class="ca-chip-title">{{ resolveTitle(item.raw ?? item) }}</span>
        <template v-if="displayStyle === 'detailed' && resolveSubtitle(item.raw ?? item)">
          <span class="ca-chip-sep">•</span>
          <span class="ca-chip-subtitle">{{ resolveSubtitle(item.raw ?? item) }}</span>
        </template>
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
}

.ca-group-tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.ca-group-count {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.6);
  background-color: rgba(var(--v-theme-primary), 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.ca-group-members {
  max-height: 300px;
  overflow-y: auto;
}

.ca-group-member {
  padding: 4px 0;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.ca-group-member:last-child {
  border-bottom: none;
}
</style>


