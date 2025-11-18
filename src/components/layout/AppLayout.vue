<script setup lang="ts">
import { type PropType } from 'vue';
import AppHeader from './AppHeader.vue';
import AppSidebar from './AppSidebar.vue';

// Types from types directory
import type { MenuItem } from '../../types/components/layout/menu';

// Header props - matching AppHeader component
interface HeaderProps {
  menuOrientation?: 'horizontal' | 'vertical';
  miniSidebar?: boolean;
  userInfoLoaded?: boolean;
  headerMenu?: MenuItem[];
  onToggleMiniSidebar?: () => void;
  onToggleCustomizer?: () => void;
  onToggleSidebarDrawer?: () => void;
}

// Sidebar props - matching AppSidebar component
interface SidebarProps {
  sidebarItems: MenuItem[];
  getFilteredSidebarItems: () => MenuItem[];
  logoComponent: any; // Vue component
  sidebarDrawer: boolean;
  miniSidebar: boolean;
  'onUpdate:sidebarDrawer'?: (value: boolean) => void;
}

interface Props {
  // Header props
  header?: HeaderProps;
  // Sidebar props
  sidebar: SidebarProps;
}

const props = defineProps<Props>();
</script>

<template>
  <v-app>
    <AppHeader 
      v-bind="header" 
      class="app-header"
    >
      <!-- Pass through header slots -->
      <template #notifications>
        <slot name="notifications" />
      </template>
      <template #profile>
        <slot name="profile" />
      </template>
    </AppHeader>

    <AppSidebar
      :sidebarItems="sidebar.sidebarItems"
      :getFilteredSidebarItems="sidebar.getFilteredSidebarItems"
      :logoComponent="sidebar.logoComponent"
      :sidebarDrawer="sidebar.sidebarDrawer"
      :miniSidebar="sidebar.miniSidebar"
      @update:sidebarDrawer="sidebar['onUpdate:sidebarDrawer']"
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
