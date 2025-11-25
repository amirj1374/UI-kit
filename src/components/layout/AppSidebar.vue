<script setup lang="ts">
import { computed, type PropType } from "vue";
import NavCollapse from "./NavCollapse/NavCollapse.vue";
import NavGroup from "./NavGroup/NavGroup.vue";
import NavItem from "./NavItem/NavItem.vue";
import type { MenuItem } from '../../types/components/layout/menu';

const props = defineProps({
  sidebarItems: {
    type: Array as PropType<MenuItem[]>,
    required: true,
  },
  getFilteredSidebarItems: {
    type: Function as PropType<() => MenuItem[]>,
    required: true,
  },
  logoComponent: {
    type: Object as PropType<any>, // Vue component
    required: true,
  },
  sidebarDrawer: {
    type: Boolean,
    required: true
  },
  miniSidebar: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits<{
  (e: 'update:sidebarDrawer', value: boolean): void;
}>();

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
    right
    :model-value="sidebarDrawer"
    @update:modelValue="emit('update:sidebarDrawer', $event)"
    elevation="0"
    rail-width="78"
    mobile-breakpoint="lg"
    app
    :rail="miniSidebar"
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
          <NavCollapse
            v-else-if="item.children"
            :item="item"
            :level="0"
            class="leftPadding"
          />
          <NavItem v-else :item="item" :level="0" class="leftPadding" />
        </template>
      </v-list>

      <div v-if="sidebarDrawer" class="pa-4 text-center">
        <v-chip color="inputBorder" size="small">نمایشی</v-chip>
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
</style>
