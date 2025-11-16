# Publishing and Using the UI Kit Library

This guide explains how to publish your UI Kit library to npm and use it in other projects.

## 📦 Publishing to NPM

### Step 1: Prepare for Publishing

1. **Update package.json metadata** (if needed):
   ```json
   {
     "name": "@amirjalili1374/ui-kit",
     "version": "1.0.0",
     "description": "A reusable UI component library built with Vue 3, Vuetify, and TypeScript",
     "author": "Your Name <your.email@example.com>",
     "repository": {
       "type": "git",
       "url": "https://github.com/yourusername/ui-kit.git"
     },
     "license": "MIT"
   }
   ```

2. **Build the library**:
   ```bash
   npm run build:lib
   ```
   
   This will create the `dist/` folder with:
   - `ui-kit.es.js` - ES module format
   - `ui-kit.cjs.js` - CommonJS format
   - `style.css` - Compiled CSS
   - `index.d.ts` - TypeScript declarations

### Step 2: Check What Will Be Published

Verify the files that will be included:
```bash
npm pack --dry-run
```

This shows what files will be included in the package (based on `files` field in package.json and `.npmignore`).

### Step 3: Login to NPM

If you haven't already:
```bash
npm login
```

Enter your npm username, password, and email when prompted.

**Note:** For scoped packages (`@amirjalili1374/ui-kit`), make sure you have the correct permissions or publish as a public package.

### Step 4: Publish to NPM

**For public package** (remove scope or make it public):
```bash
npm publish --access public
```

**For private package** (requires npm paid account):
```bash
npm publish
```

**For testing** (publish to npm test registry first):
```bash
npm publish --registry https://registry.npmjs.org --tag beta
```

### Step 5: Update Version for Next Release

After publishing, update version for next release:
```bash
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
```

Or manually edit `package.json` version field.

---

## 📥 Using the Library in Another Project

### Step 1: Install the Package

**If published to npm:**
```bash
npm install @amirjalili1374/ui-kit
# or
yarn add @amirjalili1374/ui-kit
# or
pnpm add @amirjalili1374/ui-kit
```

**If using locally (development):**
```bash
# In the library directory
npm link

# In your project directory
npm link @amirjalili1374/ui-kit
```

**If using from local path:**
```json
// In your project's package.json
{
  "dependencies": {
    "@amirjalili1374/ui-kit": "file:../ui-kit"
  }
}
```

### Step 2: Install Peer Dependencies

Make sure you have all peer dependencies installed:
```bash
npm install vue@^3.5.0 vuetify@^3.10.0 @vueuse/core@^13.0.0 axios@^1.8.0
```

### Step 3: Setup Vuetify in Your Project

Since the library uses Vuetify components, configure Vuetify in your main.ts:

```typescript
// main.ts or main.js
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@amirjalili1374/ui-kit/dist/style.css'; // Import UI Kit styles

import App from './App.vue';
import UiKit from '@amirjalili1374/ui-kit';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
app.use(vuetify);
app.use(UiKit); // Install UI Kit plugin (registers directives)
app.mount('#app');
```

### Step 4: Use Components

#### Option 1: Import Individual Components

```vue
<script setup lang="ts">
import { CustomDataTable, ShamsiDatePicker, MoneyInput } from '@amirjalili1374/ui-kit';
import type { Header, TableItem } from '@amirjalili1374/ui-kit';

const headers: Header[] = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
];

const items: TableItem[] = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' },
];
</script>

<template>
  <div>
    <CustomDataTable
      :headers="headers"
      :items="items"
      apiResource="/api/users"
      :height="400"
      :show-pagination="true"
    />
    
    <ShamsiDatePicker v-model="selectedDate" />
    <MoneyInput v-model="amount" />
  </div>
</template>
```

#### Option 2: Use Composables

```typescript
import { useDataTable, useTableActions, useTableSelection } from '@amirjalili1374/ui-kit';

// Data table composable
const { items, loading, fetchData, pagination } = useDataTable({
  apiResource: '/api/users',
  pageSize: 10,
  autoFetch: true,
});

// Table actions composable
const { dialog, openDialog, resetDialogs } = useTableActions({
  actions: ['create', 'edit', 'delete'],
});

// Table selection composable
const { selectedItems, toggleSelection, isSelected } = useTableSelection(items, {
  multiSelect: true,
  uniqueKey: 'id',
});
```

