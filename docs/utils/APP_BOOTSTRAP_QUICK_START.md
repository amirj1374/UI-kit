# Quick Start: Using bootstrapApp

This is a simplified guide for quickly migrating to `bootstrapApp`. Adapt the code to your project structure.

## Step-by-Step Migration

### 1. Keep Your Axios Setup (Before bootstrapApp)

```typescript
// Keep ALL your existing axios interceptors and configuration
// This must come BEFORE bootstrapApp

import axios from 'axios'
import { apiConfig } from '@/config/envConfig'
import envConfig from '@/config/envConfig'

// Your existing axios setup
axios.defaults.baseURL = apiConfig.baseURL
// ... all your interceptors ...
```

### 2. Configure UI Kit to Use Your Axios

```typescript
import { configureAxiosInstance } from '@amirjalili1374/ui-kit'
configureAxiosInstance(axios) // Use your configured axios
```

### 3. Replace Your Bootstrap Logic

**Remove this:**
```typescript
// ❌ Remove manual auth handling
if (authMode === 'keycloak') {
  setupKeycloak(app)
} else if (authMode === 'jwt') {
  // ...
}

// ❌ Remove manual plugin registration
app.use(router)
app.use(print)
// ...

// ❌ Remove manual mount
app.mount('#app')
```

**Replace with:**
```typescript
// ✅ Use bootstrapApp
import { bootstrapApp, DigitLimit, type KeycloakConfig, type JwtConfig, type InitializerModeConfig } from '@amirjalili1374/ui-kit'

const authMode = envConfig.AUTH_MODE ?? 'keycloak'

// Create auth config based on your mode
let authConfig: KeycloakConfig | JwtConfig | InitializerModeConfig

if (authMode === 'keycloak') {
  authConfig = {
    mode: 'keycloak',
    keycloakOptions: {
      config: {
        realm: envConfig.KEYCLOAK_REALM,
        url: envConfig.KEYCLOAK_URL,
        clientId: envConfig.KEYCLOAK_CLIENT_ID
      }
      // ... your keycloak options
    }
  }
} else if (authMode === 'jwt') {
  authConfig = {
    mode: 'jwt',
    getUserInfo: async () => await api.auth.getAccount(),
    setUser: async (user) => {
      const { useAuthStore } = await import('@/stores/auth')
      useAuthStore().user = user
    }
  }
} else {
  // Initializer/Dev mode
  authConfig = {
    mode: authMode as 'initializer' | 'dev',
    appInitializer: {
      initializeApp: async () => await initializeApp(),
      startInitialization: async () => await startInitialization()
    }
  }
}

// Bootstrap
await bootstrapApp({
  app,
  authMode,
  authConfig,
  plugins: {
    router,
    print,
    vueApexCharts: VueApexCharts,
    vuetify
  },
  directives: {
    digitLimit: DigitLimit,
    permission: vPermission // Your custom directive
  },
  components: {
    vue3PersianDatetimePicker: Vue3PersianDatetimePicker
  }
})
```

## What to Customize

1. **Import Paths**: Update `@/stores/auth`, `@/services/api`, etc. to match your project
2. **Config Values**: Use your actual `envConfig` properties
3. **Auth Config**: Adapt the auth config to match your exact requirements
4. **Plugins**: Add/remove plugins as needed
5. **Directives**: Add your custom directives
6. **Components**: Add your global components

## Complete Minimal Example

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { bootstrapApp, DigitLimit, configureAxiosInstance } from '@amirjalili1374/ui-kit'
import App from './App.vue'
import { router } from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import envConfig from '@/config/envConfig'

const app = createApp(App)
app.use(createPinia())

// 1. Setup axios (your existing code)
axios.defaults.baseURL = 'your-api-url'
// ... your interceptors ...

// 2. Configure UI kit to use your axios
configureAxiosInstance(axios)

// 3. Bootstrap
await bootstrapApp({
  app,
  authMode: envConfig.AUTH_MODE || 'keycloak',
  authConfig: { /* your config */ },
  plugins: { router, vuetify },
  directives: { digitLimit: DigitLimit }
})
```

## Important Reminders

- ✅ Keep all your axios setup BEFORE `bootstrapApp`
- ✅ Call `configureAxiosInstance(axios)` after setting up axios
- ✅ Remove `app.mount('#app')` - `bootstrapApp` does this automatically
- ✅ Remove `UiKit.install(app)` - not needed with `bootstrapApp`
- ✅ Adapt import paths and config to your project structure

