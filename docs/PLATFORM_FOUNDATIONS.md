# UI platform foundations

`app.use(UiKit, options)` creates an isolated context for each Vue application. Components and composables inject it; direct imports use safe Persian/RTL defaults. Vuetify remains a peer dependency and owns rendering.

```ts
app.use(UiKit, {
  locale: 'en-US', direction: 'auto',
  messages: { 'en-US': { retry: 'Retry request' } },
  icons: { retry: MyRetryIcon },
  permissions: permission => currentUser.permissions.includes(permission),
  theme: { defaultTheme: 'brand', themes: { brand: brandTheme } }
})
```

`useUiKit()` exposes messages, semantic icons, direction, and permissions; `useUiKitConfig()` exposes resolved configuration. Built-ins are `fa-IR`/RTL and `en-US`/LTR. Overrides fall back to the built-in locale and `{name}` placeholders interpolate.

`defaultThemes` includes existing modern light/dark palettes and `mergeThemes` supports brands. Semantic icons accept Vuetify strings or Vue components. Public `--ui-*` CSS variables cover spacing, radii, shadows, surfaces, text, and status colors.

`usePermission()` provides `can`, `any`, and `all`. `PermissionGuard` supports single, any, and all requirements, a fallback slot, and hide/disable modes.

`UiAsyncState` handles `idle`, `loading`, `empty`, `error`, `success`, and `permission-denied`; focused state components provide accessible roles, slots, localized defaults, semantic icons, and RTL/LTR direction.

For tests, `mountWithApp` installs Vuetify, UI Kit, Pinia, and a memory router, accepting provider configuration as its fourth argument. Package-root exports are public; injection keys and test helpers remain internal.
