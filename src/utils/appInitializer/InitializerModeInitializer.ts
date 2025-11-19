/**
 * Initializer/Dev mode initializer
 * Uses AppInitializer pattern for app initialization
 */

import type { App } from 'vue';
import { AuthModeInitializer, type AuthMode, type AuthModeConfig } from './AuthModeInitializer';

export interface AppInitializationResult {
  [key: string]: any;
}

export interface AppInitializer {
  initializeApp: () => Promise<AppInitializationResult>;
  startInitialization: () => Promise<void>;
}

export interface InitializerModeConfig extends AuthModeConfig {
  mode: 'initializer' | 'dev';
  appInitializer: AppInitializer;
  setLoading?: (loading: boolean) => void;
  redirectToLogin?: () => void | Promise<void>;
  currentRoutePath?: string;
  loginRoutePath?: string;
}

export class InitializerModeInitializer extends AuthModeInitializer {
  private app: App;

  constructor(app: App, config: InitializerModeConfig) {
    super(config);
    this.app = app;
  }

  protected get initializerConfig(): InitializerModeConfig {
    return this.config as InitializerModeConfig;
  }

  getMode(): AuthMode {
    return this.initializerConfig.mode;
  }

  async initialize(): Promise<void> {
    try {
      console.log('📱 Initializing app via AppInitializer...');

      const initPromise = this.initializerConfig.appInitializer.initializeApp();

      // Set loading state if callback provided
      if (this.initializerConfig.setLoading) {
        this.initializerConfig.setLoading(true);
      }

      try {
        await this.initializerConfig.appInitializer.startInitialization();
        await initPromise;

        console.log('✅ App initialization completed successfully');

        // In dev mode, force loading to false
        if (this.initializerConfig.mode === 'dev') {
          console.log('🔧 Dev mode: forcing loading false');
          if (this.initializerConfig.setLoading) {
            this.initializerConfig.setLoading(false);
            // Double-check after a short delay
            setTimeout(() => {
              if (this.initializerConfig.setLoading) {
                this.initializerConfig.setLoading(false);
              }
            }, 100);
          }
        }

        this.handleSuccess();
      } catch (error) {
        console.error('❌ App initialization failed:', error);

        // Redirect to login if callback provided
        if (this.initializerConfig.redirectToLogin) {
          const currentPath = this.initializerConfig.currentRoutePath || '';
          const loginPath = this.initializerConfig.loginRoutePath || '/auth/login';

          if (currentPath !== loginPath) {
            await this.initializerConfig.redirectToLogin();
          }
        }

        this.handleError(error);
        throw error;
      } finally {
        if (this.initializerConfig.setLoading) {
          this.initializerConfig.setLoading(false);
        }
      }
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}

