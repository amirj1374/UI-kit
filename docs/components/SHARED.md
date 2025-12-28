# Shared Components

Reusable UI components for common use cases.

## CustomDataTable

A powerful, feature-rich data table component with server-side pagination, filtering, grouping, selection, CRUD actions, custom actions, downloads, and dialogs.

### Features

- **Server-side pagination & infinite scroll**: Works with paged APIs (`page`, `size`, `totalElements`, `totalPages`) and can auto-load more items on scroll.
- **Filtering**: Built-in filter dialog (auto-generated from headers) with support for Java/Spring-style operators (`equals`, `in`, `contains`, …) and custom filter component.
- **Create / Update / Delete dialogs**: Auto-generated form based on `headers`, or full custom form via `formComponent`.
- **Row selection & bulk mode**: Single/multi select, external selection via `v-model:selectedItems`, and bulk mode with radio-style selection and optional group delete.
- **Grouping**: Group rows by field or function, with expand/collapse controls and ARIA attributes.
- **Custom actions & routes**: Dynamic actions column with CRUD, dynamic route buttons, download buttons, custom actions (component dialogs), and custom buttons.
- **Text utilities**: Optional global text truncation with preview dialog and copy-to-clipboard (cell text or full record).
- **Date & money support**: Shamsi/Gregorian conversion for `date` fields and formatted money display via `type: 'money'`.

### Core Props (DataTableProps)

For the full type definition see **[DataTableTypes](../types/DATA_TABLE.md)**. Commonly used props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiResource` | `string` | **required** | Base API resource used by the internal `apiService` (`fetch/create/update/delete`). |
| `headers` | `Header[]` | `[]` | Column and form definitions (see Header Properties). |
| `actions` | `('create' \| 'edit' \| 'delete' \| 'view' \| 'filter')[]` | `[]` | Enables built-in action buttons and dialogs. |
| `routes` | `TableRoutes \| (item: TableItem) => TableRoutes` | `undefined` | Dynamic route templates used by route action buttons. |
| `downloadLink` | `Record<string, string>` | `undefined` | Map of button label to field key containing a file URL on each row. |
| `formComponent` | `Component` | `undefined` | Custom create/edit form component (replaces auto-generated form). |
| `customActions` | `CustomAction[]` | `[]` | Actions that open custom dialog components per row. |
| `customButtons` | `CustomButtonAction[]` | `[]` | Static custom buttons per row. |
| `customButtonsFn` | `(item: TableItem) => CustomButtonAction[]` | `undefined` | Dynamic custom buttons per row. |
| `filterComponent` | `Component` | `undefined` | Custom filter component (replaces auto-generated filter dialog). |
| `autoFetch` | `boolean` | `true` | Automatically call `fetchData()` on mount. |
| `queryParams` | `Record<string, unknown>` | `{}` | Extra query params sent with each fetch. |
| `showPagination` | `boolean` | `true` | Show pagination bar at the bottom. |
| `height` | `number` | **required** | Table container height in pixels. |
| `showRefreshButton` | `boolean` | `false` | Show a refresh button that re-fetches data. |
| `title` | `string` | `undefined` | Optional page/title shown above the table. |
| `selectable` | `boolean` | `false` | Enable selection of rows. |
| `multiSelect` | `boolean` | `false` | Allow selecting multiple rows (checkboxes). |
| `selectedItems` | `TableItem[]` | `[]` | External selection model (used with `v-model:selectedItems`). |
| `uniqueKey` | `string \| (item: TableItem) => string \| number` | `'id'` | Unique identifier per row (used for selection & grouping). |
| `pageSize` | `number` | `10` | Items per page for server-side pagination. |
| `groupBy` | `string \| (item: TableItem) => string \| number` | `undefined` | Enables grouping, determines group key. |
| `defaultExpanded` | `boolean` | `false` | Expand all groups by default. |
| `defaultSelected` | `string` | `undefined` | Name of boolean field that marks rows as pre-selected. |
| `dateWithTimezone` | `boolean` | `false` | Save dates as ISO with timezone offset instead of `YYYY-MM-DD`. |
| `bulkMode` | `boolean` | `false` | Enables bulk selection mode with radio selection and external actions. |
| `axiosInstance` | `AxiosInstance` | default app instance | Custom Axios instance used by the internal `apiService`. |
| `enableTextTruncation` | `boolean` | `false` | Enable global text truncation for cells. |
| `maxTextLength` | `number` | `50` | Max characters before truncation (when enabled). |

### Header Properties (Header)

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Column/form field label. |
| `key` | `string` | Data key (supports nested keys via dot-path, e.g. `user.name`). |
| `sortable` | `boolean` | Enable sorting (Vuetify-level). |
| `width` | `number` | Column width in pixels; if omitted, width is auto-estimated. |
| `type` | `'text' \| 'date' \| 'textarea' \| 'money' \| 'toggle' \| 'toggleSwitch' \| 'autocomplete' \| string` | Controls input component type in forms and some cell behavior (date/money/toggle). |
| `dateMode` | `'single' \| 'range'` | For `type='date'` headers: `'single'` for single date (default) or `'range'` for date range picker. In range mode, the value will be `[startDate, endDate]`. |
| `truncate` | `boolean` | Enable truncation for this column (works with `enableTextTruncation`). |
| `showCopyButton` | `boolean` | Show a small copy button for this column. |
| `cols` | `number \| string` | Form field column span (1–12) in the generated form/filter dialog. |
| `dir` | `'ltr' \| 'rtl'` | Text direction for the input field. |
| `excludeFromForm` | `boolean` | Show in table but exclude from create/edit form (e.g. `createdAt`). |
| `autocomplete*` | `…` | Configuration for `v-autocomplete` (items source, title/value keys, multiple, returnObject). |
| `options` | `{ title: string; value: string \| number \| boolean }[]` | Enum-like options used with `translate` or custom renderers. |
| `conditionalStyle` | `(value, item) => Record<string, string>` | Apply conditional inline styles per cell. |
| `customRenderer` | `(item) => string \| number \| boolean` | Custom renderer for cell value. |
| `formatter` | `(value, item) => string` | Formatter used by `getTranslatedValue` for display. |
| `filterOperators` | `FilterOperator[]` | Supported Java-style filter operators for this column. |
| `defaultFilterOperator` | `FilterOperator` | Default operator in auto filter UI (defaults to `'equals'`). |

Legacy/compatibility header fields (`isDate`, `textarea`, `toggleSwitch`) are still supported but you should prefer `type`.

### Usage

```vue
<script setup lang="ts">
import { CustomDataTable, type Header } from '@amirjalili1374/ui-kit'
import { ref } from 'vue'

