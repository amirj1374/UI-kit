# HTTP Utilities

Utilities for making HTTP requests and configuring Axios instances.

## Axios Configuration

### `configureAxiosInstance(instance: AxiosInstance): void`

Configures a custom Axios instance for the library to use.

**Parameters:**
- `instance` - Your configured Axios instance

**Example:**
```typescript
import { configureAxiosInstance } from '@amirjalili1374/ui-kit'
import axios from 'axios'

const myAxios = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000
})

// Configure interceptors, etc.
myAxios.interceptors.request.use(/* ... */)

// Set as the library's Axios instance
configureAxiosInstance(myAxios)
```

### `getAxiosInstance(): AxiosInstance`

Gets the configured Axios instance (or default axios).

**Returns:** AxiosInstance

**Example:**
```typescript
import { getAxiosInstance } from '@amirjalili1374/ui-kit'

const axiosInstance = getAxiosInstance()
// Use the instance
```

## Fetch Wrapper

### `configureAuth(config: AuthConfig): void`

Configures authentication for the fetch wrapper.

**Parameters:**
- `config` - Authentication configuration object

**AuthConfig Interface:**
```typescript
interface AuthConfig {
  getToken: () => string | null
  apiBaseUrl: string
  onUnauthorized: () => void
}
```

**Example:**
```typescript
import { configureAuth } from '@amirjalili1374/ui-kit'

configureAuth({
  getToken: () => {
    // Get token from store or localStorage
    return localStorage.getItem('token')
  },
  apiBaseUrl: 'https://api.example.com',
  onUnauthorized: () => {
    // Handle unauthorized (redirect to login, etc.)
    router.push('/login')
  }
})
```

### `fetchWrapper(url: string, options?: RequestInit): Promise<Response>`

Generic fetch wrapper with authentication support.

**Parameters:**
- `url` - Request URL
- `options` - Fetch options

**Returns:** Promise<Response>

**Example:**
```typescript
import { fetchWrapper } from '@amirjalili1374/ui-kit'

const response = await fetchWrapper('/api/users', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})

const data = await response.json()
```

