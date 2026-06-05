<script setup lang="ts">
import MoneyInput from '@/components/shared/MoneyInput.vue';
import ShamsiDatePicker from '@/components/shared/ShamsiDatePicker.vue';
import ToggleSwitch from '@/components/shared/ToggleSwitch.vue';
import { IconCheck, IconSquareX } from '@tabler/icons-vue';
import type { FilterOperator, Header } from '@/types/componentTypes/DataTableTypes';
import {
  getFieldInputType,
  hasAutocomplete,
  isDateHeader,
  isMoneyHeader,
  isTextareaHeader,
  isToggleHeader,
  resolveAutocompleteItemTitle,
  resolveAutocompleteItemValue,
  resolveAutocompleteItems,
  resolveAutocompleteMultiple,
  resolveAutocompleteReturnObject,
  resolveHeaderKey,
  resolveHeaderTitle,
  isHeaderDisabled
} from '../headerFieldUtils';

defineProps<{
  headers: Header[];
  hasFilterOperators: (header: Header) => boolean;
  getHeaderFilterOperators: (header: Header) => Array<{ value: FilterOperator; label: string }>;
}>();

const filterModel = defineModel<Record<string, any>>('filterModel', { required: true });
const filterOperatorModel = defineModel<Record<string, FilterOperator>>('filterOperatorModel', { required: true });
</script>

<template>
  <v-col
    v-for="header in headers"
    :key="resolveHeaderKey(header)"
    :cols="header.cols ? (typeof header.cols === 'number' ? header.cols : Number(header.cols)) : 4"
    :md="header.cols ? (typeof header.cols === 'number' ? header.cols : Number(header.cols)) : 4"
  >
    <template v-if="!header.hidden">
      <v-select
        v-if="hasFilterOperators(header)"
        v-model="filterOperatorModel[resolveHeaderKey(header)]"
        :items="getHeaderFilterOperators(header)"
        item-title="label"
        item-value="value"
        density="compact"
        variant="underlined"
        hide-details
        class="mb-1"
        attach
        :menu-props="{ zIndex: 20000 }"
      />
      <ShamsiDatePicker
        v-if="isDateHeader(header)"
        v-model="filterModel[resolveHeaderKey(header)]"
        :label="resolveHeaderTitle(header)"
        :disabled="isHeaderDisabled(header)"
        :mode="header.dateMode || 'single'"
      />
      <v-autocomplete
        v-else-if="hasAutocomplete(header)"
        v-model="filterModel[resolveHeaderKey(header)]"
        :label="resolveHeaderTitle(header)"
        :items="resolveAutocompleteItems(header, filterModel, filterModel)"
        :item-title="resolveAutocompleteItemTitle(header)"
        :item-value="resolveAutocompleteItemValue(header)"
        :return-object="resolveAutocompleteReturnObject(header)"
        :multiple="resolveAutocompleteMultiple(header)"
        :chips="resolveAutocompleteMultiple(header)"
        :closable-chips="resolveAutocompleteMultiple(header)"
        :disabled="isHeaderDisabled(header)"
        clearable
        variant="outlined"
        attach
        :menu-props="{ zIndex: 20000 }"
      />
      <MoneyInput
        v-else-if="isMoneyHeader(header)"
        v-model="filterModel[resolveHeaderKey(header)] as number"
        :label="resolveHeaderTitle(header)"
        :disabled="isHeaderDisabled(header)"
      />
      <v-textarea
        v-else-if="isTextareaHeader(header)"
        v-model="filterModel[resolveHeaderKey(header)]"
        :label="resolveHeaderTitle(header)"
        variant="outlined"
        :disabled="isHeaderDisabled(header)"
        :dir="(header as Header).dir"
        auto-grow
        rows="3"
      />
      <ToggleSwitch
        v-else-if="isToggleHeader(header)"
        v-model="filterModel[resolveHeaderKey(header)]"
        :label="resolveHeaderTitle(header)"
        type="boolean"
        activeColor="#3bd32a"
        inactiveColor="#d32a2a"
        :options="[
          { value: 'true', label: 'فعال', icon: IconCheck },
          { value: 'false', label: 'غیر فعال', icon: IconSquareX }
        ]"
      />
      <v-text-field
        v-else
        v-model="filterModel[resolveHeaderKey(header)]"
        :label="resolveHeaderTitle(header)"
        variant="outlined"
        :disabled="isHeaderDisabled(header)"
        :type="getFieldInputType(header)"
        :dir="(header as Header).dir"
      />
    </template>
  </v-col>
</template>
