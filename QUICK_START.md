# Quick Start Guide

## 🚀 Publishing to NPM

### 1. Build the Library
```bash
npm run build:lib
```

### 2. Check What Will Be Published
```bash
npm pack --dry-run
```

### 3. Login to NPM
```bash
npm login
```

### 4. Publish
```bash
npm publish --access public
```

**Note:** For scoped packages like `@amirjalili1374/ui-kit`, you need `--access public` unless you have a paid npm account.

---

## 📦 Using in Another Project

### 1. Install Package
```bash
npm install @amirjalili1374/ui-kit
```

### 2. Install Peer Dependencies
```bash
npm install vue@^3.5.0 vuetify@^3.10.0 @vueuse/core@^13.0.0 axios@^1.8.0
```

### 3. Setup in main.ts
```typescript
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@amirjalili1374/ui-kit/dist/style.css'; // IMPORTANT: Import styles

import App from './App.vue';
import UiKit from '@amirjalili1374/ui-kit';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
app.use(vuetify);
app.use(UiKit); // Install UI Kit
app.mount('#app');
```

### 4. Use Components
```vue
<script setup lang="ts">
import { CustomDataTable, ShamsiDatePicker, MoneyInput } from '@amirjalili1374/ui-kit';
</script>

<template>
  <CustomDataTable :headers="headers" :items="items" />
  <ShamsiDatePicker v-model="date" />
</template>
```

### 5. Use Composables
```typescript
import { useDataTable, useTableActions } from '@amirjalili1374/ui-kit';

const { items, loading, fetchData } = useDataTable({
  apiResource: '/api/users',
  pageSize: 10,
});
```

---

## 🔄 Update Workflow

### To Update the Library:
1. Make changes
2. Update version: `npm version patch|minor|major`
3. Build: `npm run build:lib`
4. Publish: `npm publish --access public`

### To Update in Projects:
```bash
npm update @amirjalili1374/ui-kit
# or
npm install @amirjalili1374/ui-kit@latest
```

---

## 🧪 Test Locally Before Publishing

```bash
# In library directory
npm link
npm run build:lib

# In your project directory
npm link @amirjalili1374/ui-kit

# When done
npm unlink @amirjalili1374/ui-kit
```

