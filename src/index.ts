/**
 * UI Kit Library Entry Point
 * 
 * This file exports only generic, reusable components, composables, utilities, directives, 
 * stores, and component types - NO business logic or app-specific types.
 */

// Import styles (this ensures CSS is bundled)
import './scss/style.scss';

// ============================================================================
// COMPONENTS - Global reusable UI components only
// ============================================================================

// Components - Shared
export { default as BaseBreadcrumb } from './components/shared/BaseBreadcrumb.vue';
export { default as BaseIcon } from './components/shared/BaseIcon.vue';
export { default as ConfirmDialog } from './components/shared/ConfirmDialog.vue';
export { default as CustomAutocomplete } from './components/shared/CustomAutocomplete.vue';
// CustomDataTable is a compatibility alias of the current V2 implementation.
// There is no separate V1 component on this branch.
export { CustomDataTableV2, CustomDataTableV2 as CustomDataTable } from './components/shared/data-table-v2';
export type { DataTableV2Props } from './components/shared/data-table-v2';
export { default as DescriptionInput } from './components/shared/DescriptionInput.vue';
export { default as DownloadButton } from './components/shared/DownloadButton.vue';
export { default as MoneyInput } from './components/shared/MoneyInput.vue';
export { default as PdfViewer } from './components/shared/PdfViewer.vue';
export { default as ShamsiDatePicker } from './components/shared/ShamsiDatePicker.vue';
export { default as UiChildCard } from './components/shared/UiChildCard.vue';
export { default as UiParentCard } from './components/shared/UiParentCard.vue';
export { default as VPriceTextField } from './components/shared/VPriceTextField.vue';
export { default as ToggleSwitch } from './components/shared/ToggleSwitch.vue';
export { default as AppPageHeader } from './components/shared/AppPageHeader.vue';
export { default as AppFilterBar } from './components/shared/AppFilterBar.vue';
export { default as AppEmptyState } from './components/shared/AppEmptyState.vue';
export { default as AppStatusBadge } from './components/shared/AppStatusBadge.vue';
export { default as AppConfirmAction } from './components/shared/AppConfirmAction.vue';
export { default as AppFilePreview } from './components/shared/AppFilePreview.vue';
export type { PreviewFile } from './components/shared/AppFilePreview.vue';
export { default as AppFormSection } from './components/shared/AppFormSection.vue';
export { default as AppNotificationCenter } from './components/shared/AppNotificationCenter.vue';
export type { AppNotification } from './components/shared/AppNotificationCenter.vue';
export { default as RemoteAutocomplete } from './components/shared/RemoteAutocomplete.vue';
export type { RemoteAutocompleteLoader, RemoteAutocompleteResult } from './components/shared/RemoteAutocomplete.vue';
export { default as UiReadonlyField } from './components/shared/UiReadonlyField.vue';
export { default as UiObjectDetails } from './components/shared/UiObjectDetails.vue';
export type { UiObjectField } from './components/shared/UiObjectDetails.vue';
export { default as UiActionBar } from './components/shared/UiActionBar.vue';
export type { UiAction } from './components/shared/UiActionBar.vue';

// Components - Common
export { default as AppStepper } from './components/common/AppStepper.vue';
export { default as Loading } from './components/Loading.vue';
export { default as UiLoadingState } from './components/state/UiLoadingState.vue';
export { default as UiEmptyState } from './components/state/UiEmptyState.vue';
export { default as UiErrorState } from './components/state/UiErrorState.vue';
export { default as UiPermissionDenied } from './components/state/UiPermissionDenied.vue';
export { default as UiAsyncState } from './components/state/UiAsyncState.vue';
export { default as PermissionGuard } from './components/permissions/PermissionGuard.vue';
export { default as UiField } from './components/form/UiField.vue';
export { default as UiFieldMessage } from './components/form/UiFieldMessage.vue';
export { default as UiFormActions } from './components/form/UiFormActions.vue';
export type { UiFieldMessageVariant, UiFormActionsAlign } from './components/form/types';

// Components - Chat primitives (transport/store agnostic)
export { default as UiChatShell } from './components/chat/UiChatShell.vue';
export { default as UiChatMessage } from './components/chat/UiChatMessage.vue';
export { default as UiChatMarkdown } from './components/chat/UiChatMarkdown.vue';
export { default as UiChatComposer } from './components/chat/UiChatComposer.vue';
export { default as UiChatPromptNavigator } from './components/chat/UiChatPromptNavigator.vue';
export type {
  UiChatRole,
  UiChatMessageStatus,
  UiChatMessageModel,
  UiChatPrompt,
  UiChatMentionCategory,
  UiChatMentionOption,
  UiChatMention
} from './components/chat/types';