#### Option 3: Use Stores

```typescript
import { useCustomizerStore } from '@amirjalili1374/ui-kit';

const customizer = useCustomizerStore();

// Change theme
customizer.SET_THEME('dark');
customizer.SET_THEME_MODE('dark');

// Control loading
customizer.SET_LOADING(true);
```

#### Option 4: Use Directives

```vue
<template>
  <!-- Digit limit directive -->
  <input v-digit-limit="10" v-model="phoneNumber" />
</template>
```

#### Option 5: Use Utilities

```typescript
import { 
  DateConverter, 
  formatNumberWithCommas,
  NationalCodeValidator,
  configureAuth
} from '@amirjalili1374/ui-kit';

// Date conversion
const shamsiDate = DateConverter.gregorianToShamsi(new Date());
const gregorianDate = DateConverter.shamsiToGregorian('1403/01/01');

// Number formatting
const formatted = formatNumberWithCommas(1234567); // "1,234,567"

// National code validation
const isValid = NationalCodeValidator.validate('0123456789');

// Configure fetch wrapper auth
configureAuth({
  getToken: () => localStorage.getItem('token'),
  getApiBaseUrl: () => import.meta.env.VITE_API_BASE_URL,
  onUnauthorized: () => {
    // Handle unauthorized
    router.push('/login');
  }
});
```

### Step 5: Configure Axios (if needed)

The library uses axios internally. You can configure a global axios instance:

```typescript
// In your main.ts or a config file
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// The library will use this configured instance
```

---

## 🔄 Updating the Library

### In the Library Project

1. Make your changes
2. Update version in `package.json`
3. Build:
   ```bash
   npm run build:lib
   ```
4. Publish:
   ```bash
   npm publish
   ```

### In Consuming Projects

Update to the latest version:
```bash
npm update @amirjalili1374/ui-kit
# or specify version
npm install @amirjalili1374/ui-kit@1.2.0
```

---

## 🧪 Testing Locally Before Publishing

### Using npm link

1. **In the library directory:**
   ```bash
   cd ui-kit
   npm link
   npm run build:lib
   ```

2. **In your project directory:**
   ```bash
   cd ../my-project
   npm link @amirjalili1374/ui-kit
   ```

3. **When done testing:**
   ```bash
   npm unlink @amirjalili1374/ui-kit
   # In library directory
   npm unlink
   ```

### Using file path

In your project's `package.json`:
```json
{
  "dependencies": {
    "@amirjalili1374/ui-kit": "file:../ui-kit"
  }
}
```

Then run:
```bash
npm install
```

---

## 📋 Quick Checklist

### Before Publishing:
- [ ] Update version in `package.json`
- [ ] Update author, repository, description if needed
- [ ] Run `npm run build:lib` successfully
- [ ] Check `npm pack --dry-run` shows correct files
- [ ] Test locally with `npm link`

### Publishing:
- [ ] `npm login` (if not logged in)
- [ ] `npm publish --access public` (for scoped packages)
- [ ] Verify package appears on npmjs.com

### In Consuming Project:
- [ ] Install package: `npm install @amirjalili1374/ui-kit`
- [ ] Install peer dependencies
- [ ] Import and configure Vuetify
- [ ] Import UI Kit styles
- [ ] Use `app.use(UiKit)` to install plugin
- [ ] Import and use components

---

## 🐛 Troubleshooting

### "Module not found" errors

Make sure you:
- Installed the package correctly
- Have peer dependencies installed
- Imported styles: `import '@amirjalili1374/ui-kit/dist/style.css'`

### Vuetify components not working

Make sure Vuetify is properly configured in your project before installing the UI Kit.

### TypeScript errors

Make sure TypeScript can find the types. The library exports types in `dist/index.d.ts`.

### Styles not loading

Import the CSS file:
```typescript
import '@amirjalili1374/ui-kit/dist/style.css';
```

### Permission errors on npm publish

- For scoped packages, use `--access public`
- Make sure you're logged in: `npm login`
- Check package name availability

