/**
 * App Bootstrap Manager
 * 
 * Orchestrates the initialization of Vue app with different authentication modes
 * and plugin registration.
 */

import type { App } from 'vue';
import { KeycloakInitializer, type KeycloakConfig } from './KeycloakInitializer';
import { JwtInitializer, type JwtConfig } from './JwtInitializer';
import { InitializerModeInitializer, type InitializerModeConfig } from './InitializerModeInitializer';
import type { AuthMode } from './AuthModeInitializer';

export interface PluginConfig {
  router?: any;
  perfectScrollbar?: any;
  print?: any;
  vueApexCharts?: any;
  vue3PersianDatetimePicker?: any;
  vuetify?: any;
  customPlugins?: Array<{ plugin: any; options?: any }>;
}

export interface DirectiveConfig {
  digitLimit?: any;
  permission?: any;
  customDirectives?: Array<{ name: string; directive: any }>;
}

export interface ComponentConfig {
  vue3PersianDatetimePicker?: any;
  customComponents?: Array<{ name: string; component: any }>;
}

export interface AppBootstrapConfig {
  app: App;
  authMode: AuthMode | string;
  authConfig: KeycloakConfig | JwtConfig | InitializerModeConfig;
  plugins?: PluginConfig;
  directives?: DirectiveConfig;
  components?: ComponentConfig;
  onBootstrapStart?: () => void;
  onBootstrapComplete?: () => void;
  onBootstrapError?: (error: unknown) => void;
}

export class AppBootstrap {
  private app: App;
  private authMode: string;
  private authConfig: KeycloakConfig | JwtConfig | InitializerModeConfig;
  private plugins?: PluginConfig;
  private directives?: DirectiveConfig;
  private components?: ComponentConfig;
  private onBootstrapStart?: () => void;
  private onBootstrapComplete?: () => void;
  private onBootstrapError?: (error: unknown) => void;

  constructor(config: AppBootstrapConfig) {
    this.app = config.app;
    this.authMode = config.authMode;
    this.authConfig = config.authConfig;
    this.plugins = config.plugins;
    this.directives = config.directives;
    this.components = config.components;
    this.onBootstrapStart = config.onBootstrapStart;
    this.onBootstrapComplete = config.onBootstrapComplete;
    this.onBootstrapError = config.onBootstrapError;
  }

  /**
   * Start the bootstrap process
   */
  async bootstrap(): Promise<void> {
    try {
      this.onBootstrapStart?.();
      console.log('🚀 Bootstrap starting with authMode:', this.authMode);

      // Step 1: Initialize authentication
      await this.initializeAuth();

      // Step 2: Register plugins
      this.registerPlugins();

      // Step 3: Register directives
      this.registerDirectives();

      // Step 4: Register components
      this.registerComponents();

      // Step 5: Mount the app
      this.mountApp();

      this.onBootstrapComplete?.();
      console.log('✅ Bootstrap completed successfully');
    } catch (error) {
      console.error('❌ Bootstrap error:', error);
      this.onBootstrapError?.(error);
      throw error;
    }
  }

  /**
   * Initialize authentication based on mode
   */
  private async initializeAuth(): Promise<void> {
    let initializer: KeycloakInitializer | JwtInitializer | InitializerModeInitializer;

    switch (this.authMode) {
      case 'keycloak':
        if (!('keycloakOptions' in this.authConfig)) {
          throw new Error('Keycloak config must include keycloakOptions');
        }
        initializer = new KeycloakInitializer(this.app, this.authConfig as KeycloakConfig);
        break;

      case 'jwt':
        initializer = new JwtInitializer(this.authConfig as JwtConfig);
        break;

      case 'initializer':
      case 'dev':
        initializer = new InitializerModeInitializer(this.app, this.authConfig as InitializerModeConfig);
        break;

      default:
        throw new Error(`Unknown auth mode: ${this.authMode}`);
    }

    await initializer.initialize();
  }

  /**
   * Register Vue plugins
   */
  private registerPlugins(): void {
    if (!this.plugins) return;

    if (this.plugins.router) {
      this.app.use(this.plugins.router);
    }

    if (this.plugins.perfectScrollbar) {
      this.app.use(this.plugins.perfectScrollbar);
    }

    if (this.plugins.print) {
      this.app.use(this.plugins.print);
    }

    if (this.plugins.vueApexCharts) {
      this.app.use(this.plugins.vueApexCharts);
    }

    if (this.plugins.vuetify) {
      this.app.use(this.plugins.vuetify);
    }

    if (this.plugins.customPlugins) {
      this.plugins.customPlugins.forEach(({ plugin, options }) => {
        if (options) {
          this.app.use(plugin, options);
        } else {
          this.app.use(plugin);
        }
      });
    }
  }

  /**
   * Register Vue directives
   */
  private registerDirectives(): void {
    if (!this.directives) return;

    if (this.directives.digitLimit) {
      this.app.directive('digit-limit', this.directives.digitLimit);
    }

    if (this.directives.permission) {
      this.app.directive('permission', this.directives.permission);
    }

    if (this.directives.customDirectives) {
      this.directives.customDirectives.forEach(({ name, directive }) => {
        this.app.directive(name, directive);
      });
    }
  }

  /**
   * Register Vue components
   */
  private registerComponents(): void {
    if (!this.components) return;

    if (this.components.vue3PersianDatetimePicker) {
      this.app.component('Vue3PersianDatetimePicker', this.components.vue3PersianDatetimePicker);
    }

    if (this.components.customComponents) {
      this.components.customComponents.forEach(({ name, component }) => {
        this.app.component(name, component);
      });
    }
  }

  /**
   * Mount the Vue app
   */
  private mountApp(): void {
    this.app.mount('#app');
  }
}

/**
 * Convenience function to create and run bootstrap
 */
export async function bootstrapApp(config: AppBootstrapConfig): Promise<void> {
  const bootstrap = new AppBootstrap(config);
  await bootstrap.bootstrap();
}

