<script setup lang="ts">
import {
  AppLayout,
  ConfirmDialog,
  CustomDataTable,
  CustomDataTableV2,
  ShamsiDatePicker,
  ToggleSwitch,
  type Header
} from '@amirjalili1374/ui-kit';

const headers: Header[] = [{ title: 'Name', key: 'name' }];
void AppLayout;
void CustomDataTable;
void CustomDataTableV2;
</script>

<template>
  <main>
    <ConfirmDialog :model-value="false" title="Confirm" />
    <ShamsiDatePicker model-value="" />
    <ToggleSwitch :model-value="false" label="Enabled" />
    <CustomDataTableV2 api-resource="/unused" :headers="headers" :items="[]" :height="300" :auto-fetch="false" />
    <CustomDataTable api-resource="/unused" :headers="headers" :items="[]" :height="300" :auto-fetch="false" />
  </main>
</template>
