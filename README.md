# @amirjalili1374/ui-kit

A reusable UI component library built with Vue 3, Vuetify 3, and TypeScript. This library provides a comprehensive set of components, composables, utilities, and directives for building modern web applications.

## Features

- 🎨 Built with Vue 3 Composition API
- 🎯 TypeScript support
- 🎭 Vuetify 3 components
- 🔧 Composable utilities
- 📦 Tree-shakeable exports
- 🎪 ESM and CommonJS package outputs

## Installation

```bash
npm install @amirjalili1374/ui-kit
```

This repository is developed and validated with Node.js `^20.19.0 || >=22.12.0`
and npm 11. The committed `package-lock.json` is the canonical lockfile.

## Peer Dependencies

This library requires the following peer dependencies to be installed in your project:

- `vue` ^3.4.0
- `vuetify` ^3.10.0
- `vue-router` ^4.3.0

`CustomDataTable` currently calls Vue Router directly, so applications that render
the table must install a router before mounting it. Other package dependencies,
including Pinia, Axios, and VueUse, are installed through the package metadata.

## Usage

### Basic Setup

First, make sure you have Vuetify installed and configured in your Vue application.

```typescript
// main.ts
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@amirjalili1374/ui-kit/dist/style.css'; // Import styles

import UiKit from '@amirjalili1374/ui-kit';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
app.use(vuetify);
app.use(UiKit); // Install UI Kit (registers directives globally)
app.mount('#app');
```

### Import Components

You can import components individually for better tree-shaking:

```vue
<script setup lang="ts">
import {
  CustomDataTable,
  CustomDataTableV2,
  BaseIcon, 
  ShamsiDatePicker,
  AppSidebar,
  AppHeader
} from '@amirjalili1374/ui-kit';
import type { MenuItem, HeaderAction } from '@amirjalili1374/ui-kit';
</script>

<template>
  <CustomDataTable :headers="headers" :items="items" />
  <ShamsiDatePicker v-model="date" />
</template>
```

### Use Layout Components (Sidebar & Header)

```vue
<script setup lang="ts">
import { AppSidebar, AppHeader, useCustomizerStore } from '@amirjalili1374/ui-kit';
import type { MenuItem, HeaderAction } from '@amirjalili1374/ui-kit';

const customizer = useCustomizerStore();

// Define menu items
const menuItems: MenuItem[] = [
  {
    title: 'داشبورد',
    icon: 'mdi-home',
    to: '/dashboard'
  },
  {
    title: 'کاربران',
    icon: 'mdi-account-group',
    items: [
      { title: 'لیست کاربران', icon: 'mdi-account-multiple', to: '/users' },
      { title: 'افزودن کاربر', icon: 'mdi-account-plus', to: '/users/create' }
    ]
  },
  {
    title: 'تنظیمات',
    icon: 'mdi-cog',
    to: '/settings',
    chip: { content: '3', color: 'error' }
  }
];

// Define header actions
const headerActions: HeaderAction[] = [
  {
    icon: 'mdi-plus',
    label: 'ایجاد',
    color: 'primary',
    onClick: () => console.log('Create clicked')
  }
];
</script>

<template>
  <v-app>
    <AppHeader
      title="پنل مدیریت"
      subtitle="خوش آمدید"
      :actions="headerActions"
      show-search
      show-profile
      profile-name="کاربر"
      :profile-avatar="/avatar.jpg"
    />
    
    <AppSidebar
      :menu-items="menuItems"
      logo="/logo.svg"
      logo-light="/logo-light.svg"
      logo-text="UI Kit"
      :mini-sidebar="customizer.mini_sidebar"
    />
    
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
```

### Use Composables

```typescript
import { useDataTable, useTableActions, useTableSelection } from '@amirjalili1374/ui-kit';

const { items, loading, fetchData } = useDataTable({
  apiResource: '/api/users',
  pageSize: 10,
});

const { dialog, openDialog, resetDialogs } = useTableActions({
  actions: ['create', 'edit', 'delete']
});
```

### Use Stores

```typescript
import { useCustomizerStore } from '@amirjalili1374/ui-kit';

const customizer = useCustomizerStore();
customizer.SET_THEME('dark');
customizer.SET_LOADING(true);
```

### Use Directives

Directives are automatically registered when you install the plugin:

```vue
<template>
  <input v-digit-limit="10" />
</template>
```

### Configure Axios Instance

Before using components that make API calls (like `CustomDataTable`), configure your axios instance:

```typescript
import { configureAxiosInstance } from '@amirjalili1374/ui-kit';
import axios from 'axios';

// Create your configured axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://your-api-url.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Configure the library to use your axios instance
configureAxiosInstance(axiosInstance);
```

**Or pass axios instance directly to CustomDataTable:**

```vue
<script setup>
import { CustomDataTable } from '@amirjalili1374/ui-kit';
import axios from 'axios';

const myAxiosInstance = axios.create({
  baseURL: 'http://your-api-url.com'
});
</script>

<template>
  <CustomDataTable
    :apiResource="/api/job-details"
    :axiosInstance="myAxiosInstance"
    :headers="headers"
    :height="600"
  />
</template>
```

### Use Utilities

```typescript
import { DateConverter, formatNumberWithCommas } from '@amirjalili1374/ui-kit';

// Date conversion
const shamsiDate = DateConverter.gregorianToShamsi(new Date());

// Number formatting
const formatted = formatNumberWithCommas(1234567); // "1,234,567"
```

