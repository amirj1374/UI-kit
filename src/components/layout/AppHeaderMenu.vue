<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { IconChevronDown } from '@tabler/icons-vue';
import { useRoute } from 'vue-router';
import { useUiKit } from '../../platform/uiKit';
import type { MenuItem } from '../../types/components/layout/menu';

const props = defineProps({
  /** Already-filtered navigation items supplied by the consuming application. */
  items: {
    type: Array as PropType<MenuItem[]>,
    default: () => []
  },
  /** Render as a vertical menu panel for compact header navigation. */
  display: {
    type: String as PropType<'bar' | 'menu'>,
    default: 'bar'
  },
  /** Maximum number of top-level navigation items shown directly in the desktop bar. */
  maxVisible: {
    type: Number,
    default: 5
  }
});

const route = useRoute();
const ui = useUiKit();
const navigableItems = computed(() => props.items.filter((item) => !item.header && !item.divider));
const visibleItems = computed(() => (props.display === 'bar' ? navigableItems.value.slice(0, props.maxVisible) : props.items));
const overflowItems = computed(() => (props.display === 'bar' ? navigableItems.value.slice(props.maxVisible) : []));

const itemMatchesCurrentRoute = (item: MenuItem): boolean => {
  const target = item.to as string | { path?: string; name?: string } | undefined;
  const targetPath = typeof target === 'string' ? target : target?.path;
  const targetName = typeof target === 'object' ? target?.name : undefined;

  if (targetPath && route.path === targetPath) return true;
  if (targetName && route.name === targetName) return true;
  return item.children?.some(itemMatchesCurrentRoute) ?? false;
};

const overflowContainsActiveItem = computed(() => overflowItems.value.some(itemMatchesCurrentRoute));
</script>

<template>
  <nav :class="['header-menu-container', { 'header-menu-container--menu': display === 'menu' }]" aria-label="Primary navigation">
    <template v-for="(item, index) in visibleItems" :key="index">
      <v-btn
        v-if="!item.children && !item.header && !item.divider"
        :to="item.type === 'external' ? undefined : item.to"
        :href="item.type === 'external' ? item.to : undefined"
        :target="item.type === 'external' ? '_blank' : undefined"
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

      <v-menu v-else-if="item.children?.length" offset-y>
        <template #activator="{ props: menuProps }">
          <v-btn v-bind="menuProps" variant="text" :disabled="item.disabled" class="header-menu-btn mr-3" color="primary">
            <component :is="item.icon" v-if="item.icon" class="mr-2" size="18" />
            <span class="mr-2">{{ item.title }}</span>
            <IconChevronDown size="20" class="ml-2" stroke-width="1.5" />
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(child, childIndex) in item.children"
            :key="childIndex"
            :to="child.type === 'external' ? undefined : child.to"
            :href="child.type === 'external' ? child.to : undefined"
            :target="child.type === 'external' ? '_blank' : undefined"
            :disabled="child.disabled"
          >
            <template v-if="child.icon" #prepend>
              <component :is="child.icon" size="18" />
            </template>
            <v-list-item-title>{{ child.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-divider v-else-if="item.divider" vertical class="mx-2" />
    </template>

    <v-menu v-if="overflowItems.length" offset-y>
      <template #activator="{ props: menuProps }">
        <v-btn
          v-bind="menuProps"
          :class="['header-menu-btn', 'header-menu-more-btn', { 'header-menu-more-btn--active': overflowContainsActiveItem }]"
          color="primary"
          variant="text"
          :aria-label="ui.t('more')"
        >
          <v-icon size="20">mdi-dots-horizontal</v-icon>
          <span>{{ ui.t('more') }}</span>
          <IconChevronDown size="18" stroke-width="1.5" />
        </v-btn>
      </template>

      <v-list min-width="230" class="header-menu-overflow-list">
        <template v-for="(item, index) in overflowItems" :key="index">
          <v-list-item
            v-if="!item.children?.length"
            :to="item.type === 'external' ? undefined : item.to"
            :href="item.type === 'external' ? item.to : undefined"
            :target="item.type === 'external' ? '_blank' : undefined"
            :disabled="item.disabled"
            :active="itemMatchesCurrentRoute(item)"
            :title="item.title"
          >
            <template v-if="item.icon" #prepend><component :is="item.icon" size="18" /></template>
          </v-list-item>

          <template v-else>
            <v-list-subheader>{{ item.title }}</v-list-subheader>
            <v-list-item
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
              :to="child.type === 'external' ? undefined : child.to"
              :href="child.type === 'external' ? child.to : undefined"
              :target="child.type === 'external' ? '_blank' : undefined"
              :disabled="child.disabled"
              :active="itemMatchesCurrentRoute(child)"
              :title="child.title"
            >
              <template v-if="child.icon" #prepend><component :is="child.icon" size="18" /></template>
            </v-list-item>
          </template>
        </template>
      </v-list>
    </v-menu>
  </nav>
</template>
