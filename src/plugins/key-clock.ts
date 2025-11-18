/**
 * Keycloak Plugin Configuration
 * 
 * Generic Keycloak authentication plugin for Vue 3 application
 * This plugin can be configured by consuming applications
 */

import type { App } from 'vue'
import VueKeycloakJs from '@dsb-norge/vue-keycloak-js'

export interface KeycloakConfig {
  realm: string
  url: string
  clientId: string
}

export interface KeycloakInitOptions {
  flow?: 'standard' | 'implicit' | 'hybrid'
  checkLoginIframe?: boolean
  onLoad?: 'login-required' | 'check-sso'
  pkceMethod?: 'S256' | 'plain'
  enableLogging?: boolean
}

export interface KeycloakLogoutOptions {
  redirectUri?: string
}

export interface KeycloakCallbacks {
  onAuthLogout?: () => void
  onReady?: (keycloakInstance: any) => void
  onInitError?: (error: any) => void
  onAuthSuccess?: () => void
  onAuthError?: (error: any) => void
}

export interface KeycloakPluginOptions {
  config: KeycloakConfig
  init?: KeycloakInitOptions
  logout?: KeycloakLogoutOptions
  callbacks?: KeycloakCallbacks
  exposeGlobally?: boolean // Whether to expose Keycloak instance on window.$keycloak
}

/**
 * Setup Keycloak plugin for Vue 3 application
 * 
 * @param app - Vue application instance
 * @param options - Keycloak configuration options
 * @returns Vue app with Keycloak plugin installed
 * 
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { setupKeycloak } from '@amirjalili1374/ui-kit'
 * 
 * const app = createApp(App)
 * 
 * setupKeycloak(app, {
 *   config: {
 *     realm: 'my-realm',
 *     url: 'https://keycloak.example.com',
 *     clientId: 'my-client'
 *   },
 *   init: {
 *     onLoad: 'login-required',
 *     pkceMethod: 'S256'
 *   },
 *   callbacks: {
 *     onReady: (keycloak) => {
 *       console.log('Keycloak ready')
 *     }
 *   }
 * })
 * ```
 */
export function setupKeycloak(app: App, options: KeycloakPluginOptions) {
  const {
    config,
    init = {
      flow: 'standard',
      checkLoginIframe: false,
      onLoad: 'login-required',
      pkceMethod: 'S256',
    },
    logout = {
      redirectUri: window.location.origin
    },
    callbacks = {},
    exposeGlobally = true
  } = options

  const pluginOptions: any = {
    config,
    init,
    logout,
    onAuthLogout: callbacks.onAuthLogout || (() => {
      if (init.enableLogging) {
        console.log('User logged out from Keycloak')
      }
    }),
    onReady: (keycloakInstance: any) => {
      // Expose Keycloak instance globally if requested
      if (exposeGlobally) {
        (window as any).$keycloak = keycloakInstance
        if (init.enableLogging) {
          console.log('Keycloak ready, instance exposed globally')
        }
      }
      // Call user-provided callback
      callbacks.onReady?.(keycloakInstance)
    },
    onInitError: (error: any) => {
      if (init.enableLogging !== false) {
        console.error('Keycloak initialization error:', error)
      }
      callbacks.onInitError?.(error)
    },
  }

  // Add optional callbacks if provided
  if (callbacks.onAuthSuccess) {
    pluginOptions.onAuthSuccess = callbacks.onAuthSuccess
  }
  if (callbacks.onAuthError) {
    pluginOptions.onAuthError = callbacks.onAuthError
  }

  return app.use(VueKeycloakJs, pluginOptions)
}
