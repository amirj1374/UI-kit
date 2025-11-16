/**
 * Keycloak Plugin Configuration
 * 
 * Keycloak authentication plugin for Vue 3 application
 */

import type { App } from 'vue'
import VueKeycloakJs from '@dsb-norge/vue-keycloak-js'

export function setupKeycloak(app: App) {
  return app.use(VueKeycloakJs, {
    config: {
      realm: 'master',
      url: 'http://192.168.251.72:8080',
      clientId: 'FACILITY',
    },
    init: {
      flow: 'standard',
      checkLoginIframe: false,
      onLoad: 'login-required',
      pkceMethod: 'S256',
    },
    logout: {
      redirectUri: window.location.origin
    },
    onAuthLogout: () => {
      console.log('User logged out from Keycloak')
      // You can add additional cleanup here if needed
    },
    onReady: (keycloakInstance) => {
      // Expose Keycloak instance globally for axios interceptor
      (window as any).$keycloak = keycloakInstance;
      console.log('Keycloak ready, instance exposed globally');
    },
    onInitError: (error) => {
      console.error('Keycloak initialization error:', error);
    },
  })
}
