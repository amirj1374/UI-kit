/**
 * Abstract base class for authentication mode initializers
 * 
 * Each authentication mode (keycloak, jwt, initializer/dev) should extend this class
 * and implement the initialization logic.
 */

export type AuthMode = 'keycloak' | 'jwt' | 'initializer' | 'dev';

export interface AuthModeConfig {
  mode: AuthMode;
  onError?: (error: unknown) => void;
  onSuccess?: () => void;
}

export abstract class AuthModeInitializer {
  protected config: AuthModeConfig;

  constructor(config: AuthModeConfig) {
    this.config = config;
  }

  /**
   * Initialize the authentication mode
   * This is called during app bootstrap
   */
  abstract initialize(): Promise<void>;

  /**
   * Get the authentication mode name
   */
  abstract getMode(): AuthMode;

  /**
   * Check if this initializer should handle the given mode
   */
  canHandle(mode: string): boolean {
    return this.getMode() === mode;
  }

  /**
   * Handle errors during initialization
   */
  protected handleError(error: unknown): void {
    if (this.config.onError) {
      this.config.onError(error);
    } else {
      console.error(`[${this.getMode()}] Initialization error:`, error);
    }
  }

  /**
   * Handle successful initialization
   */
  protected handleSuccess(): void {
    if (this.config.onSuccess) {
      this.config.onSuccess();
    }
  }
}

