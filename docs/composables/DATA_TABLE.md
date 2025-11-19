# Data Table Composables

Composables for managing data table functionality.

## useDataTable

Manages data table state, pagination, and data fetching.

### Returns

```typescript
{
  items: Ref<TableItem[]>
  loading: Ref<boolean>
  pagination: Ref<PaginationState>
  fetchData: () => Promise<void>
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
}
```

### Usage

```typescript
import { useDataTable } from '@amirjalili1374/ui-kit'

const {
  items,
  loading,
  pagination,
  fetchData,
  loadMore,
  refresh
} = useDataTable({
  apiUrl: '/api/users',
  serverSide: true,
  axiosInstance: customAxiosInstance
})

// Fetch initial data
await fetchData()

// Load more (for infinite scroll)
await loadMore()

// Refresh data
await refresh()
```

## useTableActions

Manages custom actions and buttons for data table rows.

### Returns

```typescript
{
  actions: ComputedRef<CustomAction[]>
  buttonActions: ComputedRef<CustomButtonAction[]>
  executeAction: (action: CustomAction, item: TableItem) => void
}
```

### Usage

```typescript
import { useTableActions } from '@amirjalili1374/ui-kit'

const { actions, buttonActions, executeAction } = useTableActions({
  actions: [
    {
      title: 'Edit',
      component: EditButton,
      condition: (item) => item.canEdit
    }
  ],
  buttonActions: [
    {
      label: 'Delete',
      color: 'error',
      onClick: (item) => deleteItem(item.id)
    }
  ]
})
```

## useTableHeaders

Manages table header configuration and transformations.

### Returns

```typescript
{
  processedHeaders: ComputedRef<Header[]>
  sortableHeaders: ComputedRef<Header[]>
  filterableHeaders: ComputedRef<Header[]>
}
```

### Usage

```typescript
import { useTableHeaders } from '@amirjalili1374/ui-kit'

const { processedHeaders, sortableHeaders } = useTableHeaders({
  headers: rawHeaders,
  enableSorting: true,
  enableFiltering: true
})
```

## useTableSelection

Manages row selection state and operations.

### Returns

```typescript
{
  selectedItems: Ref<TableItem[]>
  selectedIds: ComputedRef<string[]>
  isSelected: (item: TableItem) => boolean
  selectItem: (item: TableItem) => void
  selectAll: () => void
  clearSelection: () => void
}
```

### Usage

```typescript
import { useTableSelection } from '@amirjalili1374/ui-kit'

const {
  selectedItems,
  selectedIds,
  isSelected,
  selectItem,
  selectAll,
  clearSelection
} = useTableSelection({
  items,
  keyField: 'id'
})

// Check if item is selected
if (isSelected(item)) {
  // ...
}

// Select an item
selectItem(item)

// Select all items
selectAll()

// Clear selection
clearSelection()
```

