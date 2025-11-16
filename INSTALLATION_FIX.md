# Installation Instructions for UI Kit

If you're getting an error that the package needs to be installed first, follow these steps:

## Step 1: Install the Package

```bash
npm install @amirjalili1374/ui-kit@1.3.2
```

Or if you want the latest version:

```bash
npm install @amirjalili1374/ui-kit@latest
```

## Step 2: Install Peer Dependencies

Make sure you have all peer dependencies installed:

```bash
npm install vue@^3.3.0 vuetify@^3.10.0 @vueuse/core@^13.0.0 axios@^1.8.0
```

## Step 3: Configure in Your Project

In your `main.ts` or `main.js`:

```typescript
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@amirjalili1374/ui-kit/dist/style.css';

import App from './App.vue';
import UiKit from '@amirjalili1374/ui-kit';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
app.use(vuetify);
app.use(UiKit);
app.mount('#app');
```

## Step 4: Configure Axios (Important!)

Before using components that make API calls (like `CustomDataTable`), configure your axios instance:

```typescript
import { configureAxiosInstance } from '@amirjalili1374/ui-kit';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://your-api-url.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth interceptor if needed
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

configureAxiosInstance(axiosInstance);
```

## Troubleshooting

### Error: "module is not defined"
- ✅ Fixed in version 1.3.2 - `jalaali-js` is now bundled

### Error: "Cannot find module 'jalaali-js'"
- ✅ Fixed in version 1.3.2 - No longer needed as a separate dependency

### Error: "The requested module does not provide an export named 'default'"
- ✅ Fixed in version 1.3.2 - Import syntax corrected

### Error: Package needs to be installed first
- Solution: Run `npm install @amirjalili1374/ui-kit` first, then update if needed

