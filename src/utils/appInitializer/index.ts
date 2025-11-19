/**
 * App Initializer Module
 * 
 * Provides classes and utilities for initializing Vue applications
 * with different authentication modes and plugin configurations.
 */

export { AuthModeInitializer } from './AuthModeInitializer';
export type { AuthMode, AuthModeConfig } from './AuthModeInitializer';

export { KeycloakInitializer } from './KeycloakInitializer';
export type { KeycloakConfig } from './KeycloakInitializer';

export { JwtInitializer } from './JwtInitializer';
export type { JwtConfig } from './JwtInitializer';

export { InitializerModeInitializer } from './InitializerModeInitializer';
export type {
  AppInitializationResult,
  AppInitializer,
  InitializerModeConfig
} from './InitializerModeInitializer';

export { AppBootstrap, bootstrapApp } from './AppBootstrap';
export type {
  PluginConfig,
  DirectiveConfig,
  ComponentConfig,
  AppBootstrapConfig
} from './AppBootstrap';

