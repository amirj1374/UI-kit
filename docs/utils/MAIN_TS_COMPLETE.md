# Complete main.ts Example with bootstrapApp

This is a production-ready `main.ts` that can be used across all your projects with the UI kit.

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
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar'

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
    onError: (error: any) => {
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
    perfectScrollbar: PerfectScrollbarPlugin, // Register PerfectScrollbar plugin
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

## Key Points for Reusability

### ✅ What to Customize Per Project

1. **Environment Config**: Update `envConfig` imports and values
2. **API Service**: Update `api` import path
3. **Stores**: Update store import paths (`@/stores/auth`, etc.)
4. **Router**: Update router import path
5. **Vuetify Config**: Update vuetify import path
6. **Directives**: Add/remove custom directives as needed
7. **Plugins**: Add/remove plugins as needed

### ✅ What Stays the Same

1. **Axios Setup**: The interceptor logic can be reused
2. **Bootstrap Pattern**: The `bootstrapApp` call structure
3. **Auth Config Logic**: The if/else structure for auth modes
4. **Error Handling**: The error handling patterns

### ✅ PerfectScrollbar Note

If you're using `vue3-perfect-scrollbar` as a **component** (not plugin), you can register it manually:

```typescript
// Before bootstrapApp
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
app.component('perfect-scrollbar', PerfectScrollbar)
```

If you're using it as a **plugin**, register it in `bootstrapApp`:

```typescript
// In bootstrapApp plugins config
plugins: {
  perfectScrollbar: PerfectScrollbarPlugin,
  // ...
}
```

## Usage Across Projects

1. **Copy this template** to your new project
2. **Update import paths** to match your project structure
3. **Configure auth mode** via environment variables
4. **Add/remove plugins** as needed
5. **Customize auth config** based on your requirements

This pattern is **100% reusable** across all your projects! 🚀

