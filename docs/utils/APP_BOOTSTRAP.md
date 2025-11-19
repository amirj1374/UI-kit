# App Bootstrap

A comprehensive class-based system for initializing Vue applications with different authentication modes and plugin configurations.

## Overview

The App Bootstrap system provides:
- **Multiple authentication modes**: Keycloak, JWT, Initializer/Dev
- **Plugin management**: Automatic registration of Vue plugins
- **Directive registration**: Easy directive setup
- **Component registration**: Global component registration
- **Error handling**: Centralized error handling and callbacks

## Authentication Modes

- **Keycloak**: Uses Keycloak for authentication
- **JWT**: Uses JWT tokens with API-based user info retrieval
- **Initializer**: Uses custom AppInitializer pattern for app setup (with authentication)
- **Dev**: Development mode - **NO authentication required**, uses AppInitializer for app setup only

---

## Complete Usage Examples

### 1. Keycloak Mode - Complete Example

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { bootstrapApp, type KeycloakConfig } from '@amirjalili1374/ui-kit'
import App from './App.vue'

// Import plugins
import PerfectScrollbarPlugin from 'vue3-perfect-scrollbar'
import print from 'vue3-print-nb'
import VueApexCharts from 'vue3-apexcharts'
import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker'

// Import directives
import { DigitLimit } from '@amirjalili1374/ui-kit'
import { vPermission } from '@/directives/v-permission' // Your custom directive

// Import styles
import '@amirjalili1374/ui-kit/dist/style.css'
import 'vuetify/styles'

// Create app and plugins
const app = createApp(App)
const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Your routes
  ]
})
const vuetify = createVuetify({
  components,
  directives
})

// Use Pinia before bootstrap
app.use(pinia)

// Configure Keycloak
const keycloakConfig: KeycloakConfig = {
  mode: 'keycloak',
  keycloakOptions: {
    config: {
      realm: 'my-realm',
      url: 'https://keycloak.example.com',
      clientId: 'my-client'
    },
    init: {
      flow: 'standard',
      checkLoginIframe: false,
      onLoad: 'login-required',
      pkceMethod: 'S256',
      enableLogging: true
    },
    logout: {
      redirectUri: window.location.origin
    },
    callbacks: {
      onReady: (keycloak) => {
        console.log('✅ Keycloak ready!', keycloak)
        // Initialize your app after Keycloak is ready
      },
      onAuthSuccess: () => {
        console.log('✅ Authentication successful')
      },
      onAuthError: (error) => {
        console.error('❌ Authentication error:', error)
      },
      onAuthLogout: () => {
        console.log('👋 User logged out')
        // Handle logout (e.g., redirect to login)
      },
      onInitError: (error) => {
        console.error('❌ Keycloak initialization error:', error)
      }
    },
    exposeGlobally: true // Exposes window.$keycloak
  },
  onError: (error) => {
    console.error('Keycloak config error:', error)
  },
  onSuccess: () => {
    console.log('Keycloak initialization completed')
  }
}

