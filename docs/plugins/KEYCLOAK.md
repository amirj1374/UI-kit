# Keycloak Plugin

A configurable Keycloak authentication plugin for Vue 3 applications.

## Installation

First, install the required peer dependency:

```bash
npm install @dsb-norge/vue-keycloak-js
```

## Setup

### Basic Usage

```typescript
import { createApp } from 'vue'
import { setupKeycloak } from '@amirjalili1374/ui-kit'
import type { KeycloakPluginOptions } from '@amirjalili1374/ui-kit'

const app = createApp(App)

const keycloakOptions: KeycloakPluginOptions = {
  config: {
    realm: 'my-realm',
    url: 'https://keycloak.example.com',
    clientId: 'my-client'
  }
}

setupKeycloak(app, keycloakOptions)
app.mount('#app')
```

### Advanced Configuration

```typescript
import { setupKeycloak } from '@amirjalili1374/ui-kit'

setupKeycloak(app, {
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
      console.log('Keycloak ready!', keycloak)
      // Initialize your app
    },
    onAuthSuccess: () => {
      console.log('Authentication successful')
    },
    onAuthError: (error) => {
      console.error('Authentication error:', error)
    },
    onAuthLogout: () => {
      console.log('User logged out')
      // Cleanup or redirect
    },
    onInitError: (error) => {
      console.error('Initialization error:', error)
    }
  },
  exposeGlobally: true // Exposes window.$keycloak
})
```

## Configuration Options

### KeycloakConfig

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `realm` | `string` | Yes | Keycloak realm name |
| `url` | `string` | Yes | Keycloak server URL |
| `clientId` | `string` | Yes | Client ID |

### KeycloakInitOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `flow` | `'standard' \| 'implicit' \| 'hybrid'` | `'standard'` | Authentication flow |
| `checkLoginIframe` | `boolean` | `false` | Check login status via iframe |
| `onLoad` | `'login-required' \| 'check-sso'` | `'login-required'` | What to do on load |
| `pkceMethod` | `'S256' \| 'plain'` | `'S256'` | PKCE method |
| `enableLogging` | `boolean` | `false` | Enable console logging |

### KeycloakCallbacks

| Property | Type | Description |
|----------|------|-------------|
| `onReady` | `(keycloak: any) => void` | Called when Keycloak is ready |
| `onAuthSuccess` | `() => void` | Called on successful authentication |
| `onAuthError` | `(error: any) => void` | Called on authentication error |
| `onAuthLogout` | `() => void` | Called when user logs out |
| `onInitError` | `(error: any) => void` | Called on initialization error |

## Accessing Keycloak Instance

If `exposeGlobally` is `true` (default), the Keycloak instance is available on `window.$keycloak`:

```typescript
// In your components or composables
const keycloak = (window as any).$keycloak

if (keycloak?.authenticated) {
  // User is authenticated
  const token = keycloak.token
}
```

## Usage in Components

```vue
<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const keycloak = (window as any).$keycloak
  
  if (keycloak?.authenticated) {
    console.log('User is authenticated')
    console.log('Token:', keycloak.token)
  }
})
</script>
```

## Logout

```typescript
const keycloak = (window as any).$keycloak

if (keycloak) {
  keycloak.logout({
    redirectUri: window.location.origin
  })
}
```

