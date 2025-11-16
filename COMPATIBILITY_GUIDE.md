# Compatibility Guide for Using UI Kit

## Required Updates for Your Project

To use `@amirjalili1374/ui-kit`, update your project's dependencies:

### 1. Upgrade Vue (Recommended)

```bash
npm install vue@^3.5.0 vue-router@latest
```

**Why:** `@vueuse/core@13.5.0` requires Vue 3.5.0+. While the library supports Vue 3.3.0+, your `@vueuse/core` version is incompatible with Vue 3.4.27.

### 2. Upgrade Vuetify and vite-plugin-vuetify

```bash
npm install vuetify@^3.10.0 vite-plugin-vuetify@^2.1.0
```

**Why:** 
- The UI Kit requires Vuetify 3.10.0+, and you currently have 3.6.5.
- Vuetify 3.10.0+ requires `vite-plugin-vuetify@>=2.1.0`, but you have 2.0.3.

### 3. Complete Installation

After upgrading dependencies:

```bash
npm install @amirjalili1374/ui-kit
```

## Alternative: Downgrade @vueuse/core (If you must keep Vue 3.4.27)

If you cannot upgrade Vue, downgrade `@vueuse/core` to a version compatible with Vue 3.4.x:

```bash
npm install @vueuse/core@^13.0.0
npm install vuetify@^3.10.0
npm install @amirjalili1374/ui-kit
```

**Note:** You'll miss newer features in @vueuse/core 13.5.0.

## Your Current vs Required Versions

| Package | Your Version | Required | Status |
|---------|-------------|----------|--------|
| `vue` | 3.4.27 | ^3.3.0 | ⚠️ Need 3.5.0+ for @vueuse/core |
| `vuetify` | 3.6.5 | ^3.10.0 | ❌ Must upgrade |
| `@vueuse/core` | ^13.3.0 | ^13.0.0 | ⚠️ Resolves to 13.5.0 (needs Vue 3.5+) |
| `axios` | ^1.8.2 | ^1.8.0 | ✅ OK |

## Quick Fix Script

Run these commands in your project directory:

```bash
# Upgrade Vue and Vue Router
npm install vue@^3.5.0 vue-router@latest

# Upgrade Vuetify and vite-plugin-vuetify together
npm install vuetify@^3.10.0 vite-plugin-vuetify@^2.1.0

# Install UI Kit
npm install @amirjalili1374/ui-kit
```

## After Installation

Update your `main.ts` or `main.js`:

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

## Troubleshooting

If you still get peer dependency errors:

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and package-lock.json:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Use legacy peer deps (last resort):**
   ```bash
   npm install @amirjalili1374/ui-kit --legacy-peer-deps
   ```

