# UI Kit Documentation

Welcome to the `@amirjalili1374/ui-kit` documentation. This library provides a comprehensive set of reusable Vue 3 components, composables, utilities, and plugins.

## Table of Contents

### Components
- [Layout Components](./components/LAYOUT.md) - AppHeader, AppSidebar, AppLayout
- [Shared Components](./components/SHARED.md) - CustomDataTable, CustomAutocomplete, and more
- [Common Components](./components/COMMON.md) - AppStepper, Loading

### Composables
- [Data Table Composables](./composables/DATA_TABLE.md) - useDataTable, useTableActions, useTableHeaders, useTableSelection

### Utilities
- [App Bootstrap](./utils/APP_BOOTSTRAP.md) - Application initialization with multiple auth modes
- [Migrating to App Bootstrap](./utils/APP_BOOTSTRAP_MIGRATION.md) - Guide for migrating from manual bootstrap
- [Date Utilities](./utils/DATE.md) - Date conversion utilities
- [Number Utilities](./utils/NUMBER.md) - Number formatting utilities
- [Greeting Utilities](./utils/GREETING.md) - Time-based greeting utilities
- [Validation Utilities](./utils/VALIDATION.md) - National code validation
- [HTTP Utilities](./utils/HTTP.md) - Fetch wrapper and Axios configuration

### Plugins
- [Keycloak Plugin](./plugins/KEYCLOAK.md) - Keycloak authentication setup

### Directives
- [Directives](./directives/README.md) - v-digit-limit directive

## Quick Start

```bash
npm install @amirjalili1374/ui-kit
```

```typescript
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import '@amirjalili1374/ui-kit/dist/style.css'
import UiKit from '@amirjalili1374/ui-kit'

const app = createApp(App)
const vuetify = createVuetify({ /* ... */ })

app.use(vuetify)
app.use(UiKit)
app.mount('#app')
```

## Installation

See the main [README.md](../README.md) for detailed installation instructions.

