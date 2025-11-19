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
export { default as CustomDataTable } from './components/shared/CustomDataTable.vue';
export { default as DescriptionInput } from './components/shared/DescriptionInput.vue';
export { default as DownloadButton } from './components/shared/DownloadButton.vue';
export { default as MoneyInput } from './components/shared/MoneyInput.vue';
export { default as PdfViewer } from './components/shared/PdfViewer.vue';
export { default as ShamsiDatePicker } from './components/shared/ShamsiDatePicker.vue';
export { default as UiChildCard } from './components/shared/UiChildCard.vue';
export { default as UiParentCard } from './components/shared/UiParentCard.vue';
export { default as VPriceTextField } from './components/shared/VPriceTextField.vue';

// Components - Common
export { default as AppStepper } from './components/common/AppStepper.vue';
export { default as Loading } from './components/Loading.vue';

// Components - Layout
export { default as AppSidebar } from './components/layout/AppSidebar.vue';
export { default as AppHeader } from './components/layout/AppHeader.vue';
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

// Note: All approval, cartable, and other business logic types are excluded

// Plugin installation function (for Vue app.use())
import type { App } from 'vue';
import DigitLimit from './directives/v-digit-limit';

/**
 * Install the UI Kit library in a Vue application
 * @param app - Vue application instance
 */
export function install(app: App) {
  // Register directives globally
  app.directive('digit-limit', DigitLimit);
  // Note: v-permission directive contains app-specific logic and is not registered
}

// Default export for plugin usage
export default {
  install,
};