// Components - Layout
export { default as AppSidebar } from './components/layout/AppSidebar.vue';
export { default as AppHeader } from './components/layout/AppHeader.vue';
export { default as AppHeaderMenu } from './components/layout/AppHeaderMenu.vue';
export { default as AppCustomizerControls } from './components/layout/AppCustomizerControls.vue';
export { default as AppCustomizerPanel } from './components/layout/AppCustomizerPanel.vue';
export { default as AppCustomizer } from './components/layout/AppCustomizer.vue';
export type { CustomizerThemeOption } from './components/layout/AppCustomizerPanel.vue';
export { default as AppCustomizerSubmit } from './components/layout/AppCustomizerSubmit.vue';
export type { TextFieldHeight, TextFieldVariant } from './components/layout/AppCustomizerControls.vue';
export { parseCustomizerPreferences, serializeCustomizerPreferences, customizerPreferenceDefaults } from './utils/customizerPreferences';
export type { AppDirection, AppLanguage, ContentWidth, CustomizerPreferences, MenuOrientation, SurfaceStyle } from './utils/customizerPreferences';
export { default as AppLayout } from './components/layout/AppLayout.vue';
export type { MenuItem, HeaderAction } from './types/components/layout/menu';

// ============================================================================
// COMPOSABLES - Generic composables only (no business logic)
// ============================================================================

// Export functions only to avoid type conflicts with component types
export { useDataTable } from './composables/useDataTable';
export type { DataTableOptions, PaginationState } from './composables/useDataTable';

export { useTableActions } from './composables/useTableActions';
export type { ActionOptions } from './composables/useTableActions';
// Note: CustomAction and CustomButtonAction types are exported from DataTableTypes

export * from './composables/useTableHeaders';

export { useTableSelection } from './composables/useTableSelection';
export type { SelectionOptions } from './composables/useTableSelection';
// Note: GroupedItems type is exported from DataTableTypes

// Note: usePermissions and useRouteGuard are app-specific and excluded

// ============================================================================
// DIRECTIVES - All directives
// ============================================================================

export { default as DigitLimit } from './directives/v-digit-limit';
// Note: v-permission directive contains app-specific logic and is excluded

// ============================================================================
// UTILS - Generic utility functions only
// ============================================================================

export * from './utils/date-convertor';
export * from './utils/greetingUtils';
export * from './utils/number-formatter';
export * from './utils/NationalCodeValidator';
export * from './utils/helpers/fetch-wrapper';
export { configureAuth } from './utils/helpers/fetch-wrapper';
export type { AuthConfig } from './utils/helpers/fetch-wrapper';

// Axios instance configuration
export { configureAxiosInstance } from './services/axiosInstance';
export { default as getAxiosInstance } from './services/axiosInstance';

// ============================================================================
// PLUGINS - Authentication and other plugins
// ============================================================================

// Keycloak plugin
export { setupKeycloak } from './plugins/key-clock';
export type {
  KeycloakConfig,
  KeycloakInitOptions,
  KeycloakLogoutOptions,
  KeycloakCallbacks,
  KeycloakPluginOptions
} from './plugins/key-clock';

// ============================================================================
// APP INITIALIZER - Bootstrap and authentication mode management
// ============================================================================

export {
  AuthModeInitializer,
  KeycloakInitializer,
  JwtInitializer,
  InitializerModeInitializer,
  AppBootstrap,
  bootstrapApp
} from './utils/appInitializer';
export type {
  AuthMode,
  AuthModeConfig,
  KeycloakConfig as KeycloakInitializerConfig,
  JwtConfig,
  InitializerModeConfig,
  AppInitializationResult,
  AppInitializer,
  AppBootstrapConfig,
  PluginConfig,
  DirectiveConfig,
  ComponentConfig
} from './utils/appInitializer';

// ============================================================================
// VALIDATORS - Generic validators
// ============================================================================

export * from './validators/nationalCodeRule';

// ============================================================================
// STORES - Global stores only (no business logic stores)
// ============================================================================

export { useCustomizerStore } from './stores/customizer';

// Note: permissions store contains app-specific menu permissions and is excluded
// Note: approval, base, customerInfo, auth, authUser stores are app-specific and excluded

// ============================================================================
// TYPES - Component types and generic types only (NO business logic types)
// ============================================================================

// Component types - These are the definitive types for components
export * from './types/componentTypes/DataTableType';
export * from './types/componentTypes/DataTableTypes';

// Generic enum types
export * from './constants/enums/booleanEnum';
export { createUiKit, useUiKit, useUiKitConfig, useUiKitLocale, useUiKitMessages, useUiKitIcons, usePermission } from './platform/uiKit';
export { defaultThemes, mergeThemes, createUiKitThemes } from './platform/themes';
export type { UiKitThemeName } from './platform/themes';
export type * from './platform/types';
// UiAsyncState is also the component name; expose the generic contract under
// an unambiguous package-root alias so generated declarations retain it.
export type { UiAsyncState as UiAsyncStateModel } from './platform/types';
export { isUiAsyncLoading, isUiAsyncError, hasUiAsyncData } from './platform/types';
export type { UiKitContext } from './platform/uiKit';

// Note: All approval, cartable, and other business logic types are excluded

// Plugin installation function (for Vue app.use())
import type { App } from 'vue';
import DigitLimit from './directives/v-digit-limit';
import { provideUiKit } from './platform/uiKit';
import type { UiKitConfig } from './platform/types';

/**
 * Install the UI Kit library in a Vue application
 * @param app - Vue application instance
 */
export function install(app: App, options: UiKitConfig = {}) {
  provideUiKit(app, options);
  // Register directives globally
  app.directive('digit-limit', DigitLimit);
  // Note: v-permission directive contains app-specific logic and is not registered
}

export const UiKitPlugin = { install };

// Default export for plugin usage
export default {
  install,
};