// Bootstrap the app
bootstrapApp({
  app,
  authMode: 'keycloak',
  authConfig: keycloakConfig,
  plugins: {
    router,
    perfectScrollbar: PerfectScrollbarPlugin,
    print,
    vueApexCharts: VueApexCharts,
    vuetify
  },
  directives: {
    digitLimit: DigitLimit,
    permission: vPermission
  },
  components: {
    vue3PersianDatetimePicker: Vue3PersianDatetimePicker
  },
  onBootstrapStart: () => {
    console.log('🚀 Bootstrap starting...')
  },
  onBootstrapComplete: () => {
    console.log('✅ Bootstrap completed successfully!')
  },
  onBootstrapError: (error) => {
    console.error('❌ Bootstrap failed:', error)
  }
}).catch((error) => {
  console.error('Fatal bootstrap error:', error)
})
```

---

### 2. JWT Mode - Complete Example

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { bootstrapApp, type JwtConfig } from '@amirjalili1374/ui-kit'
import App from './App.vue'

// Import plugins
import PerfectScrollbarPlugin from 'vue3-perfect-scrollbar'
import print from 'vue3-print-nb'
import VueApexCharts from 'vue3-apexcharts'
import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker'

// Import directives
import { DigitLimit } from '@amirjalili1374/ui-kit'
import { vPermission } from '@/directives/v-permission'

// Import API service
import { api } from '@/services/api'

// Import stores
import { useAuthStore } from '@/stores/auth'

// Import styles
import '@amirjalili1374/ui-kit/dist/style.css'
import 'vuetify/styles'

// Create app and plugins
const app = createApp(App)
const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Your routes
  ]
})
const vuetify = createVuetify({
  components,
  directives
})

// Use Pinia before bootstrap
app.use(pinia)

// Configure JWT authentication
const jwtConfig: JwtConfig = {
  mode: 'jwt',
  getUserInfo: async () => {
    // Your API call to get user info
    try {
      const response = await api.user.getUserInfo()
      return response
    } catch (error: any) {
      // Return error response for handling
      throw error
    }
  },
  setUser: (user) => {
    // Set user in your store
    const authStore = useAuthStore()
    authStore.user = user
    console.log('✅ User set in store:', user)
  },
  setUserInStorage: (user) => {
    // Optionally store user in localStorage
    localStorage.setItem('user', JSON.stringify(user))
    console.log('✅ User stored in localStorage')
  },
  onError: (error: any) => {
    // Handle errors (401 is expected if user is not authenticated)
    if (error?.response?.status !== 401) {
      console.error('JWT auth error:', error)
    }
  },
  onSuccess: () => {
    console.log('✅ JWT authentication completed')
  }
}

// Bootstrap the app
bootstrapApp({
  app,
  authMode: 'jwt',
  authConfig: jwtConfig,
  plugins: {
    router,
    perfectScrollbar: PerfectScrollbarPlugin,
    print,
    vueApexCharts: VueApexCharts,
    vuetify
  },
  directives: {
    digitLimit: DigitLimit,
    permission: vPermission
  },
  components: {
    vue3PersianDatetimePicker: Vue3PersianDatetimePicker
  },
  onBootstrapStart: () => {
    console.log('🚀 Bootstrap starting with JWT mode...')
  },
  onBootstrapComplete: () => {
    console.log('✅ Bootstrap completed successfully!')
  },
  onBootstrapError: (error) => {
    console.error('❌ Bootstrap failed:', error)
  }
}).catch((error) => {
  console.error('Fatal bootstrap error:', error)
})
```

---

### 3. Initializer Mode - Complete Example

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { bootstrapApp, type InitializerModeConfig, type AppInitializer } from '@amirjalili1374/ui-kit'
import App from './App.vue'

// Import plugins
import PerfectScrollbarPlugin from 'vue3-perfect-scrollbar'
import print from 'vue3-print-nb'
import VueApexCharts from 'vue3-apexcharts'
import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker'

// Import directives
import { DigitLimit } from '@amirjalili1374/ui-kit'
import { vPermission } from '@/directives/v-permission'

// Import stores
import { useCustomizerStore } from '@/stores/customizer'

// Import your AppInitializer implementation
import { MyAppInitializer } from '@/utils/MyAppInitializer'

// Import styles
import '@amirjalili1374/ui-kit/dist/style.css'
import 'vuetify/styles'

// Create app and plugins
const app = createApp(App)
const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Your routes
  ]
})
const vuetify = createVuetify({
  components,
  directives
})

// Use Pinia before bootstrap
app.use(pinia)

// Create AppInitializer instance
const appInitializer: AppInitializer = new MyAppInitializer({
  // Your initializer options
})

// Configure Initializer mode
const initializerConfig: InitializerModeConfig = {
  mode: 'initializer',
  appInitializer: appInitializer,
  setLoading: (loading: boolean) => {
    const customizer = useCustomizerStore()
    customizer.SET_LOADING(loading)
  },
  redirectToLogin: async () => {
    // Redirect to login on initialization failure
    if (router.currentRoute.value.path !== '/auth/login') {
      await router.push('/auth/login')
    }
  },
  currentRoutePath: router.currentRoute.value.path,
  loginRoutePath: '/auth/login',
  onError: (error) => {
    console.error('Initialization error:', error)
  },
  onSuccess: () => {
    console.log('✅ App initialization completed')
  }
}

// Bootstrap the app
bootstrapApp({
  app,
  authMode: 'initializer',
  authConfig: initializerConfig,
  plugins: {
    router,
    perfectScrollbar: PerfectScrollbarPlugin,
    print,
    vueApexCharts: VueApexCharts,
    vuetify
  },
  directives: {
    digitLimit: DigitLimit,
    permission: vPermission
  },
  components: {
    vue3PersianDatetimePicker: Vue3PersianDatetimePicker
  },
  onBootstrapStart: () => {
    console.log('🚀 Bootstrap starting with Initializer mode...')
  },
  onBootstrapComplete: () => {
    console.log('✅ Bootstrap completed successfully!')
  },
  onBootstrapError: (error) => {
    console.error('❌ Bootstrap failed:', error)
  }
}).catch((error) => {
  console.error('Fatal bootstrap error:', error)
})
```

**Example AppInitializer Implementation:**

```typescript
// utils/MyAppInitializer.ts
import type { AppInitializer, AppInitializationResult } from '@amirjalili1374/ui-kit'

