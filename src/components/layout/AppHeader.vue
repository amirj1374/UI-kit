<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { MenuItem } from '../../types/components/layout/menu';
import { IconMenu2, IconPalette } from '@tabler/icons-vue';
import AppHeaderMenu from './AppHeaderMenu.vue';

const props = defineProps({
  menuOrientation: {
    type: String,
    default: 'horizontal',
  },
  miniSidebar: {
    type: Boolean,
    default: false,
  },
  userInfoLoaded: {
    type: Boolean,
    default: false,
  },
  headerMenu: {
    type: Array as PropType<MenuItem[]>,
    default: () => [],
  },
  // Events sent back to project
  onToggleMiniSidebar: {
    type: Function as PropType<() => void>,
    default: undefined,
  },
  onToggleCustomizer: {
    type: Function as PropType<() => void>,
    default: undefined,
  },
  onToggleSidebarDrawer: {
    type: Function as PropType<() => void>,
    default: undefined,
  },
});

// Compute menu
const computedHeaderMenu = computed(() => {
  if (props.userInfoLoaded) return props.headerMenu;
  return props.headerMenu;
});
</script>

<template>
  <v-app-bar elevation="0" height="80" class="app-header topbar">
    <!-- MINI SIDEBAR TOGGLE (Desktop) - Only when vertical orientation -->
    <v-btn
      v-if="menuOrientation === 'vertical'"
      class="hidden-md-and-down text-secondary"
      color="lightsecondary"
      icon
      rounded="sm"
      variant="flat"
      size="small"
      aria-label="Toggle compact sidebar"
      @click.stop="props.onToggleMiniSidebar && props.onToggleMiniSidebar()"
    >
      <IconMenu2 size="20" stroke-width="1.5" />
    </v-btn>

    <!-- SIDEBAR DRAWER (Mobile) -->
    <v-btn
      v-if="menuOrientation === 'vertical'"
      class="hidden-lg-and-up text-secondary ms-3"
      color="lightsecondary"
      icon
      rounded="sm"
      variant="flat"
      size="small"
      aria-label="Open navigation menu"
      @click.stop="props.onToggleSidebarDrawer && props.onToggleSidebarDrawer()"
    >
      <IconMenu2 size="20" stroke-width="1.5" />
    </v-btn>

    <!-- CUSTOMIZER BUTTON -->
    <v-btn
      class="text-secondary mr-2 ml-2"
      color="lightsecondary"
      icon
      rounded="sm"
      variant="flat"
      size="small"
      aria-label="Open theme customizer"
      @click.stop="props.onToggleCustomizer && props.onToggleCustomizer()"
    >
    <IconPalette size="20" stroke-width="1.5" />
    </v-btn>

    <!-- MENU ITEMS -->
    <slot name="navigation" :items="computedHeaderMenu">
      <AppHeaderMenu v-if="menuOrientation === 'horizontal'" class="hidden-md-and-down" :items="computedHeaderMenu" />
    </slot>

    <v-spacer />

    <!-- NOTIFICATION SLOT -->
    <slot name="notifications">
      <v-btn icon aria-label="Open notifications" class="text-secondary mx-3" color="lightsecondary" rounded="sm" size="small" variant="flat">
        <v-icon size="20">mdi-bell-outline</v-icon>
      </v-btn>
    </slot>

    <!-- PROFILE SLOT -->
    <slot name="profile">
      <v-btn aria-label="Open profile settings" class="profileBtn text-primary" color="lightprimary" variant="flat" rounded="pill">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </slot>
  </v-app-bar>
</template>

<style scoped lang="scss">
:deep(.topbar) {
  z-index: 1000;
}

:deep(.search-bar) {
  margin: 0 16px;
}

:deep(.profileBtn) {
  height: 50px !important;
  margin: 0 0 0 10px !important;
}
</style>

<style lang="scss">
// Global styles for header component
.app-header {
  &.topbar {
    z-index: 1000;
  }

  .search-bar {
    margin: 0 16px;
  }

  .profileBtn {
    height: 50px !important;
    margin: 0 0 0 10px !important;
  }

  .header-menu-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 16px;

    &--menu {
      align-items: stretch;
      flex-direction: column;
      gap: 2px;
      margin: 0;
      min-width: 220px;
      padding: 8px;

      .header-menu-btn {
        justify-content: flex-start;
        margin: 0 !important;
      }
    }
  }

  .header-menu-btn {
    text-transform: none;
    font-weight: 500;
    height: 40px;
    padding: 0 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .header-menu-btn:hover {
    background-color: rgb(var(--v-theme-primary), 0.1);
    transform: translateY(-1px);
  }

  .header-menu-btn:active {
    transform: translateY(0);
  }

  .header-menu-more-btn {
    gap: 5px;
    margin: 0 0 0 4px;
    padding-inline: 12px;

    &--active {
      color: rgb(var(--v-theme-primary)) !important;
      background: rgba(var(--v-theme-primary), .1);
      box-shadow: inset 0 0 0 1px rgba(var(--v-theme-primary), .18);
    }
  }

  .header-menu-overflow-list {
    padding: 6px;
    border: 1px solid rgba(var(--v-theme-primary), .12);
    border-radius: var(--ui-shell-radius, 8px);
    box-shadow: 0 12px 30px rgba(17, 26, 43, .14);

    .v-list-item {
      min-height: 42px;
      border-radius: calc(var(--ui-shell-radius, 8px) - 2px);
    }

    .v-list-item--active {
      color: rgb(var(--v-theme-primary));
      background: rgba(var(--v-theme-primary), .1);
    }
  }
}
</style>

