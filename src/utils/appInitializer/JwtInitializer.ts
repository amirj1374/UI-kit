/**
 * JWT authentication mode initializer
 */

import type { AxiosInstance } from 'axios';
import { AuthModeInitializer, type AuthMode, type AuthModeConfig } from './AuthModeInitializer';

export interface JwtConfig extends AuthModeConfig {
  mode: 'jwt';
  getUserInfo: () => Promise<{ data?: any }>;
  setUser: (user: any) => void;
  setUserInStorage?: (user: any) => void;
  axiosInstance?: AxiosInstance;
}

export class JwtInitializer extends AuthModeInitializer {
  constructor(config: JwtConfig) {
    super(config);
  }

  protected get jwtConfig(): JwtConfig {
    return this.config as JwtConfig;
  }

  getMode(): AuthMode {
    return 'jwt';
  }

  async initialize(): Promise<void> {
    try {
      console.log('🔐 Initializing JWT authentication...');

      const response = await this.jwtConfig.getUserInfo();

      if (response?.data) {
        this.jwtConfig.setUser(response.data);

        if (this.jwtConfig.setUserInStorage) {
          this.jwtConfig.setUserInStorage(response.data);
        }

        console.log('✅ JWT authentication initialized successfully');
        this.handleSuccess();
      } else {
        throw new Error('No user data received from getUserInfo');
      }
    } catch (error: any) {
      // Don't throw on 401 errors (user not authenticated yet)
      if (error?.response?.status === 401) {
        console.log('ℹ️ User not authenticated (401), continuing...');
        this.handleSuccess();
        return;
      }

      // Log other errors but don't fail initialization
      if (error?.response?.status !== 401) {
        console.warn('⚠️ getUserInfo API call failed:', error?.message ?? error);
      }

      this.handleError(error);
      // Don't throw - allow app to continue
    }
  }
}