export class MyAppInitializer implements AppInitializer {
  private initializationPromise: Promise<AppInitializationResult> | null = null
  private resolveInit: ((value: AppInitializationResult) => void) | null = null
  private rejectInit: ((reason?: any) => void) | null = null
  private isInitializing = false

  async initializeApp(): Promise<AppInitializationResult> {
    if (this.initializationPromise) {
      return this.initializationPromise
    }

    this.initializationPromise = new Promise<AppInitializationResult>((resolve, reject) => {
      this.resolveInit = resolve
      this.rejectInit = reject
    })

    this.isInitializing = true
    return this.initializationPromise
  }

  async startInitialization(): Promise<void> {
    if (!this.isInitializing) {
      return
    }

    try {
      // Your initialization logic here
      // e.g., load user data, fetch configuration, etc.
      
      const userData = await this.loadUserData()
      const appConfig = await this.loadAppConfig()
      
      const result: AppInitializationResult = {
        user: userData,
        config: appConfig,
        initialized: true
      }

      this.resolveInit?.(result)
      this.isInitializing = false
    } catch (error) {
      this.rejectInit?.(error)
      this.isInitializing = false
      throw error
    }
  }

  private async loadUserData() {
    // Your user data loading logic
    return { /* user data */ }
  }

  private async loadAppConfig() {
    // Your app config loading logic
    return { /* app config */ }
  }
}
```

---

### 4. Dev Mode - Complete Example (NO Authentication)

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { bootstrapApp, type InitializerModeConfig, type AppInitializer } from '@amirjalili1374/ui-kit'
import App from './App.vue'

// Import plugins
import PerfectScrollbarPlugin from 'vue3-perfect-scrollbar'
import print from 'vue3-print-nb'
import VueApexCharts from 'vue3-apexcharts'
import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker'

// Import directives
import { DigitLimit } from '@amirjalili1374/ui-kit'
import { vPermission } from '@/directives/v-permission'

// Import stores
import { useCustomizerStore } from '@/stores/customizer'

// Import your Dev AppInitializer (no auth required)
import { DevAppInitializer } from '@/utils/DevAppInitializer'

// Import styles
import '@amirjalili1374/ui-kit/dist/style.css'
import 'vuetify/styles'

// Create app and plugins
const app = createApp(App)
const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Your routes
  ]
})
const vuetify = createVuetify({
  components,
  directives
})

// Use Pinia before bootstrap
app.use(pinia)

// Create Dev AppInitializer instance (no authentication)
const appInitializer: AppInitializer = new DevAppInitializer({
  // Dev mode options - no auth required
})

// Configure Dev mode (NO AUTHENTICATION)
const devConfig: InitializerModeConfig = {
  mode: 'dev', // Dev mode - no authentication
  appInitializer: appInitializer,
  setLoading: (loading: boolean) => {
    const customizer = useCustomizerStore()
    customizer.SET_LOADING(loading)
    // In dev mode, loading is automatically set to false after initialization
  },
  // No redirectToLogin needed in dev mode (no auth)
  onError: (error) => {
    console.error('Dev mode initialization error:', error)
  },
  onSuccess: () => {
    console.log('✅ Dev mode initialization completed (no auth required)')
  }
}

// Bootstrap the app
bootstrapApp({
  app,
  authMode: 'dev', // Dev mode - skips authentication
  authConfig: devConfig,
  plugins: {
    router,
    perfectScrollbar: PerfectScrollbarPlugin,
    print,
    vueApexCharts: VueApexCharts,
    vuetify
  },
  directives: {
    digitLimit: DigitLimit,
    permission: vPermission
  },
  components: {
    vue3PersianDatetimePicker: Vue3PersianDatetimePicker
  },
  onBootstrapStart: () => {
    console.log('🚀 Bootstrap starting in DEV mode (no authentication)...')
  },
  onBootstrapComplete: () => {
    console.log('✅ Bootstrap completed successfully! (Dev mode - no auth)')
  },
  onBootstrapError: (error) => {
    console.error('❌ Bootstrap failed:', error)
  }
}).catch((error) => {
  console.error('Fatal bootstrap error:', error)
})
```

**Example Dev AppInitializer Implementation (No Auth):**

