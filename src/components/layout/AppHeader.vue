<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { MenuItem } from '../../types/components/layout/menu';
import { IconMenu2, IconPalette, IconChevronDown } from '@tabler/icons-vue';

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
      @click.stop="props.onToggleMiniSidebar && props.onToggleMiniSidebar()"
    >
      <IconMenu2 size="20" stroke-width="1.5" />
    </v-btn>

    <!-- SIDEBAR DRAWER (Mobile) -->
    <v-btn
      class="hidden-lg-and-up text-secondary ms-3"
      color="lightsecondary"
      icon
      rounded="sm"
      variant="flat"
      size="small"
      @click.stop="props.onToggleSidebarDrawer && props.onToggleSidebarDrawer()"
    >
      <IconMenu2 size="20" stroke-width="1.5" />
    </v-btn>

    <!-- CUSTOMIZER BUTTON -->
    <v-btn
      class="hidden-md-and-down text-secondary mr-2 ml-2"
      color="lightsecondary"
      icon
      rounded="sm"
      variant="flat"
      size="small"
      @click.stop="props.onToggleCustomizer && props.onToggleCustomizer()"
    >
    <IconPalette size="20" stroke-width="1.5" />
    </v-btn>

    <!-- MENU ITEMS -->
    <div class="header-menu-container" v-if="menuOrientation === 'horizontal'">
      <template v-for="(item, i) in computedHeaderMenu" :key="i">
        <!-- Single Menu Item -->
        <v-btn
          v-if="!item.children && !item.header && !item.divider"
          :to="item.type === 'external' ? '' : item.to"
          :href="item.type === 'external' ? item.to : ''"
          :target="item.type === 'external' ? '_blank' : ''"
          variant="text"
          :disabled="item.disabled"
          class="header-menu-btn mr-3"
          color="primary"
        >
          <component :is="item.icon" v-if="item.icon" class="ml-2" size="18" />
          <span>{{ item.title }}</span>
          <v-chip
            v-if="item.chip"
            :color="item.chipColor"
            :size="item.chipIcon ? 'small' : 'default'"
            :variant="item.chipVariant as any"
            :prepend-icon="item.chipIcon"
            class="ml-2"
          >
            {{ item.chip }}
          </v-chip>
        </v-btn>

        <!-- Menu Item with Dropdown -->
        <v-menu v-else-if="item.children && item.children.length > 0" offset-y>
          <template v-slot:activator="{ props: mprops }">
            <v-btn
              v-bind="mprops"
              variant="text"
              :disabled="item.disabled"
              class="header-menu-btn"
              color="primary mr-3"
            >
              <component :is="item.icon" v-if="item.icon" class="mr-2" size="18" />
              <span class="mr-2">{{ item.title }}</span>
              <IconChevronDown size="20" class="ml-2" stroke-width="1.5" />
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
              :to="child.type === 'external' ? '' : child.to"
              :href="child.type === 'external' ? child.to : ''"
              :target="child.type === 'external' ? '_blank' : ''"
              :disabled="child.disabled"
            >
              <template v-slot:prepend v-if="child.icon">
                <component :is="child.icon" size="18" />
              </template>
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Divider -->
        <v-divider v-else-if="item.divider" vertical class="mx-2" />
      </template>
    </div>

    <v-spacer />

    <!-- NOTIFICATION SLOT -->
    <slot name="notifications">
      <v-btn icon class="text-secondary mx-3" color="lightsecondary" rounded="sm" size="small" variant="flat">
        <v-icon size="20">mdi-bell-outline</v-icon>
      </v-btn>
    </slot>

    <!-- PROFILE SLOT -->
    <slot name="profile">
      <v-btn class="profileBtn text-primary" color="lightprimary" variant="flat" rounded="pill">
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
}
</style>

