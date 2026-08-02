<script setup lang="ts">
import {
  AppLayout,
  ConfirmDialog,
  CustomDataTable,
  CustomDataTableV2,
  ShamsiDatePicker,
  ToggleSwitch,
  UiAsyncState,
  PermissionGuard,
  UiField,
  UiFieldMessage,
  UiFormActions,
  useUiKit,
  type UiAsyncStateModel,
  type UiPermissionRequirement,
  type UiThemeRegistry,
  type UiMessageOverrides,
  type UiSemanticIcons,
  type UiFieldMessageVariant,
  type UiFormActionsAlign,
  hasUiAsyncData,
  type Header
} from '@amirjalili1374/ui-kit';

const headers: Header[] = [{ title: 'Name', key: 'name' }];
const ui = useUiKit();
void ui.t('loading');
ui.update({ locale: 'fa-IR', direction: 'rtl' });
ui.update({ locale: 'en-US', direction: 'ltr' });
const asyncContract: UiAsyncStateModel<{ id: number }, Error> = { status: 'success', data: { id: 1 } };
const permissionContract: UiPermissionRequirement = { any: ['read', 'write'] };
const themeContract: UiThemeRegistry = { brand: { dark: false, colors: { primary: '#123456' } } };
const messageContract: UiMessageOverrides = { retry: 'Again' };
const iconContract: Partial<UiSemanticIcons> = { retry: 'mdi-refresh' };
const fieldMessageVariant: UiFieldMessageVariant = 'warning';
const formActionsAlign: UiFormActionsAlign = 'end';
void [asyncContract, permissionContract, themeContract, messageContract, iconContract, fieldMessageVariant, formActionsAlign];
void hasUiAsyncData(asyncContract);
void AppLayout;
void CustomDataTable;
void CustomDataTableV2;
</script>

<template>
  <main>
    <ConfirmDialog :model-value="false" title="Confirm" />
    <ShamsiDatePicker model-value="" />
    <ToggleSwitch :model-value="false" label="Enabled" />
    <UiAsyncState status="empty" />
    <PermissionGuard permission="read"><span>Allowed</span></PermissionGuard>
    <UiField id="consumer-name" label="Name" hint="Package-root field">
      <template #default="control"><input v-bind="control" /></template>
    </UiField>
    <UiFieldMessage variant="success" message="Ready" />
    <UiFormActions :show-cancel="false" />
    <CustomDataTableV2 api-resource="/unused" :headers="headers" :items="[]" :height="300" :auto-fetch="false" />
    <CustomDataTable api-resource="/unused" :headers="headers" :items="[]" :height="300" :auto-fetch="false" />
  </main>
</template>
