<script setup lang="ts">
import { computed } from 'vue';
import { useUiKit } from '../../platform/uiKit';
export interface AppNotification { id: string | number; title: string; description?: string; time?: string; read?: boolean; icon?: string }
const props = defineProps<{ modelValue: boolean; notifications: AppNotification[]; title?: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; select: [notification: AppNotification]; readAll: [] }>();
const ui = useUiKit();
const resolvedTitle = computed(() => props.title ?? ui.t('notifications'));
</script>
<template><v-menu :model-value="modelValue" :close-on-content-click="false" location="bottom start" @update:model-value="emit('update:modelValue',$event)"><template #activator="{ props }"><slot name="activator" :props="props"><v-btn v-bind="props" icon="$bell" variant="text" /></slot></template><v-card class="app-notification-center"><div class="app-notification-center__head"><strong>{{ resolvedTitle }}</strong><v-btn variant="text" size="small" @click="emit('readAll')">{{ ui.t('markAllRead') }}</v-btn></div><v-list max-height="360" class="overflow-y-auto"><v-list-item v-for="notification in notifications" :key="notification.id" :class="{ unread: !notification.read }" @click="emit('select',notification)"><template #prepend><v-avatar size="34" color="lightprimary"><v-icon :icon="notification.icon || '$bell'" size="18" color="primary" /></v-avatar></template><v-list-item-title>{{ notification.title }}</v-list-item-title><v-list-item-subtitle>{{ notification.description }}</v-list-item-subtitle><template #append><small>{{ notification.time }}</small></template></v-list-item><slot name="empty" v-if="!notifications.length"><v-list-item :title="ui.t('noNotifications')" /></slot></v-list></v-card></v-menu></template>
<style scoped>.app-notification-center{width:min(360px,calc(100vw - 24px))}.app-notification-center__head{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid rgba(var(--v-theme-borderLight),.6)}.unread{background:rgb(var(--v-theme-lightprimary))}small{color:rgb(var(--v-theme-lightText));white-space:nowrap}</style>
