<script setup lang="ts">
import { computed } from 'vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';
import NavGroup from './NavGroup/NavGroup.vue';
import NavItem from './NavItem/NavItem.vue';
import type { MenuItem } from '@/types/components/layout/menu';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useDisplay } from 'vuetify';

const props = defineProps<{
  sidebarItems: MenuItem[]
  getFilteredSidebarItems: () => MenuItem[]
  logoComponent: any
  sidebarDrawer: boolean
  miniSidebar: boolean
  version?: string
}>()

const emit = defineEmits<{
  (e: 'update:sidebarDrawer', value: boolean): void;
}>();

const { width: viewportWidth } = useDisplay();
const isMobileDrawer = computed(() => viewportWidth.value < 1280);
const mobileDrawerWidth = computed(() => {
  if (viewportWidth.value < 600) return Math.max(280, Math.min(viewportWidth.value * 0.88, 360));
  return Math.max(320, Math.min(viewportWidth.value - 32, 400));
});

const sidebarMenu = computed(() => {
  try {
    const filtered = props.getFilteredSidebarItems?.();
    if (Array.isArray(filtered)) return filtered;
  } catch {
    // ignore errors
  }
  return props.sidebarItems;
});
</script>

<template>
  <v-navigation-drawer
    location="right"
    aria-label="Main navigation"
    :model-value="sidebarDrawer"
    @update:modelValue="emit('update:sidebarDrawer', $event)"
    elevation="0"
    rail-width="78"
    mobile-breakpoint="lg"
    app
    :width="isMobileDrawer ? mobileDrawerWidth : undefined"
    :temporary="isMobileDrawer"
    :scrim="isMobileDrawer"
    :rail="!isMobileDrawer && miniSidebar"
    :class="['rightSidebar', { 'sidebar-closed': !sidebarDrawer }]"
  >
    <!-- Logo -->
    <div class="pa-5">
      <component :is="logoComponent" />
    </div>

    <!-- Navigation -->
    <perfect-scrollbar class="scrollnavbar">
      <v-list class="pa-4">
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <NavGroup v-if="item.header" :item="item" />
          <v-divider v-else-if="item.divider" class="my-3" />
          <NavCollapse v-else-if="item.children" :item="item" :level="0" class="leftPadding" />
          <NavItem v-else :item="item" :level="0" class="leftPadding" />
        </template>
      </v-list>

      <div v-if="sidebarDrawer" class="pa-4 text-center">
        <v-chip color="inputBorder" size="small">{{ props.version }}</v-chip>
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
/* Completely hide text when sidebar is closed */
.rightSidebar.sidebar-closed .v-list-item-title,
.rightSidebar.sidebar-closed .v-list-item-subtitle,
.rightSidebar.sidebar-closed .v-list-subheader {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}

/* Also hide when in rail mode */
.rightSidebar.v-navigation-drawer--rail .v-list-item-title,
.rightSidebar.v-navigation-drawer--rail .v-list-item-subtitle,
.rightSidebar.v-navigation-drawer--rail .v-list-subheader {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}

@media (max-width: 600px) {
  .rightSidebar {
    border-radius: 18px 0 0 18px;
    box-shadow: -12px 0 34px rgba(22, 28, 45, 0.18) !important;
  }

  .rightSidebar :deep(.v-list) {
    padding: 10px !important;
  }

  .rightSidebar :deep(.v-list-item) {
    min-height: 44px;
    margin-bottom: 4px;
    border-radius: 11px;
  }

  .rightSidebar :deep(.v-list-group) {
    margin-bottom: 5px;
    border-radius: 12px;
  }
}
</style>
