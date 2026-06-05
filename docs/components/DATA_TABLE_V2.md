# CustomDataTableV2

Refactored data table with the same props/API as `CustomDataTable`, plus bug fixes. The original component is **unchanged** for existing projects.

## Migration

```vue
<script setup lang="ts">
import { CustomDataTableV2, type Header } from '@amirjalili1374/ui-kit'
</script>

<template>
  <CustomDataTableV2
    api-resource="/api/users"
    :headers="headers"
    :height="500"
    v-model:selected-items="selected"
  />
</template>
```

## Bug fixes vs v1

- `v-model:selectedItems` syncs from parent (watch + initial mount)
- Delete uses `uniqueKey`, not hardcoded `id`
- Infinite scroll: opt-in via `enableInfiniteScroll` (wired to `@scroll` on container)
- `loadMore` uses correct `response.data.page.totalPages` and full filter/criteria merge
- Removed dead code (`filters` reactive orphan, `globalSearchMode`, duplicate filter-dialog watch)
- Fixed save button typo (`var` attribute)
- Axios `content-type` check uses `typeof === 'string'`

## New prop

| Prop | Default | Description |
|------|---------|-------------|
| `enableInfiniteScroll` | `false` | Append next page when scrolling near bottom |

## Module layout

```
src/components/shared/data-table-v2/
  CustomDataTableV2.vue      # UI (migrating to smaller pieces over time)
  composables/               # fetch, filters, selection, export, download, …
  components/                # DataTableFilterFields, DataTableCellContent, …
  headerFieldUtils.ts
  computeActionColumnWidth.ts
```

Further refactors will move CRUD/template blocks into composables without touching `CustomDataTable.vue`.