## Available Components

### Shared Components
- `BaseBreadcrumb` - Breadcrumb navigation component
- `BaseIcon` - Icon component wrapper
- `ConfirmDialog` - Confirmation dialog
- `CustomAutocomplete` - Enhanced autocomplete input
- `CustomDataTableV2` - Current feature-rich data table implementation
- `CustomDataTable` - Backward-compatible alias for `CustomDataTableV2`; there is no separate V1 implementation on this branch
- `DescriptionInput` - Text area input for descriptions
- `DownloadButton` - Button with download functionality
- `MoneyInput` - Currency/money input field
- `PdfViewer` - PDF viewer component
- `ShamsiDatePicker` - Persian (Shamsi) date picker
- `UiChildCard` - Child card container
- `UiParentCard` - Parent card container
- `VPriceTextField` - Price text field with formatting

### Common Components
- `AppStepper` - Step-by-step wizard component
- `Loading` - Loading overlay component

### Layout Components
- `AppSidebar` - Navigation sidebar with menu items, logo, and mini sidebar support
- `AppHeader` - Top header bar with search, notifications, profile menu, and custom actions

## Available Composables

- `useDataTable` - Server-side data table with pagination and filtering
- `useTableActions` - Table action handlers
- `useTableHeaders` - Table header utilities
- `useTableSelection` - Table row selection management

**Note:** `usePermissions` and `useRouteGuard` are app-specific and not exported from the library.

## Available Stores

- `useCustomizerStore` - Global UI customization store (theme, layout, etc.)

**Note:** `usePermissionsStore` contains app-specific menu permissions and is not exported from the library.

## Available Directives

- `v-digit-limit` - Limit input to specific number of digits

**Note:** `v-permission` directive contains app-specific logic and is not exported from the library.

## Available Utils

- `DateConverter` - Convert between Gregorian and Shamsi (Persian) dates
- `formatNumberWithCommas` - Format numbers with thousand separators
- `NationalCodeValidator` - Validate Iranian national codes
- `fetchWrapper` - Generic HTTP request wrapper

## Available Types

- `Header`, `TableItem`, `DataTableProps` - Types for CustomDataTable component
- `CustomAction`, `CustomButtonAction` - Types for table actions
- `SelectionOptions`, `GroupedItems` - Types for table selection
- `BooleanEnum`, `BooleanStatus` - Generic boolean enum types

**Note:** This library exports only generic, reusable types. App-specific business logic types are excluded.

## Building the Library

To build the library for distribution:

```bash
npm run build:lib
```

This runs fail-closed TypeScript checking, builds ESM and CommonJS outputs,
bundles the kit CSS, and generates TypeScript declarations.

Output files will be in the `dist` directory:
- `ui-kit.es.js` - ES module format
- `ui-kit.cjs` - CommonJS format
- `style.css` - Compiled CSS
- `index.d.ts` - TypeScript declarations

The normal `npm run build` command builds the demo application. Use
`npm run build:lib` for the publishable package.

### Optional Excel export

Client-side Excel export dynamically loads the optional `xlsx` dependency. Install
it before enabling that feature:

```bash
npm install xlsx
```

Other table features work without XLSX. Missing XLSX produces a clear runtime error
when client-side export is invoked.

## Publishing

Before publishing, validate and inspect the packed package:

```bash
npm ci
npm run validate
npm pack --dry-run
```

Publishing remains a manual, separately authorized operation. The `prepublishOnly`
hook rebuilds the library, but does not replace `npm run validate`.

## Development

### Run Development Server

```bash
npm run dev
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint:check  # read-only
npm run lint:fix    # explicit auto-fix
```

### Tests and package consumer validation

```bash
npm test
npm run test:coverage
npm run test:consumer
```

`test:consumer` packs the built library, installs the tarball into a fresh temporary
Vite application, and verifies ESM, CommonJS, declarations, CSS exports, and a
production consumer build. Current tests cover utilities, the digit directive,
table selection/helpers, and initial public-component accessibility contracts.

### Formatting

```bash
npm run format
```

## Updating the Library

To update and republish the library:

1. Make your changes to components, composables, or utilities
2. Update the version in `package.json`
3. Build the library: `npm run build:lib`
4. Test locally if possible
5. Run `npm run validate`
6. Inspect `npm pack --dry-run`
7. Publish only through the separately authorized release process

For npm scoped packages, make sure you have the correct permissions.

## What's Included vs Excluded

### ✅ Included (Generic & Reusable)
- Global UI components
- Generic composables (data table, selection, etc.)
- Generic utilities (date conversion, number formatting, etc.)
- Generic directives (digit-limit)
- Global stores (customizer only)
- Component types (DataTable, etc.)
- Generic enums (boolean, etc.)

### ❌ Excluded (App-Specific Logic)
- Business logic types (approval, cartable, etc.)
- App-specific stores (permissions, approval, base, customerInfo, auth, etc.)
- App-specific composables (usePermissions, useRouteGuard)
- App-specific directives (v-permission with hardcoded menu permissions)
- App-specific enums (contract types, LC types, etc.)
- Service modules (API calls, etc.)

## License

MIT. See [LICENSE](./LICENSE).

## Runtime limitations

The current table export/download behavior, PDF viewer, loading animation, and
authentication helpers use browser APIs. SSR is not currently claimed or validated.
The table also requires an installed Vue Router instance when rendered.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

