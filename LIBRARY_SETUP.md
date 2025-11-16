# UI Kit Library Setup Complete

Your project has been successfully configured as a reusable UI Kit library! Here's what has been set up:

## What Was Created

### 1. **Library Entry Point** (`src/index.ts`)
   - Exports all components, composables, utilities, directives, and types
   - Includes plugin installation function for Vue apps
   - Handles style imports

### 2. **Build Configuration**
   - **Vite Config** (`vite.config.ts`): Supports both app and library builds
   - **TypeScript Config** (`tsconfig.lib.json`): Type declarations generation
   - **Package.json**: Updated with library metadata and build scripts

### 3. **Documentation**
   - **README.md**: Complete usage instructions
   - **.npmignore**: Files excluded from npm package

## How to Use

### Building the Library

```bash
npm run build:lib
```

This will:
1. Run TypeScript type checking
2. Build library in ES, CJS, and UMD formats
3. Generate TypeScript declaration files
4. Output to `dist/` directory

### Installing in Another Project

After publishing to npm (or using locally):

```bash
npm install @jalili/ui-kit
```

Then in your Vue app:

```typescript
// main.ts
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@jalili/ui-kit/dist/style.css'; // Import styles

import UiKit from '@jalili/ui-kit';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
app.use(vuetify);
app.use(UiKit); // Install UI Kit
app.mount('#app');
```

### Using Components

```vue
<script setup lang="ts">
import { CustomDataTable, ShamsiDatePicker } from '@jalili/ui-kit';
</script>

<template>
  <CustomDataTable :headers="headers" :items="items" />
  <ShamsiDatePicker v-model="date" />
</template>
```

### Publishing Updates

1. Make your changes
2. Update version in `package.json`
3. Run `npm run build:lib`
4. Test locally
5. Run `npm publish`

## Important Notes

### Conflicting Exports

The following exports have been renamed to avoid conflicts:
- `ContractType` from `types/approval/approvalType.ts` is exported as `ApprovalContractType`
- `ContractType` from `constants/enums/contractType.ts` remains as `ContractType`

Use:
- `ApprovalContractType` for the interface from approval types
- `ContractType` for the enum type from constants

### Peer Dependencies

Make sure your consuming projects have these installed:
- `vue` >= 3.5.0
- `vuetify` >= 3.10.0
- `@vueuse/core` >= 13.0.0 (optional)
- `axios` >= 1.8.0 (optional)

### Development vs Library Mode

- **Development Mode**: `npm run dev` (builds as Vue app)
- **Library Mode**: `npm run build:lib` (builds as npm package)

Both modes share the same codebase - the build mode is determined by the `BUILD_LIB` environment variable.

## Next Steps

1. **Test the Build**: Run `npm run build:lib` to verify everything works
2. **Configure npm**: Update `package.json` with your repository URL and author info
3. **Publish**: Use `npm publish` to publish to npm (or your private registry)
4. **Update Consuming Projects**: Install and use the library in your other projects

## Available Exports

### Components
- Shared components: `BaseBreadcrumb`, `BaseIcon`, `ConfirmDialog`, `CustomAutocomplete`, `CustomDataTable`, etc.
- Common components: `AppStepper`, `Loading`

### Composables
- `useDataTable`, `usePermissions`, `useRouteGuard`, `useTableActions`, `useTableHeaders`, `useTableSelection`

### Directives
- `v-permission`, `v-digit-limit`

### Utils
- `DateConverter`, `formatNumberWithCommas`, `NationalCodeValidator`, etc.

### Types
- All types from `types/approval`, `types/cartable`, `types/models`, etc.

For a complete list, see `src/index.ts`.

