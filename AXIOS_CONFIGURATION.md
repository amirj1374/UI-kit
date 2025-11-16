# Axios Configuration Guide

The UI Kit library uses axios for API calls in components like `CustomDataTable`. You can configure it to use your own axios instance with your base URL, authentication headers, and interceptors.

## Method 1: Global Configuration (Recommended)

Configure the library to use your axios instance globally:

```typescript
// main.ts or a config file
import { configureAxiosInstance } from '@amirjalili1374/ui-kit';
import axios from 'axios';

// Create your configured axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://your-api-url.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add authentication interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response error handler
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Configure the library
configureAxiosInstance(axiosInstance);

// Then use the library
import '@amirjalili1374/ui-kit/dist/style.css';
import UiKit from '@amirjalili1374/ui-kit';
app.use(UiKit);
```

## Method 2: Per-Component Configuration

Pass your axios instance directly to each `CustomDataTable`:

```vue
<script setup lang="ts">
import { CustomDataTable } from '@amirjalili1374/ui-kit';
import axios from 'axios';
import type { Header } from '@amirjalili1374/ui-kit';

const myAxiosInstance = axios.create({
  baseURL: 'http://your-api-url.com',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const headers: Header[] = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' }
];
</script>

<template>
  <CustomDataTable
    apiResource="/api/job-details"
    :axiosInstance="myAxiosInstance"
    :headers="headers"
    :height="600"
  />
</template>
```

## Environment Variables

Use environment variables for different environments:

**.env.development:**
```env
VITE_API_BASE_URL=http://localhost:8080
```

**.env.production:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

Then in your code:
```typescript
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});
```

## Why This Is Needed

The library's `CustomDataTable` component makes API calls using axios. By default, it uses a minimal axios instance without any configuration. You need to provide your own configured instance so that:

1. **Base URL is correct** - Your API endpoints work correctly
2. **Authentication works** - Tokens are included in requests
3. **Error handling** - Unauthorized requests are handled properly
4. **Interceptors** - Your custom request/response logic is applied

## Troubleshooting

### Issue: API calls go to wrong URL

**Solution:** Make sure you've configured `baseURL` in your axios instance:
```typescript
const axiosInstance = axios.create({
  baseURL: 'http://your-api-url.com' // ← Make sure this is set
});
```

### Issue: 401 Unauthorized errors

**Solution:** Add authentication interceptor:
```typescript
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Issue: CORS errors

**Solution:** Make sure your backend allows CORS from your frontend origin, or use a proxy in `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://your-api-url.com',
        changeOrigin: true
      }
    }
  }
});
```

