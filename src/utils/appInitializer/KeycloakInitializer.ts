/**
 * Keycloak authentication mode initializer
 */

import type { App } from 'vue';
import { setupKeycloak } from '../../plugins/key-clock';
import type { KeycloakPluginOptions } from '../../plugins/key-clock';
import { AuthModeInitializer, type AuthMode, type AuthModeConfig } from './AuthModeInitializer';

export interface KeycloakConfig extends AuthModeConfig {
  mode: 'keycloak';
  keycloakOptions: KeycloakPluginOptions;
}

export class KeycloakInitializer extends AuthModeInitializer {
  private app: App;
  private keycloakOptions: KeycloakPluginOptions;

  constructor(app: App, config: KeycloakConfig) {
    super(config);
    this.app = app;
    this.keycloakOptions = config.keycloakOptions;
  }

  getMode(): AuthMode {
    return 'keycloak';
  }

  async initialize(): Promise<void> {
    try {
      console.log('🔐 Initializing Keycloak authentication...');
      
      setupKeycloak(this.app, this.keycloakOptions);
      
      console.log('✅ Keycloak initialized successfully');
      this.handleSuccess();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}

