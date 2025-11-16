<script setup lang="ts">
import NavItem from '../NavItem/NavItem.vue';
defineOptions({ name: 'NavCollapse' });

const props = defineProps<{ item: any; level: number }>();
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!---Item Childern -->
  <!-- ---------------------------------------------- -->
  <v-list-group no-action>
    <!-- ---------------------------------------------- -->
    <!---Dropdown  -->
    <!-- ---------------------------------------------- -->
    <template v-slot:activator="{ props }">
      <v-list-item v-bind="props" :value="item.title" rounded class="mb-1" color="secondary">
        <!---Icon  -->
        <template v-slot:prepend>
          <v-icon v-if="typeof item.icon === 'string'" :icon="item.icon" />
          <component v-else-if="item.icon" :is="item.icon" />
        </template>
        <!---Title  -->
        <v-list-item-title class="ml-auto">{{ item.title }}</v-list-item-title>
        <!---If Caption-->
        <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
          {{ item.subCaption }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
    <!-- ---------------------------------------------- -->
    <!---Sub Item-->
    <!-- ---------------------------------------------- -->
    <template v-for="(subitem, i) in item.children" :key="i">
      <NavCollapse :item="subitem" v-if="subitem.children" :level="props.level + 1" />
      <NavItem :item="subitem" :level="props.level + 1" v-else></NavItem>
    </template>
  </v-list-group>

  <!-- ---------------------------------------------- -->
  <!---End Item Sub Header -->
  <!-- ---------------------------------------------- -->
</template>
