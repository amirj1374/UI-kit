# Refactored main.ts using bootstrapApp

Here's your main.ts refactored to use `bootstrapApp`:

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import vuetify from './plugins/vuetify'
import '@/scss/style.scss'

// UI Kit
import '@amirjalili1374/ui-kit/dist/style.css'
import { 
  bootstrapApp, 
  DigitLimit, 
  configureAxiosInstance,
  type JwtConfig,
  type KeycloakInitializerConfig,
  type InitializerModeConfig
} from '@amirjalili1374/ui-kit'

// Plugins
import VueApexCharts from 'vue3-apexcharts'
import print from 'vue3-print-nb'
import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker'

// Directives
import { vPermission } from '@/directives/v-permission'

// Services
import { api } from '@/services/api'
import { initializeApp, startInitialization } from '@/utils/appInitializer'

// Config
import axios from 'axios'
import { apiConfig } from '@/config/envConfig'
import envConfig from '@/config/envConfig'

// Keycloak types
import type { VueKeycloakInstance } from '@dsb-norge/vue-keycloak-js'

// Create app and pinia
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// ============================================================================
// Configure Axios BEFORE bootstrap (critical for UI kit components)
// ============================================================================

// Set default axios configuration
axios.defaults.baseURL = apiConfig.baseURL
axios.defaults.timeout = 5000
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Request interceptor for auth tokens
const requestInterceptor = (config: any) => {
  console.log('🔐 Axios interceptor called for:', config.url)

  // In JWT mode: ONLY use localStorage token, NO Keycloak
  if (envConfig.AUTH_MODE === 'jwt') {
    const jwtToken = localStorage.getItem("authToken")
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`
      console.log('✅ JWT token added to request')
    } else {
      delete config.headers.Authorization
      console.info('ℹ️ No JWT token found')
    }
    return config
  }

  // For Keycloak mode: use Keycloak token with localStorage fallback
  const keycloakInstance = (window as any).$keycloak
  const keycloakToken = keycloakInstance?.token || null
  if (keycloakToken) {
    config.headers.Authorization = `Bearer ${keycloakToken}`
    console.log('✅ Keycloak token added to request')
  } else {
    // Fallback to localStorage token if Keycloak token is not available
    const fallbackToken = localStorage.getItem("authToken")
    if (fallbackToken) {
      config.headers.Authorization = `Bearer ${fallbackToken}`
      console.log('✅ Fallback token added to request')
    } else {
      delete config.headers.Authorization
      console.warn('⚠️ No auth token found')
    }
  }

  return config
}

axios.interceptors.request.use(requestInterceptor, (error) => {
  return Promise.reject(error)
})

// Patch axios.create() to ensure all new instances also get our interceptors
const originalCreate = axios.create
axios.create = function(config: any) {
  const instance = originalCreate.call(this, config)
  // Add our interceptors to the new instance
  instance.interceptors.request.use(requestInterceptor)
  console.log('🔧 Patched axios.create() - new instance will have auth interceptors')
  return instance
}

// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle 401 errors - redirect to login or refresh token
      if (envConfig.AUTH_MODE === 'jwt') {
        localStorage.removeItem("authToken")
        // Avoid redirect loops: don't redirect if already on an auth route
        if (!window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/login'
        }
      } else if (envConfig.AUTH_MODE === 'keycloak') {
        const keycloakInstance = (window as any).$keycloak
        if (keycloakInstance?.keycloak) {
          await keycloakInstance.keycloak.login()
        }
      }
    }
    return Promise.reject(error)
  }
)

// Configure UI kit to use the configured axios instance
configureAxiosInstance(axios)

// ============================================================================
// Bootstrap Configuration
// ============================================================================

const authMode = envConfig.AUTH_MODE ?? 'keycloak'

// Prepare auth config based on mode
let authConfig: KeycloakInitializerConfig | JwtConfig | InitializerModeConfig

if (authMode === 'keycloak') {
  authConfig = {
    mode: 'keycloak',
    keycloakOptions: {
      config: {
        realm: envConfig.KEYCLOAK_REALM || 'master',
        url: envConfig.KEYCLOAK_URL || 'http://localhost:8080',
        clientId: envConfig.KEYCLOAK_CLIENT_ID || 'client'
      },
      init: {
        flow: 'standard',
        checkLoginIframe: false,
        onLoad: 'login-required',
        pkceMethod: 'S256'
      },
      callbacks: {
        onReady: (keycloak) => {
          console.log('✅ Keycloak ready')
        }
      },
      exposeGlobally: true
    },
    onError: (error) => {
      console.error('Keycloak error:', error)
    }
  }
} else if (authMode === 'jwt') {
  authConfig = {
    mode: 'jwt',
    getUserInfo: async () => {
      // Avoid triggering account check while already on auth pages
      if (window.location.pathname.startsWith('/auth')) {
        console.info('ℹ️ Skipping getAccount on auth route')
        return { data: null }
      }
      return await api.auth.getAccount()
    },
    setUser: async (user) => {
      const { useAuthStore } = await import('@/stores/auth')
      const authStore = useAuthStore()
      authStore.user = user
    },
    setUserInStorage: (user) => {
      localStorage.setItem('user', JSON.stringify(user))
    },
    onError: (error: any) => {
      // 401 errors are handled by axios interceptor
      if (error?.response?.status !== 401) {
        console.warn('⚠️ getAccount API call failed:', error.message)
      }
    }
  }
} else if (authMode === 'initializer' || authMode === 'dev') {
  // Initializer/Dev mode
  authConfig = {
    mode: authMode, // TypeScript now knows this is 'initializer' | 'dev'
    appInitializer: {
      initializeApp: async () => {
        return await initializeApp()
      },
      startInitialization: async () => {
        await startInitialization()
      }
    },
    setLoading: async (loading: boolean) => {
      const { useCustomizerStore } = await import('@amirjalili1374/ui-kit')
      const customizer = useCustomizerStore()
      customizer.SET_LOADING(loading)
    },
    redirectToLogin: async () => {
      if (router.currentRoute.value.path !== '/auth/login') {
        await router.push('/auth/login')
      }
    },
    currentRoutePath: router.currentRoute.value.path,
    loginRoutePath: '/auth/login',
    onError: (error) => {
      console.error('Initialization error:', error)
    }
  }
} else {
  throw new Error(`Unknown auth mode: ${authMode}`)
}

// ============================================================================
// Bootstrap the App
// ============================================================================

bootstrapApp({
  app,
  authMode: authMode,
  authConfig: authConfig,
  plugins: {
    router,
    perfectScrollbar: PerfectScrollbarPlugin, // If using vue3-perfect-scrollbar plugin
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
    console.log('🚀 Bootstrap starting with authMode:', authMode)
  },
  onBootstrapComplete: async () => {
    console.log('✅ Bootstrap completed successfully')
    
    // Dev mode: force loading to false after bootstrap
    if (authMode === 'dev') {
      console.log('🔧 Dev mode: setting loading to false')
      const { useCustomizerStore } = await import('@amirjalili1374/ui-kit')
      const customizer = useCustomizerStore()
      customizer.SET_LOADING(false)
      console.log('✅ Loading set to false, current state:', customizer.loading)
      // Force loading to false after a short delay to override any components that set it to true
      setTimeout(() => {
        customizer.SET_LOADING(false)
        console.log('🔄 Forced loading to false again')
      }, 100)
    }
  },
  onBootstrapError: (error) => {
    console.error('❌ Bootstrap failed:', error)
  }
}).catch((error) => {
  console.error('Bootstrap error:', error)
})

// Type declarations
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $keycloak: VueKeycloakInstance
  }
}
```

## Key Changes Made

1. ✅ **Kept all axios interceptors** - Your existing axios setup is preserved
2. ✅ **Added `configureAxiosInstance(axios)`** - Makes UI kit use your configured axios
3. ✅ **Replaced manual bootstrap** - Now uses `bootstrapApp` instead of manual `if/else`
4. ✅ **Removed `app.mount('#app')`** - `bootstrapApp` does this automatically
5. ✅ **Removed `UiKit.install(app)`** - Not needed, directives registered via config
6. ✅ **Moved dev mode loading logic** - Now in `onBootstrapComplete` callback
7. ✅ **JWT mode configured** - Matches your `.env.dev` (AUTH_MODE=jwt)

## What's Different

**Before:**
- Manual `if/else` for auth modes
- Manual plugin registration
- Manual app mounting
- Separate `UiKit.install()` call

**After:**
- Single `bootstrapApp()` call
- Centralized configuration
- Automatic plugin/directive registration
- Automatic app mounting
- Better error handling

## Your Current Setup (JWT Mode)

Since your `.env.dev` has `VITE_AUTH_MODE=jwt`, the JWT config will be used:
- Calls `api.auth.getAccount()` on bootstrap
- Sets user in store and localStorage
- Handles 401 errors via axios interceptor
- Skips auth check on `/auth` routes

This refactored version maintains all your existing functionality while using the new `bootstrapApp` system!

