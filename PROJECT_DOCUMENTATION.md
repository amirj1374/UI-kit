# UI-Kit Project Documentation

> **Package:** `@amirjalili1374/ui-kit` | **Version:** 1.6.13 | **License:** MIT

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Business Purpose](#2-business-purpose)
3. [Architecture](#3-architecture)
4. [Folder Structure](#4-folder-structure)
5. [Libraries & Dependencies](#5-libraries--dependencies)
6. [Components](#6-components)
7. [Composables](#7-composables)
8. [State Management](#8-state-management)
9. [Theming System](#9-theming-system)
10. [Authentication](#10-authentication)
11. [Utilities & Helpers](#11-utilities--helpers)
12. [Services & API Layer](#12-services--api-layer)
13. [Build System](#13-build-system)
14. [Environment Configuration](#14-environment-configuration)
15. [Diagrams](#15-diagrams)
16. [Public API (Exported Members)](#16-public-api-exported-members)
17. [Code Patterns](#17-code-patterns)

---

## 1. Project Overview

**UI-Kit** is an enterprise-grade **Vue 3 UI component library** built on top of Vuetify 3. It is designed to be consumed as an NPM package by other Vue 3 applications within the organization. The library provides reusable components, composables, utilities, and a theming system tailored for Persian (Farsi/RTL) enterprise applications.

| Property | Value |
|----------|-------|
| Framework | Vue 3 (Composition API) |
| UI Framework | Vuetify 3 |
| Language | TypeScript |
| Build Tool | Vite |
| State Management | Pinia |
| Package Output | ES Module + CommonJS |
| Target Audience | Internal enterprise Vue 3 apps |

---

## 2. Business Purpose

### Domain Context
The library is built for **Persian/Iranian enterprise business applications**, evidenced by:
- Full **Shamsi (Jalali/Solar Hijri) calendar** support
- **Iranian national code validation** (real 10-digit & legal 11-digit)
- **RTL-compatible** UI components
- Currency/price formatting tailored for Iranian Rial (IRR)
- Persian font integration (IRANSansWeb)

### Core Business Capabilities Provided

| Capability | How Provided |
|-----------|-------------|
| Data presentation | `CustomDataTable`, `CustomDataTableV2` |
| Date handling | `ShamsiDatePicker`, `date-convertor` util |
| Form input | `MoneyInput`, `VPriceTextField`, `DescriptionInput` |
| Navigation | `AppSidebar`, `AppHeader`, `NavItem`, `NavGroup` |
| Document output | `PdfViewer`, `DownloadButton` |
| Auth integration | Keycloak plugin, JWT initializer, `AppBootstrap` |
| Workflow | `AppStepper` (multi-step wizard) |
| Confirmation UX | `ConfirmDialog` |

### What is NOT included (app-specific, excluded from exports)
- Approval workflow types and stores
- Cartable (inbox/task tray) types
- Specific contract/product type enums
- `v-permission` directive (permissions are app-specific)
- `usePermissions` and `useRouteGuard` composables

---

## 3. Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    Consumer Applications                         │
│              (Vue 3 apps importing from npm)                     │
└────────────────────────┬─────────────────────────────────────────┘
                         │  import from '@amirjalili1374/ui-kit'
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    UI-Kit Public API (src/index.ts)              │
│  Components | Composables | Utils | Stores | Directives | Types  │
└──────┬──────────────┬──────────────┬──────────────┬─────────────┘
       │              │              │              │
       ▼              ▼              ▼              ▼
┌──────────┐  ┌──────────────┐ ┌─────────┐  ┌──────────────────┐
│Components│  │  Composables │ │ Stores  │  │    Plugins       │
│(Vue SFCs)│  │(TS functions)│ │ (Pinia) │  │Vuetify/Keycloak  │
└────┬─────┘  └──────┬───────┘ └────┬────┘  └──────────────────┘
     │               │              │
     └───────┬────────┘              │
             ▼                      ▼
     ┌───────────────┐    ┌──────────────────┐
     │   Services    │    │   Theme System   │
     │  (Axios API)  │    │ (15 Vuetify      │
     │               │    │  themes)         │
     └───────────────┘    └──────────────────┘
```

### Package Architecture (Dual Build)

```
┌─────────────────────────────────────┐
│           Vite Build                │
│                                     │
│  BUILD_LIB=true                     │
│  ┌─────────────────────────────┐   │
│  │  Library Mode               │   │
│  │  ├── ui-kit.es.js (ESM)     │   │
│  │  ├── ui-kit.cjs (CJS)       │   │
│  │  ├── style.css              │   │
│  │  └── index.d.ts (types)     │   │
│  └─────────────────────────────┘   │
│                                     │
│  BUILD_LIB=false (default)          │
│  ┌─────────────────────────────┐   │
│  │  Application Mode           │   │
│  │  ├── Dev server (port 5050) │   │
│  │  └── Multi-env builds       │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Separation of Concerns

```
src/
 ├── Generic (Exported)         ← Safe to use in any Vue 3 app
 │   ├── components/shared/
 │   ├── components/layout/
 │   ├── composables/ (generic)
 │   ├── utils/ (generic)
 │   └── stores/customizer.ts
 │
 └── App-Specific (NOT Exported) ← Tied to one specific application
     ├── constants/enums/approval.ts
     ├── stores/permissions.ts
     ├── types/approval/
     ├── types/cartable/
     └── composables/usePermissions.ts
```

---

## 4. Folder Structure

```
UI-kit/
├── dist/                          # Built distribution output
│   ├── ui-kit.es.js               # ES Module build
│   ├── ui-kit.cjs                 # CommonJS build
│   ├── style.css                  # Bundled styles
│   └── index.d.ts                 # TypeScript declarations
│
├── docs/                          # Additional documentation
├── public/                        # Static assets for dev server
├── scripts/
│   └── deploy.sh                  # Deployment script
│
├── src/
│   ├── assets/
│   │   ├── fonts/IRANSansWeb.ts   # Persian web font
│   │   └── images/
│   │
│   ├── components/
│   │   ├── shared/                # Reusable UI components (17 components)
│   │   │   ├── BaseBreadcrumb.vue
│   │   │   ├── BaseIcon.vue
│   │   │   ├── ConfirmDialog.vue
│   │   │   ├── CustomAutocomplete.vue
│   │   │   ├── data-table-v2/CustomDataTableV2.vue # Current table; exported under both names
│   │   │   │   ├── components/
│   │   │   │   │   ├── DataTableCellContent.vue
│   │   │   │   │   └── DataTableFilterFields.vue
│   │   │   │   └── composables/
│   │   │   │       ├── useDataTableCellDisplay.ts
│   │   │   │       ├── useDataTableDownload.ts
│   │   │   │       ├── useDataTableExport.ts
│   │   │   │       ├── useDataTableFetch.ts
│   │   │   │       └── useDataTableFilters.ts
│   │   │   ├── DescriptionInput.vue
│   │   │   ├── DownloadButton.vue
│   │   │   ├── MoneyInput.vue
│   │   │   ├── PdfViewer.vue
│   │   │   ├── ShamsiDatePicker.vue
│   │   │   ├── ToggleSwitch.vue
│   │   │   ├── UiChildCard.vue
│   │   │   ├── UiParentCard.vue
│   │   │   └── VPriceTextField.vue
│   │   │
│   │   ├── common/
│   │   │   └── AppStepper.vue
│   │   │
│   │   ├── layout/                # App shell components
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppLayout.vue
│   │   │   ├── AppSidebar.vue
│   │   │   ├── NavCollapse.vue
│   │   │   ├── NavGroup.vue
│   │   │   └── NavItem.vue
│   │   │
│   │   └── Loading.vue
│   │
│   ├── composables/               # Shared logic hooks
│   │   ├── useDataTable.ts        # Server-side table logic
│   │   ├── useTableActions.ts     # CRUD dialogs
│   │   ├── useTableHeaders.ts     # Column config utilities
│   │   ├── useTableSelection.ts   # Row selection
│   │   ├── usePermissions.ts      # (app-specific, not exported)
│   │   └── useRouteGuard.ts       # (app-specific, not exported)
│   │
│   ├── constants/
│   │   └── enums/
│   │       ├── booleanEnum.ts     # (exported)
│   │       ├── approval.ts        # (app-specific)
│   │       ├── contractType.ts    # (app-specific)
│   │       ├── lcProductType.ts   # (app-specific)
│   │       └── repaymentType.ts   # (app-specific)
│   │
│   ├── directives/
│   │   ├── v-digit-limit.ts      # (exported)
│   │   └── v-permission.ts       # (app-specific, not exported)
│   │
│   ├── features/
│   │   └── index.ts              # Feature flags
│   │
│   ├── plugins/
│   │   ├── vuetify.ts            # Vuetify 3 + 14 themes
│   │   ├── key-clock.ts          # Keycloak auth
│   │   └── mdi-icon.ts           # Material Design Icons
│   │
│   ├── scss/
│   │   └── style.scss            # Global styles
│   │
│   ├── services/
│   │   ├── apiService.ts         # Generic CRUD helper
│   │   └── axiosInstance.ts      # Axios config & instance management
│   │
│   ├── stores/
│   │   ├── customizer.ts         # Theme/UI state (exported)
│   │   └── permissions.ts        # Menu permissions (app-specific)
│   │
│   ├── theme/
│   │   ├── lightThemes/          # 7 light themes
│   │   └── darkThemes/           # 7 dark themes
│   │
│   ├── types/                    # TypeScript types
│   │   ├── componentTypes/
│   │   │   ├── DataTableType.ts
│   │   │   └── DataTableTypes.ts  # (exported)
│   │   ├── components/layout/
│   │   │   └── menu.ts            # MenuItem, HeaderAction (exported)
│   │   ├── models/
│   │   │   ├── Base.ts
│   │   │   ├── person.ts
│   │   │   └── userInfo.ts
│   │   └── ...shims (*.d.ts)
│   │
│   ├── utils/
│   │   ├── date-convertor.ts      # Gregorian ↔ Shamsi (exported)
│   │   ├── number-formatter.ts    # Price/number formatting (exported)
│   │   ├── NationalCodeValidator.ts # Iranian ID validation (exported)
│   │   ├── greetingUtils.ts       # Greeting messages (exported)
│   │   ├── defaultFilterAdapter.ts
│   │   ├── helpers/
│   │   │   ├── fetch-wrapper.ts   # HTTP with auth (exported)
│   │   │   └── fake-backend.ts    # Mock API
│   │   └── appInitializer/
│   │       ├── AppBootstrap.ts    # App startup (exported)
│   │       ├── AuthModeInitializer.ts
│   │       ├── KeycloakInitializer.ts
│   │       ├── JwtInitializer.ts
│   │       └── InitializerModeInitializer.ts
│   │
│   ├── validators/
│   │   └── nationalCodeRule.ts    # Yup/vee-validate rule (exported)
│   │
│   └── index.ts                   # Main public entry point
│
├── vite.config.ts
├── tsconfig.json
├── tsconfig.lib.json
├── tsconfig.vite-config.json
├── eslint.config.js
├── .prettierrc
├── index.html
└── package.json
```

---

## 5. Libraries & Dependencies

### Peer Dependencies (must be installed by consumer)

| Library | Version | Purpose |
|---------|---------|---------|
| `vue` | ^3.x | Core framework |
| `vuetify` | ^3.x | UI component base |
| `vue-router` | ^4.x | Required by the current data table when rendered |

### Core Dependencies

| Library | Purpose |
|---------|---------|
| `pinia` | State management (reactive stores) |
| `axios` | HTTP client for API calls |
| `vee-validate` | Form validation |
| `yup` | Validation schema builder |

### UI & Visual

| Library | Purpose |
|---------|---------|
| `apexcharts` + `vue3-apexcharts` | Charts and data visualization |
| `@tabler/icons-vue` | Tabler icon set |
| `@mdi/js` | Material Design Icons (JS) |
| `remixicon` | Additional icon set |
| `vue3-lottie` | Lottie animation support |
| `vue3-perfect-scrollbar` | Custom scrollbar |
| `vue3-print-nb` | Print functionality |

### Persian/Localization

| Library | Purpose |
|---------|---------|
| `jalaali-js` | Gregorian ↔ Shamsi conversion |
| `date-fns` | Date utility functions |
| `vue3-persian-datetime-picker` | Persian date/time picker component |

### Authentication

| Library | Purpose |
|---------|---------|
| `@dsb-norge/vue-keycloak-js` | Keycloak SSO integration for Vue 3 |

---

## 6. Components

### Layout Components

| Component | Description |
|-----------|-------------|
| `AppLayout.vue` | Root layout shell wrapping header + sidebar + content |
| `AppHeader.vue` | Top navigation bar with customizer toggle, menu buttons |
| `AppSidebar.vue` | Collapsible side navigation drawer with logo & version badge |
| `NavItem.vue` | Single navigation menu item (icon + label + link) |
| `NavGroup.vue` | Collapsible group of navigation items |
| `NavCollapse.vue` | Nested collapsible menu support |

### Shared Components

| Component | Description |
|-----------|-------------|
| `CustomDataTable` | Compatibility alias of the current V2 implementation |
| `CustomDataTableV2` | Canonical current server-side data table implementation |
| `CustomAutocomplete.vue` | Enhanced Vuetify autocomplete with extra features |
| `ShamsiDatePicker.vue` | Persian calendar date/datetime/time picker |
| `MoneyInput.vue` | Currency amount input with formatting |
| `VPriceTextField.vue` | Price text field with comma formatting |
| `DescriptionInput.vue` | Multi-line textarea input |
| `ConfirmDialog.vue` | Reusable confirmation dialog (yes/no) |
| `DownloadButton.vue` | File download trigger button |
| `PdfViewer.vue` | Inline PDF document viewer |
| `ToggleSwitch.vue` | Boolean toggle switch input |
| `UiParentCard.vue` | Card container with title slot |
| `UiChildCard.vue` | Nested card container |
| `BaseIcon.vue` | Unified icon wrapper (MDI/Tabler/Remix) |
| `BaseBreadcrumb.vue` | Page breadcrumb navigation |
| `Loading.vue` | Full-screen loading overlay spinner |
| `AppStepper.vue` | Multi-step wizard/stepper component |

### CustomDataTable compatibility

`CustomDataTable` and `CustomDataTableV2` resolve to the same current implementation.
The former is retained as a compatibility export; no independent V1 component is
present on this branch. The component supports server pagination, optional infinite
scroll, selection, grouping, CRUD actions, filters, downloads, and optional XLSX
export, but most responsibilities remain in the main component.

---

## 7. Composables

### Generic (Exported)

| Composable | Description |
|------------|-------------|
| `useDataTable<T>` | Server-side pagination, fetching, sorting for any table |
| `useTableActions` | Manages open/close state of create/edit/delete dialogs |
| `useTableHeaders` | Utilities for building and filtering table column definitions |
| `useTableSelection` | Row selection state, grouping, bulk operations |

### DataTableV2 internals

The table currently extracts `DataTableFilterFields`, `headerFieldUtils`, and
`computeActionColumnWidth`. Fetch, CRUD, export, download, and most cell behavior
remain inside `CustomDataTableV2.vue`; additional decomposition is deferred.

### App-Specific (NOT Exported)

| Composable | Description |
|------------|-------------|
| `usePermissions` | Checks user role permissions for UI elements |
| `useRouteGuard` | Protects routes based on permissions |

---

## 8. State Management

### useCustomizerStore (Pinia) — Exported

Manages global UI layout and theming preferences.

```typescript
State {
  Sidebar_drawer: boolean       // Sidebar open/closed
  Customizer_drawer: boolean    // Theme customizer panel open
  mini_sidebar: boolean         // Collapsed icon-only sidebar
  fontTheme: string             // Active font
  inputBg: string               // Input background style
  layoutType: string            // Layout mode
  actTheme: string              // Active theme name
  loading: boolean              // Global loading indicator
  themeMode: 'light' | 'dark'   // Color mode
  menuOrientation: string       // Sidebar / top-nav / etc.
}

Actions {
  SET_SIDEBAR_DRAWER(val)
  SET_MINI_SIDEBAR(val)
  SET_CUSTOMIZER_DRAWER(val)
  SET_FONT(font)
  SET_THEME(theme)
  SET_LOADING(state)
  SET_LAYOUT_TYPE(type)
  SET_THEME_MODE(mode)
  SET_MENU_ORIENTATION(orientation)
}
```

### usePermissionsStore (Pinia) — NOT Exported

App-specific: stores menu permission rules for the sidebar.

---

## 9. Theming System

The library ships **14 pre-built Vuetify 3 themes** — 7 light and 7 dark — registered in `src/plugins/vuetify.ts`.

### Light Themes

| Theme | Primary Colors |
|-------|---------------|
| `ModernTheme` | Blue-based modern |
| `PurpleTheme` | Purple palette |
| `RedTheme` | Red/warm palette |
| `OrangeTheme` | Orange accent |
| `SteelTealGreen` | Steel + teal |
| `TealTheme` | Teal/green |
| `SilverTheme` | Gray/silver |
| `NavyGoldTheme` | Navy + gold |

### Dark Themes

| Theme | Base |
|-------|------|
| `DarkModernTheme` | Dark Modern |
| `DarkPurpleTheme` | Dark Purple |
| `DarkOrangeTheme` | Dark Orange |
| `DarkTealTheme` | Dark Teal |
| `DarkSteelTealGreen` | Dark Steel Teal |
| `DarkSilverTheme` | Dark Silver |
| `DarkRedTheme` | Dark Red |

Each theme defines all Vuetify color tokens: `primary`, `secondary`, `success`, `error`, `warning`, `info`, and surface/background variants.

The active theme is controlled by `useCustomizerStore.actTheme` and `themeMode`.

---

## 10. Authentication

Three auth modes are supported, selected via `VITE_AUTH_MODE` env variable:

### Mode 1: Keycloak (`VITE_AUTH_MODE=keycloak`)
- Uses `@dsb-norge/vue-keycloak-js`
- `KeycloakInitializer.ts` handles setup
- Axios instance is configured with Bearer token from Keycloak
- Plugin registered in `src/plugins/key-clock.ts`

### Mode 2: JWT (`VITE_AUTH_MODE=jwt`)
- `JwtInitializer.ts` handles token storage and refresh
- `fetch-wrapper.ts` adds Authorization header automatically

### Mode 3: Initializer (`VITE_AUTH_MODE=initializer`)
- `InitializerModeInitializer.ts` — custom initialization logic
- Used for applications with their own auth bootstrapping

### AppBootstrap.ts
Central entry point for application startup. Reads `VITE_AUTH_MODE` and delegates to the correct initializer. Consumer apps call this once at startup.

```typescript
import { AppBootstrap } from '@amirjalili1374/ui-kit';
AppBootstrap(app, router); // bootstraps auth + stores
```

---

## 11. Utilities & Helpers

### Date Conversion (`date-convertor.ts`)

```typescript
import { toShamsi, toGregorian } from '@amirjalili1374/ui-kit';

toShamsi('2024-08-11')     // → '1403/05/21'
toGregorian('1403/05/21')  // → '2024-08-11'
```

### Number Formatting (`number-formatter.ts`)

```typescript
import { formatNumberWithCommas, formatPrice } from '@amirjalili1374/ui-kit';

formatNumberWithCommas(1234567)         // → '1,234,567'
formatPrice(1234567, '﷼', 0)          // → '﷼1,234,567'
```

### Iranian National Code Validator (`NationalCodeValidator.ts`)

```typescript
import { NationalCodeValidator } from '@amirjalili1374/ui-kit';

NationalCodeValidator.validateReal('0012345678')  // 10-digit real person
NationalCodeValidator.validateLegal('12345678901') // 11-digit legal entity
```

### Digit Limit Directive (`v-digit-limit`)

```vue
<v-text-field v-digit-limit="10" />  <!-- Blocks input beyond 10 digits -->
```

### Greeting Utility (`greetingUtils.ts`)

Returns a context-aware greeting (morning, afternoon, evening) in Persian.

### Fetch Wrapper (`fetch-wrapper.ts`)

A lightweight wrapper around `fetch` that:
- Automatically appends Authorization headers from the active auth mode
- Handles 401 → redirect to login
- Provides typed response helpers

---

## 12. Services & API Layer

### apiService.ts

Generic CRUD service factory. Pass an axios instance and a resource URL:

```typescript
const myService = apiService(axiosInstance, '/api/users');

myService.fetch({ page: 1, pageSize: 10 })   // GET list (paginated)
myService.get(id)                             // GET single
myService.create(payload)                     // POST
myService.update(id, payload)                 // PUT/PATCH
myService.delete(id)                          // DELETE
myService.exportExcel(filters)               // GET Excel blob
```

### axiosInstance.ts

Manages a singleton Axios instance for the library:

```typescript
import { configureAxiosInstance, getAxiosInstance } from '@amirjalili1374/ui-kit';

// Consumer app sets their pre-configured axios instance:
configureAxiosInstance(myAxios);

// Library components use:
const axios = getAxiosInstance(); // returns configured instance or default
```

---

## 13. Build System

### Vite Configuration (`vite.config.ts`)

Two build modes controlled by `BUILD_LIB` env variable:

**Library Mode** (`BUILD_LIB=true`, triggered by `npm run build:lib`):
```
Input:  src/index.ts
Output: dist/ui-kit.es.js  (ES Module)
        dist/ui-kit.cjs    (CommonJS)
        dist/style.css
        dist/index.d.ts
Externals: vue, vuetify, pinia, vue-router, @mdi/js, axios, ...
Minifier: Oxc (Rolldown/Vite 8)
```

**Application Mode** (default dev):
```
Dev server: localhost:${VITE_PORT || 5050}
Code splitting: vendors + charts chunks
Multi-env: dev / prelive / live / demo
```

### npm Scripts

The repository standardizes on npm 11 and the committed `package-lock.json`.
`npm run build` builds the demo application; `npm run build:lib` builds the
publishable ESM/CJS package. Components are named imports. Calling `app.use(UiKit)`
registers only `v-digit-limit`.

| Script | Purpose |
|--------|---------|
| `dev` | Start development server |
| `build:lib` | Build distributable npm package |
| `build:types` | Generate TypeScript declarations |
| `prepublishOnly` | Auto-runs type gen + lib build before `npm publish` |
| `typecheck` | Run TypeScript compiler check |
| `lint` / `lint:check` | Run ESLint without modifying files |
| `lint:fix` | Run ESLint with explicit auto-fix |
| `test:consumer` | Verify the packed tarball in a temporary Vite consumer |
| `validate` | Run lint, types, coverage, library build, and packed consumer gates |
| `format` | Run Prettier |
| `clean` | Delete `dist/` |
| `analyze` | Open bundle analyzer |

Before any separately authorized publish, run `npm ci`, `npm run validate`, and
`npm pack --dry-run`. The packed consumer check installs the tarball with Vue,
Vuetify, Pinia, and Vue Router, then verifies declarations, ESM, CommonJS, CSS, and
a Vite production build. Client-side table export requires optional `xlsx`. The
table, file/PDF features, loading animation, and authentication helpers use browser
APIs; SSR is not currently validated.

---

## 14. Environment Configuration

| Variable | Description | Example Values |
|----------|-------------|----------------|
| `VITE_APP_ENV` | Environment name | `dev`, `prelive`, `live`, `demo` |
| `VITE_APP_TITLE` | Application title | `My Enterprise App` |
| `VITE_API_BASE_URL` | Backend API root URL | `https://api.example.com` |
| `VITE_BASE_URL` | App deployment base path | `/`, `/app/` |
| `VITE_PORT` | Dev server port | `5050` |
| `VITE_DEBUG` | Enable debug logging | `true`, `false` |
| `VITE_AUTH_MODE` | Auth strategy | `keycloak`, `jwt`, `initializer` |

`.env` files per environment: `.env.dev`, `.env.prelive`, `.env.live`, `.env.demo`

---

## 15. Diagrams

### Component Hierarchy

```
AppLayout
├── AppHeader
│   ├── BaseIcon (menu toggle)
│   └── (slot: user actions)
│
├── AppSidebar
│   ├── (logo slot)
│   ├── NavGroup
│   │   └── NavCollapse
│   │       └── NavItem
│   └── (version badge)
│
└── <router-view> (page content)
    ├── UiParentCard
    │   ├── BaseBreadcrumb
    │   └── UiChildCard
    │       ├── CustomDataTableV2
    │       │   ├── DataTableFilterFields
    │       │   └── DataTableCellContent
    │       ├── ShamsiDatePicker
    │       ├── MoneyInput / VPriceTextField
    │       └── ConfirmDialog
    └── AppStepper (multi-step forms)
```

### Authentication Flow

```
App Startup
    │
    ▼
AppBootstrap(app, router)
    │
    ├── VITE_AUTH_MODE=keycloak ──► KeycloakInitializer
    │                                  │
    │                                  ├── Init Keycloak SDK
    │                                  ├── Obtain token
    │                                  └── Inject into axios
    │
    ├── VITE_AUTH_MODE=jwt ────────► JwtInitializer
    │                                  │
    │                                  ├── Read token from storage
    │                                  ├── Setup refresh interceptor
    │                                  └── Inject into axios
    │
    └── VITE_AUTH_MODE=initializer ─► InitializerModeInitializer
                                        │
                                        └── Custom app logic
```

### Data Table Request/Response Flow

```
User interacts with CustomDataTableV2
    │
    ▼
useDataTableFetch composable
    │
    ├── Builds query params (page, size, sort, filters)
    │
    ▼
apiService.fetch(params)
    │
    ▼
axiosInstance → Backend API
    │
    ▼
Response { items: T[], total: number }
    │
    ├── useDataTableFilters  → filter state updated
    ├── useDataTableCellDisplay → format dates/numbers
    └── Vuetify v-data-table-server renders rows
```

### Theme Selection Flow

```
useCustomizerStore
    │
    ├── actTheme = 'ModernTheme'
    ├── themeMode = 'light' | 'dark'
    │
    ▼
vuetify.ts plugin
    │
    ├── Reads store values
    └── Sets useTheme().global.name.value = actTheme
            │
            ▼
    Vuetify applies CSS variables
    across all Vuetify components globally
```

### State Management Store Map

```
Pinia
├── useCustomizerStore  (exported)
│   ├── sidebar state
│   ├── theme state
│   └── loading state
│
└── usePermissionsStore (NOT exported — app-specific)
    └── menu permission rules
```

---

## 16. Public API (Exported Members)

### Components
```typescript
export {
  // Shared
  CustomDataTable, CustomDataTableV2,
  CustomAutocomplete, ShamsiDatePicker,
  MoneyInput, VPriceTextField, DescriptionInput,
  ConfirmDialog, DownloadButton, PdfViewer,
  ToggleSwitch, UiParentCard, UiChildCard,
  BaseIcon, BaseBreadcrumb, Loading, AppStepper,
  // Layout
  AppLayout, AppHeader, AppSidebar,
  NavItem, NavGroup, NavCollapse,
}
```

### Composables
```typescript
export { useDataTable, useTableActions, useTableHeaders, useTableSelection }
```

### Stores
```typescript
export { useCustomizerStore }
```

### Utilities
```typescript
export { toShamsi, toGregorian }           // date-convertor
export { formatNumberWithCommas, formatPrice } // number-formatter
export { NationalCodeValidator }           // ID validation
export { greetingUtils }                   // greeting messages
export { fetchWrapper }                    // auth-aware HTTP
```

### App Bootstrap
```typescript
export { AppBootstrap, AuthModeInitializer, KeycloakInitializer, JwtInitializer }
```

### Directives
```typescript
export { DigitLimit }  // v-digit-limit directive
export function install(app: App): void  // registers only v-digit-limit; components remain named imports
```

### Types
```typescript
export type { DataTableHeader, TableItem, CustomAction, ActionConfig }
export type { MenuItem, HeaderAction }
export type { BooleanEnum }
```

### Validators
```typescript
export { nationalCodeRule }  // yup/vee-validate rule
```

---

## 17. Code Patterns

### Vue 3 `<script setup>` with TypeScript

All components use the Composition API `<script setup>` syntax:

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { DataTableHeader } from '@/types/componentTypes/DataTableTypes';

interface Props {
  headers: DataTableHeader[];
  autoFetch?: boolean;
  pageSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  autoFetch: true,
  pageSize: 10,
});

const emit = defineEmits<{
  'row-click': [item: unknown];
  'selection-change': [items: unknown[]];
}>();
</script>
```

### Generic Composable Pattern

```typescript
export function useDataTable<T = any>(options: DataTableOptions<T>) {
  const items = ref<T[]>([]);
  const loading = ref(false);
  const total = ref(0);

  async function fetchData(params: FetchParams) {
    loading.value = true;
    try {
      const response = await options.fetchFn(params);
      items.value = response.data;
      total.value = response.total;
    } finally {
      loading.value = false;
    }
  }

  return { items, loading, total, fetchData };
}
```

### Pinia Store Pattern

```typescript
export const useCustomizerStore = defineStore('customizer', {
  state: () => ({
    actTheme: 'ModernTheme',
    themeMode: 'light' as 'light' | 'dark',
    loading: false,
  }),
  actions: {
    SET_THEME(theme: string) {
      this.actTheme = theme;
    },
    SET_THEME_MODE(mode: 'light' | 'dark') {
      this.themeMode = mode;
    },
  },
});
```

### Code Quality Configuration

**ESLint:** TypeScript + Vue 3 essential rules, errors for `console` in production.

**Prettier:**
```json
{
  "printWidth": 140,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none"
}
```

**TypeScript:** Strict mode, path aliases (`@/` → `src/`), Vue SFC support.

---

*Documentation generated from source analysis of UI-Kit v1.6.13*
