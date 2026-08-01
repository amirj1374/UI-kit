# CustomDataTableV2 verified behavior contract

This document describes the implementation protected by automated tests on the
`v2` line. It is a behavior record, not a proposed redesign.

## Status vocabulary

- **Tested**: exercised through the public component or package surface.
- **Partially tested**: a representative public path is protected; variants remain.
- **Supported, not fully tested**: present in source but not comprehensively exercised.
- **Not supported**: no working implementation exists in the current component.
- **Known defect**: deterministic behavior is preserved and called out for follow-up.

## Package and runtime contract

- **Tested:** `CustomDataTableV2` and `CustomDataTable` are package-root aliases of
  the same implementation. Neither name is deprecated.
- **Tested:** the packed consumer can typecheck and render both names without a
  private `src` import.
- Vue, Vuetify, and Vue Router are peers. Rendering currently calls `useRouter`
  directly, so applications rendering the table must install a router.
- An `axiosInstance` prop overrides the configured/global Axios fallback.
- `xlsx` is optional and dynamically imported only for client-side export.

## Data modes and requests

- **Tested local mode:** `items` renders without a request when `autoFetch` is
  false, and prop replacement updates the rendered rows. Local pagination,
  filtering, and sorting are delegated to Vuetify and are not contractually
  mapped by this component.
- **Tested remote mode:** the table issues `GET <apiResource>` on mount when
  `autoFetch` is true. With pagination enabled it sends `page` (zero-based) and
  `size`; the UI page is one-based.
- Query precedence is generated filters, `queryParams`, external criteria, then
  per-call query parameters. When external criteria is non-empty, generated
  filters are omitted.
- Paged responses use `data.content` and optional `data.page` metadata. Unpaged
  mode accepts an array, `{ content: [] }`, or a single object. Empty or malformed
  bodies normalize to no rows.
- **Known defect:** requests are not cancelled or sequence-guarded; an older
  response can overwrite newer data.

## Pagination, sorting, and filtering

- **Tested:** page changes convert one-based UI state to zero-based request
  parameters. `pageSize` resets the page to one and triggers a debounced fetch.
- **Not supported by the component request contract:** `sortBy` is declared but
  is not connected to table state or server parameters. Do not rely on remote
  sorting until a compatible behavior is intentionally introduced.
- **Tested:** empty strings, `null`, and `undefined` are excluded from generated
  filters. Ordinary headers send `field=value`; headers with `filterOperators`
  send Spring-style keys such as `field.contains`. `in` arrays are comma joined.
- **Tested:** generated filter changes are debounced by 300 ms; explicit custom
  filter apply calls fetch immediately. A `filterAdapter` may replace generated
  criteria. External criteria can be set through `setCriteria`.
- Date/date-range, autocomplete, money, textarea, and toggle controls are
  **supported, not fully tested** at the component-integration level. Their field
  resolution helpers have focused unit coverage.

## Selection and grouping

- **Tested:** single/multiple toggling uses `uniqueKey` (including nested keys or
  a function), emits both `update:selectedItems` and `selection-change`, accepts
  external `selectedItems`, and exposes selection getters/clearing.
- **Partially tested:** bulk mode forces single radio-style selection; multi-select
  and bulk mode should not be combined. Selection persistence is identity-based
  and bulk selections missing after refresh are removed.
- **Tested:** grouping accepts a field/function, renders sorted flat groups,
  exposes expand/collapse operations, and supports Enter/Space activation with
  `aria-expanded`/`aria-controls`. Nested grouping and group-level selection are
  not supported.

## Routing and CRUD

- **Tested:** route maps (or per-row route factories) interpolate `{field}` values
  and call the installed router. Missing fields stop navigation and show a
  message. Named route objects, route query construction, and navigation-failure
  handling are not supported.
- **Tested:** the generated create dialog posts to the resource and refreshes;
  delete uses the configured `uniqueKey`, deletes `resource/<key>`, and refreshes.
- **Supported, not fully tested:** edit sends a full-body `PUT`; custom form
  components replace generated fields; bulk delete sends comma-separated keys.
- **Known defect:** edit/update detection still requires a truthy `id` in the form
  payload even when another `uniqueKey` is configured.

## Infinite scroll and async states

- **Tested:** opt-in scroll loading increments the zero-based request page,
  appends rows, prevents concurrent loads, stops at `totalPages`, and reverts the
  page counter after failure.
- **Tested:** initial/refresh loading sets `aria-busy`; successful completion
  clears it. Empty data uses Vuetify's configured no-data text.
- **Tested:** request failures render an assertive `role="alert"`; a later success
  clears the alert. There is no retry button or error slot.

## Export, download, and clipboard

- **Tested client export:** local/current rows are mapped to titled headers,
  booleans are localized, money totals are appended, and `xlsx.writeFile` receives
  the configured filename plus date. Missing `xlsx` throws a clear installation
  error from the export routine (**supported by source, missing-dependency branch
  not yet integration-tested because `xlsx` is installed in the test workspace**).
- **Tested server export:** `GET exportUrl` receives filters/query/pagination,
  accepts base64 from a string or `data`/`file`/`content`, creates a Blob download,
  and revokes its object URL. Server export errors are logged; no error event is
  emitted.
- **Tested download:** the row field configured by `downloadLink` is fetched with
  credentials, downloaded through a temporary anchor, and cleaned up. Axios blob
  fallback and XML/small-error variants are supported but only partially tested.
- **Tested clipboard:** preview text uses `navigator.clipboard.writeText`, falling
  back to `document.execCommand('copy')` when necessary.

## Renderers, slots, emits, and exposed members

- **Tested:** headers, local/remote rows, formatter, custom renderer, conditional
  style, no-data content, and stable `uniqueKey` selection behavior.
- The only public named slot implemented by this component is
  `inline-filter-actions`, with `applyFilter`, `resetFilter`,
  `hasActiveFilters`, and `filterModel` slot props. Custom cells, headers, empty,
  loading, action, expanded-row, and dialog slots are **not supported**.
- Emits: `update:selectedItems`, `selection-change`.
- **Tested exposed members:** `fetchData`, `getItems`, `getSelectedItems`,
  `clearSelection`, `groupedItems`, `toggleGroup`, `expandAllGroups`,
  `collapseAllGroups`, `formModel`, `getFilters`, and `setCriteria`.

## Accessibility and browser boundaries

- The container exposes busy/live semantics; groups expose keyboard activation
  and expansion relationships; errors use an assertive alert.
- Selection controls and several icon-only actions rely on Vuetify defaults and
  do not consistently have explicit table-specific accessible names.
- Export, download, clipboard, teleported dialogs, and scrolling are browser-only.
  Tests replace network, Blob URL, anchor, clipboard, timer, and viewport APIs and
  restore state between cases; no test uses a real network.

## Refactoring candidates (not implemented)

Request sequencing/cancellation, remote sorting, response normalization, router
decoupling, CRUD key handling, explicit async-state slots, and separation of
data/CRUD/export controllers remain candidates for a later staged decomposition.
