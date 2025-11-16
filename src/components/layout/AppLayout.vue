<script setup lang="ts">
import { useCustomizerStore } from '@/stores/customizer';
import AppHeader from './AppHeader.vue';
import AppSidebar from './AppSidebar.vue';

// Types from child components
import type { MenuItem } from './AppSidebar.vue';
import type { HeaderAction } from './AppHeader.vue';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showSidebarToggle?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  showNotifications?: boolean;
  notificationCount?: number;
  showProfile?: boolean;
  profileAvatar?: string;
  profileName?: string;
  profileMenu?: Array<{
    title: string;
    icon?: string;
    to?: string;
    href?: string;
    divider?: boolean;
    action?: () => void;
  }>;
  actions?: HeaderAction[];
  color?: string;
  elevation?: number;
  height?: number | string;
  class?: string;
}

interface SidebarProps {
  menuItems?: MenuItem[];
  logo?: string;
  logoLight?: string;
  logoText?: string;
  miniSidebar?: boolean;
  permanent?: boolean;
  temporary?: boolean;
  rail?: boolean;
  location?: 'left' | 'right';
  width?: number | string;
  railWidth?: number | string;
}

interface Props {
  // Header props
  header?: HeaderProps;
  // Sidebar props
  sidebar?: SidebarProps;
}

const props = withDefaults(defineProps<Props>(), {
  header: () => ({
    title: 'Dashboard',
    subtitle: '',
    showSidebarToggle: true,
    showSearch: false,
    searchPlaceholder: 'جستجو...',
    showNotifications: false,
    notificationCount: 0,
    showProfile: false,
    actions: [],
    color: 'surface',
    elevation: 1,
    height: 70,
  }),
  sidebar: () => ({
    menuItems: [],
    logo: '',
    logoLight: '',
    logoText: 'UI Kit',
    miniSidebar: false,
    permanent: true,
    temporary: false,
    rail: false,
    location: 'left',
    width: 265,
    railWidth: 75,
  }),
});

const customizer = useCustomizerStore();
</script>

<template>
  <v-app>
    <AppHeader v-bind="header" class="app-header" />

    <AppSidebar
      v-bind="sidebar"
      class="app-sidebar"
    />

    <v-main>
      <div class="page-wrapper">
        <slot />
      </div>
    </v-main>
  </v-app>
  <!-- Consumers should provide Vuetify plugin in app root -->
  <!-- Styles for header/sidebar are namespaced within each component -->
</template>

<style scoped>
.page-wrapper {
  min-height: calc(100vh - 100px);
}
</style>
