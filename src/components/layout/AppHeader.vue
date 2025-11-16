<script setup lang="ts">
import { useCustomizerStore } from '@/stores/customizer';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

/**
 * Header action button type
 */
export interface HeaderAction {
  icon?: string;
  label?: string;
  color?: string;
  variant?: string;
  size?: string;
  badge?: string | number;
  badgeColor?: string;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
}

interface Props {
  title?: string;
  subtitle?: string;
  /** Extra class applied to the header root */
  class?: string;
  /** ARIA label for app bar */
  ariaLabel?: string;
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
  /** Hide default title (use slot instead) */
  hideDefaultTitle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showSidebarToggle: true,
  showSearch: false,
  searchPlaceholder: 'جستجو...',
  showNotifications: false,
  notificationCount: 0,
  showProfile: false,
  color: 'surface',
  elevation: 1,
  height: 70,
  actions: () => [],
  profileMenu: () => [],
  ariaLabel: 'Application header',
  hideDefaultTitle: false
});

const emit = defineEmits<{
  (e: 'update:searchValue', value: string): void;
  (e: 'toggle-sidebar'): void;
  (e: 'search', value: string): void;
}>();

const customizer = useCustomizerStore();

const searchInput = computed({
  get: () => props.searchValue || '',
  set: (val: string) => {
    emit('update:searchValue', val);
    emit('search', val);
  }
});

const toggleSidebar = () => {
  customizer.SET_SIDEBAR_DRAWER();
  emit('toggle-sidebar');
};

const router = useRouter();

const profileMenuItems = computed(() => 
  props.profileMenu.map((item) => ({
    ...item,
    prependIcon: item.icon,
    onClick: item.action || (() => {
      if (item.to) {
        router.push(item.to);
      } else if (item.href) {
        window.open(item.href, '_blank');
      }
    })
  }))
);
</script>

<template>
  <v-app-bar
    :color="color"
    :elevation="elevation"
    :height="height"
    :class="['app-header topbar', props.class]"
    :aria-label="ariaLabel"
    fixed
  >
    <!-- Left slot (before toggle) -->
    <slot name="left" />

    <!-- Sidebar Toggle Button -->
    <v-app-bar-nav-icon
      v-if="showSidebarToggle"
      variant="text"
      @click="toggleSidebar"
    />

    <!-- Title Section -->
    <slot name="title">
      <v-app-bar-title v-if="!hideDefaultTitle && (title || subtitle)" class="d-flex flex-column">
        <span v-if="title" class="text-h6">{{ title }}</span>
        <span v-if="subtitle" class="text-caption text-medium-emphasis">
          {{ subtitle }}
        </span>
      </v-app-bar-title>
    </slot>

    <v-spacer></v-spacer>

    <!-- Between search and actions -->
    <slot name="center" />

    <!-- Search Bar -->
    <v-text-field
      v-if="showSearch"
      v-model="searchInput"
      :placeholder="searchPlaceholder"
      density="compact"
      variant="outlined"
      hide-details
      prepend-inner-icon="mdi-magnify"
      class="search-bar"
      style="max-width: 400px;"
    />

    <!-- Custom Actions -->
    <template v-for="(action, index) in actions" :key="index">
      <v-tooltip v-if="action.tooltip" :text="action.tooltip" location="bottom">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            :icon="action.icon"
            :color="action.color || 'primary'"
            :variant="(action.variant as any) || 'text'"
            :size="action.size || 'default'"
            :disabled="action.disabled"
            class="ms-2"
            @click="action.onClick"
          >
            <v-badge
              v-if="action.badge"
              :content="action.badge"
              :color="action.badgeColor || 'error'"
              overlap
            >
              <v-icon v-if="action.icon" :icon="action.icon" />
            </v-badge>
            <template v-else-if="action.icon">
              <v-icon :icon="action.icon" />
            </template>
            <span v-if="action.label && !action.icon">{{ action.label }}</span>
          </v-btn>
        </template>
      </v-tooltip>

      <v-btn
        v-else
        :icon="action.icon"
        :color="action.color || 'primary'"
        :variant="(action.variant as any) || 'text'"
        :size="action.size || 'default'"
        :disabled="action.disabled"
        class="ms-2"
        @click="action.onClick"
      >
        <v-badge
          v-if="action.badge"
          :content="action.badge"
          :color="action.badgeColor || 'error'"
          overlap
        >
          <v-icon v-if="action.icon" :icon="action.icon" />
        </v-badge>
        <template v-else-if="action.icon">
          <v-icon :icon="action.icon" />
        </template>
        <span v-if="action.label && !action.icon">{{ action.label }}</span>
      </v-btn>
    </template>

    <!-- Right custom slot (before notifications/profile) -->
    <slot name="right" />

    <!-- Notifications -->
    <v-menu v-if="showNotifications" location="bottom end" offset-y>
      <template v-slot:activator="{ props: menuProps }">
        <v-btn
          v-bind="menuProps"
          icon
          variant="text"
          class="profileBtn"
        >
          <v-badge
            :content="notificationCount > 0 ? notificationCount : undefined"
            color="error"
            overlap
          >
            <v-icon icon="mdi-bell-outline" />
          </v-badge>
        </v-btn>
      </template>

      <v-list>
        <v-list-item>
          <v-list-item-title>اعلان‌ها</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <v-list-item-title>هیچ اعلان جدیدی وجود ندارد</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Profile Menu -->
    <v-menu v-if="showProfile" location="bottom end" offset-y>
      <template v-slot:activator="{ props: menuProps }">
        <v-btn
          v-bind="menuProps"
          :icon="!profileName && !profileAvatar"
          variant="text"
          class="profileBtn"
        >
          <v-avatar v-if="profileAvatar" size="32">
            <v-img :src="profileAvatar" :alt="profileName || 'Profile'" />
          </v-avatar>
          <v-icon v-else-if="!profileName" icon="mdi-account-circle" />
          <span v-else>{{ profileName }}</span>
        </v-btn>
      </template>

      <v-list v-if="profileMenuItems.length > 0">
        <v-list-item
          v-for="(item, index) in profileMenuItems"
          :key="index"
          :prepend-icon="item.icon"
          :to="item.to"
          :href="item.href"
          @click="item.onClick"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
          <v-divider v-if="item.divider" />
        </v-list-item>
      </v-list>
    </v-menu>
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
}
</style>

