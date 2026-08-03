<script setup lang="ts">
import { type PropType } from 'vue';
import { IconChevronDown } from '@tabler/icons-vue';
import type { MenuItem } from '../../types/components/layout/menu';

defineProps({
  /** Already-filtered navigation items supplied by the consuming application. */
  items: {
    type: Array as PropType<MenuItem[]>,
    default: () => []
  },
  /** Render as a vertical menu panel for compact header navigation. */
  display: {
    type: String as PropType<'bar' | 'menu'>,
    default: 'bar'
  }
});
</script>

<template>
  <nav :class="['header-menu-container', { 'header-menu-container--menu': display === 'menu' }]" aria-label="Primary navigation">
    <template v-for="(item, index) in items" :key="index">
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
  </nav>
</template>
