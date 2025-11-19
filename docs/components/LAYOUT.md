# Layout Components

Layout components for building application structures with header, sidebar, and main content areas.

## AppHeader

A flexible header component with menu support, notifications, and profile slots.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `menuOrientation` | `string` | `'horizontal'` | Menu orientation: `'horizontal'` or `'vertical'` |
| `miniSidebar` | `boolean` | `false` | Whether sidebar is in mini mode |
| `userInfoLoaded` | `boolean` | `false` | Whether user info is loaded |
| `headerMenu` | `MenuItem[]` | `[]` | Array of menu items to display |
| `onToggleMiniSidebar` | `() => void` | `undefined` | Callback when mini sidebar toggle is clicked |
| `onToggleCustomizer` | `() => void` | `undefined` | Callback when customizer button is clicked |
| `onToggleSidebarDrawer` | `() => void` | `undefined` | Callback when sidebar drawer toggle is clicked |

### Slots

- `#notifications` - Custom notification dropdown component
- `#profile` - Custom profile dropdown component

### Usage

```vue
<script setup lang="ts">
import { AppHeader, type MenuItem } from '@amirjalili1374/ui-kit'
import { computed } from 'vue'

const headerMenu = computed<MenuItem[]>(() => [
  {
    title: 'Dashboard',
    to: '/dashboard',
    icon: IconHome,
    type: 'internal'
  },
  {
    title: 'Settings',
    to: '/settings',
    icon: IconSettings,
    type: 'internal'
  }
])
</script>

<template>
  <AppHeader
    :menuOrientation="'horizontal'"
    :miniSidebar="false"
    :userInfoLoaded="true"
    :headerMenu="headerMenu"
    :onToggleMiniSidebar="() => { /* toggle logic */ }"
    :onToggleCustomizer="() => { /* customizer logic */ }"
    :onToggleSidebarDrawer="() => { /* drawer logic */ }"
  >
    <template #notifications>
      <!-- Your notification component -->
    </template>
    
    <template #profile>
      <!-- Your profile component -->
    </template>
  </AppHeader>
</template>
```

## AppSidebar

A navigation sidebar component with menu items, logo, and filtering support.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `sidebarItems` | `MenuItem[]` | Yes | Array of sidebar menu items |
| `getFilteredSidebarItems` | `() => MenuItem[]` | Yes | Function that returns filtered menu items |
| `logoComponent` | `Component` | Yes | Vue component for the logo |
| `sidebarDrawer` | `boolean` | Yes | Whether sidebar drawer is open |
| `miniSidebar` | `boolean` | Yes | Whether sidebar is in mini/rail mode |

### Events

- `update:sidebarDrawer` - Emitted when sidebar drawer state changes

### Usage

```vue
<script setup lang="ts">
import { AppSidebar, type MenuItem } from '@amirjalili1374/ui-kit'
import LogoDark from './LogoDark.vue'
import { ref } from 'vue'

const sidebarDrawer = ref(true)
const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    to: '/dashboard',
    icon: IconHome
  }
]

const getFilteredItems = () => {
  // Your filtering logic
  return menuItems
}
</script>

<template>
  <AppSidebar
    :sidebarItems="menuItems"
    :getFilteredSidebarItems="getFilteredItems"
    :logoComponent="LogoDark"
    :sidebarDrawer="sidebarDrawer"
    :miniSidebar="false"
    @update:sidebarDrawer="sidebarDrawer = $event"
  />
</template>
```

## AppLayout

A complete layout component that combines AppHeader and AppSidebar.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `header` | `HeaderProps` | Configuration for AppHeader |
| `sidebar` | `SidebarProps` | Configuration for AppSidebar (required) |

### Slots

- `default` - Main content area
- `#notifications` - Header notifications slot
- `#profile` - Header profile slot

### Usage

```vue
<script setup lang="ts">
import { AppLayout, type MenuItem } from '@amirjalili1374/ui-kit'
import LogoDark from './LogoDark.vue'
import { ref, computed } from 'vue'

const sidebarDrawer = ref(true)
const menuItems: MenuItem[] = [/* ... */]

const headerProps = {
  menuOrientation: 'horizontal' as const,
  miniSidebar: false,
  userInfoLoaded: true,
  headerMenu: menuItems,
  onToggleMiniSidebar: () => { /* ... */ },
  onToggleCustomizer: () => { /* ... */ },
  onToggleSidebarDrawer: () => { sidebarDrawer.value = !sidebarDrawer.value }
}

const sidebarProps = {
  sidebarItems: menuItems,
  getFilteredSidebarItems: () => menuItems,
  logoComponent: LogoDark,
  sidebarDrawer: sidebarDrawer.value,
  miniSidebar: false,
  'onUpdate:sidebarDrawer': (val: boolean) => { sidebarDrawer.value = val }
}
</script>

<template>
  <AppLayout :header="headerProps" :sidebar="sidebarProps">
    <template #notifications>
      <!-- Notification component -->
    </template>
    
    <template #profile>
      <!-- Profile component -->
    </template>
    
    <!-- Your page content -->
    <router-view />
  </AppLayout>
</template>
```

## MenuItem Type

```typescript
interface MenuItem {
  header?: string
  title?: string
  icon?: object | any
  to?: string
  divider?: boolean
  chip?: string
  chipColor?: string
  chipVariant?: string
  chipIcon?: string
  children?: MenuItem[]
  disabled?: boolean
  type?: string
  subCaption?: string
  permissionKey?: string
}
```

