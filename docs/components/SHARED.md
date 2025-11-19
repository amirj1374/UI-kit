# Shared Components

Reusable UI components for common use cases.

## CustomDataTable

A powerful, feature-rich data table component with sorting, filtering, pagination, and CRUD operations.

### Features

- Server-side and client-side pagination
- Sorting and filtering
- Create, Update, Delete operations
- Text truncation with preview dialog
- Copy to clipboard functionality
- Customizable form fields (textarea, column span, text direction)
- Custom actions and buttons
- Row selection
- Export functionality

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `headers` | `Header[]` | `[]` | Table column definitions |
| `items` | `TableItem[]` | `[]` | Table data items |
| `serverSide` | `boolean` | `false` | Enable server-side pagination |
| `apiUrl` | `string` | `''` | API endpoint for server-side data |
| `axiosInstance` | `AxiosInstance` | `undefined` | Custom Axios instance |
| `maxTextLength` | `number` | `50` | Maximum text length before truncation |
| `...` | | | See [DataTableTypes](../types/DATA_TABLE.md) for full props |

### Header Properties

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Column title |
| `key` | `string` | Data key |
| `sortable` | `boolean` | Enable sorting |
| `width` | `number` | Column width |
| `truncate` | `boolean` | Enable text truncation |
| `showCopyButton` | `boolean` | Show copy button |
| `cols` | `number \| string` | Form field column span (1-12) |
| `textarea` | `boolean` | Render as textarea in forms |
| `dir` | `'ltr' \| 'rtl'` | Text direction for form field |

### Usage

```vue
<script setup lang="ts">
import { CustomDataTable, type Header } from '@amirjalili1374/ui-kit'

const headers: Header[] = [
  {
    title: 'Name',
    key: 'name',
    sortable: true,
    truncate: true,
    showCopyButton: true
  },
  {
    title: 'Script',
    key: 'script',
    sortable: true,
    width: 250,
    textarea: true,
    dir: 'ltr',
    cols: 5,
    truncate: true
  }
]

const items = [
  { id: 1, name: 'John Doe', script: 'Long script text...' }
]
</script>

<template>
  <CustomDataTable
    :headers="headers"
    :items="items"
    :maxTextLength="50"
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

