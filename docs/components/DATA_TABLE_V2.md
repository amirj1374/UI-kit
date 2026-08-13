# CustomDataTableV2

This is the current data-table implementation. `CustomDataTable` and
`CustomDataTableV2` both export this component; the old name is retained as a
backward-compatible import alias. There is no separate V1 implementation on `v2`.

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

## Compatibility behavior

- Local `items` initialize the rendered rows and stay synchronized on prop updates.
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
  components/                # DataTableFilterFields
  headerFieldUtils.ts
  computeActionColumnWidth.ts
```

The component currently uses Vue Router directly. Consumers that render it must
install `vue-router` on the application. Client-side Excel export dynamically loads
the optional `xlsx` package and reports a clear error if the feature is invoked
without it.

The current remote request contract does not send sorting state. The only named
slot implemented by the component is `inline-filter-actions`. Request failures are
rendered as an accessible alert; requests are not cancelled or sequence-guarded.

See **[DATA_TABLE_V2_BEHAVIOR_CONTRACT.md](./DATA_TABLE_V2_BEHAVIOR_CONTRACT.md)**
for the tested contract and explicit remaining limitations.

Further decomposition is intentionally deferred until integration coverage exists.
Compatibility work must preserve both public export names.
