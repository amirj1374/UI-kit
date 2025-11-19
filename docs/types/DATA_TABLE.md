# Data Table Types

TypeScript interfaces and types for CustomDataTable component.

## Header

Column definition interface.

```typescript
interface Header {
  title: string
  key: string
  sortable?: boolean
  width?: number
  align?: 'start' | 'center' | 'end'
  truncate?: boolean
  showCopyButton?: boolean
  cols?: number | string
  textarea?: boolean
  dir?: 'ltr' | 'rtl'
  // ... other properties
}
```

## TableItem

Data item interface for table rows.

```typescript
interface TableItem {
  [key: string]: any
}
```

## DataTableProps

Props interface for CustomDataTable component.

```typescript
interface DataTableProps {
  headers: Header[]
  items: TableItem[]
  serverSide?: boolean
  apiUrl?: string
  axiosInstance?: AxiosInstance
  maxTextLength?: number
  // ... other props
}
```

## CustomAction

Custom action button interface.

```typescript
interface CustomAction {
  title: string
  component: Component
  condition?: (item: TableItem) => boolean
}
```

## CustomButtonAction

Custom button action interface.

```typescript
interface CustomButtonAction {
  label: string
  color?: string
  variant?: string
  onClick: (item: TableItem) => void
  condition?: (item: TableItem) => boolean
}
```