const selectedItems = ref([])

const headers: Header[] = [
  {
    title: 'Name',
    key: 'name',
    sortable: true,
    truncate: true,
    showCopyButton: true
  },
  {
    title: 'Created Date',
    key: 'createdAt',
    type: 'date',
    dateMode: 'range', // Enable date range picker in filter dialog
    sortable: true
  },
  {
    title: 'Script',
    key: 'script',
    sortable: true,
    width: 250,
    type: 'textarea',
    dir: 'ltr',
    cols: 5,
    truncate: true
  }
]
</script>

<template>
  <CustomDataTable
    api-resource="/api/users"
    :headers="headers"
    height="600"
    :actions="['create', 'edit', 'delete', 'view', 'filter']"
    selectable
    multi-select
    v-model:selected-items="selectedItems"
    :enable-text-truncation="true"
    :max-text-length="50"
  />
</template>
```

## CustomAutocomplete

An autocomplete component with search functionality.

### Usage

```vue
<script setup lang="ts">
import { CustomAutocomplete } from '@amirjalili1374/ui-kit'
import { ref } from 'vue'

const selected = ref(null)
const items = ['Option 1', 'Option 2', 'Option 3']
</script>

<template>
  <CustomAutocomplete
    v-model="selected"
    :items="items"
    label="Select an option"
  />
</template>
```

## ShamsiDatePicker

A Persian (Jalali) date picker component.

### Usage

```vue
<script setup lang="ts">
import { ShamsiDatePicker } from '@amirjalili1374/ui-kit'
import { ref } from 'vue'

const date = ref(null)
</script>

<template>
  <ShamsiDatePicker v-model="date" label="Select Date" />
</template>
```

## MoneyInput

A formatted money/currency input component.

### Usage

```vue
<script setup lang="ts">
import { MoneyInput } from '@amirjalili1374/ui-kit'
import { ref } from 'vue'

const amount = ref(0)
</script>

<template>
  <MoneyInput v-model="amount" label="Amount" />
</template>
```

## ConfirmDialog

A confirmation dialog component.

### Usage

```vue
<script setup lang="ts">
import { ConfirmDialog } from '@amirjalili1374/ui-kit'
import { ref } from 'vue'

const showDialog = ref(false)

const handleConfirm = () => {
  // Handle confirmation
  showDialog.value = false
}
</script>

<template>
  <ConfirmDialog
    v-model="showDialog"
    title="Confirm Action"
    message="Are you sure?"
    @confirm="handleConfirm"
  />
</template>
```

## Other Components

- **BaseBreadcrumb** - Breadcrumb navigation
- **BaseIcon** - Icon wrapper component
- **DescriptionInput** - Multi-line description input
- **DownloadButton** - Download button with progress
- **PdfViewer** - PDF viewer component
- **UiChildCard** - Child card container
- **UiParentCard** - Parent card container
- **VPriceTextField** - Price input field