```typescript
// utils/DevAppInitializer.ts
import type { AppInitializer, AppInitializationResult } from '@amirjalili1374/ui-kit'

export class DevAppInitializer implements AppInitializer {
  private initializationPromise: Promise<AppInitializationResult> | null = null
  private resolveInit: ((value: AppInitializationResult) => void) | null = null
  private isInitializing = false

  async initializeApp(): Promise<AppInitializationResult> {
    if (this.initializationPromise) {
      return this.initializationPromise
    }

    this.initializationPromise = new Promise<AppInitializationResult>((resolve) => {
      this.resolveInit = resolve
    })

    this.isInitializing = true
    return this.initializationPromise
  }

  async startInitialization(): Promise<void> {
    if (!this.isInitializing) {
      return
    }

    try {
      // Dev mode: Just load app configuration, no user authentication
      console.log('🔧 Dev mode: Loading app configuration (no auth)...')
      
      // Simulate loading app config
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const appConfig = {
        theme: 'light',
        language: 'en',
        features: {
          // Your dev features
        }
      }
      
      const result: AppInitializationResult = {
        config: appConfig,
        initialized: true,
        devMode: true,
        // No user data in dev mode
      }

      this.resolveInit?.(result)
      this.isInitializing = false
      
      console.log('✅ Dev mode initialization completed (no authentication)')
    } catch (error) {
      this.isInitializing = false
      throw error
    }
  }
}
```

---

## Environment-Based Configuration

You can dynamically select the auth mode based on environment:

```typescript
// main.ts
import { bootstrapApp, type AuthMode } from '@amirjalili1374/ui-kit'
import envConfig from '@/config/envConfig'

// Determine auth mode from environment
const authMode: AuthMode = (envConfig.AUTH_MODE ?? 'keycloak') as AuthMode

console.log('🔐 Resolved auth mode:', authMode)

// Create appropriate config based on mode
let authConfig: any

if (authMode === 'keycloak') {
  authConfig = {
    mode: 'keycloak',
    keycloakOptions: {
      config: {
        realm: envConfig.KEYCLOAK_REALM,
        url: envConfig.KEYCLOAK_URL,
        clientId: envConfig.KEYCLOAK_CLIENT_ID
      }
    }
  }
} else if (authMode === 'jwt') {
  authConfig = {
    mode: 'jwt',
    getUserInfo: async () => await api.user.getUserInfo(),
    setUser: (user) => {
      const authStore = useAuthStore()
      authStore.user = user
    }
  }
} else if (authMode === 'dev') {
  // Dev mode - no authentication
  authConfig = {
    mode: 'dev',
    appInitializer: new DevAppInitializer()
  }
} else {
  // Initializer mode
  authConfig = {
    mode: 'initializer',
    appInitializer: new MyAppInitializer()
  }
}

// Bootstrap with selected mode
await bootstrapApp({
  app,
  authMode,
  authConfig,
  plugins: { /* ... */ },
  directives: { /* ... */ },
  components: { /* ... */ }
})
```

---

## API Reference

### `bootstrapApp(config: AppBootstrapConfig): Promise<void>`

Convenience function to create and run bootstrap.

### `AppBootstrap`

Main bootstrap class that orchestrates initialization.

**Methods:**
- `bootstrap()`: Start the bootstrap process

### `AuthModeInitializer`

Abstract base class for authentication mode initializers.

**Subclasses:**
- `KeycloakInitializer` - Handles Keycloak authentication
- `JwtInitializer` - Handles JWT token authentication
- `InitializerModeInitializer` - Handles custom app initialization (with or without auth)

## Type Definitions

- `AuthMode`: `'keycloak' | 'jwt' | 'initializer' | 'dev'`
- `KeycloakConfig` - Configuration for Keycloak mode
- `JwtConfig` - Configuration for JWT mode
- `InitializerModeConfig` - Configuration for Initializer/Dev mode
- `AppBootstrapConfig` - Main bootstrap configuration
- `PluginConfig` - Plugin registration configuration
- `DirectiveConfig` - Directive registration configuration
- `ComponentConfig` - Component registration configuration
- `AppInitializer` - Interface for custom app initializers
- `AppInitializationResult` - Result type for app initialization

## Notes

- **Dev Mode**: Does NOT require authentication. It only initializes the app with basic configuration.
- **Initializer Mode**: Can include authentication logic in your custom `AppInitializer` implementation.
- **Pinia**: Should be registered before calling `bootstrapApp()`.
- **Error Handling**: All modes support error callbacks for centralized error handling.
- **Loading States**: Use `setLoading` callback in Initializer/Dev modes to manage loading states.
