<script setup lang="ts">
import { ref } from 'vue';
import { IconChevronDown } from '@tabler/icons-vue';
withDefaults(defineProps<{ jumpVisible?: boolean; jumpLabel?: string }>(), { jumpVisible:false, jumpLabel:'Jump to latest message' });
const emit=defineEmits<{ scroll:[event:Event]; 'jump-to-bottom':[] }>();
const viewport=ref<HTMLElement|null>(null);
defineExpose({ viewport });
</script>
<template>
  <section class="ui-chat-shell">
    <header v-if="$slots.header" class="ui-chat-shell__header"><slot name="header"/></header>
    <div class="ui-chat-shell__conversation">
      <div ref="viewport" class="ui-chat-shell__viewport" aria-live="polite" @scroll="emit('scroll',$event)"><slot/></div>
      <slot name="navigator"/>
      <v-btn v-show="jumpVisible" class="ui-chat-shell__jump" :icon="IconChevronDown" size="small" color="primary" :aria-label="jumpLabel" @click="emit('jump-to-bottom')"/>
    </div>
    <footer v-if="$slots.composer" class="ui-chat-shell__composer"><slot name="composer"/></footer>
  </section>
</template>
<style scoped>
.ui-chat-shell{position:relative;isolation:isolate;height:100%;min-height:560px;display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;border:1px solid rgb(var(--v-theme-borderColor));border-radius:var(--design-card-radius,12px);background:rgb(var(--v-theme-background));box-shadow:0 12px 32px rgb(var(--v-theme-on-surface)/5%)}.ui-chat-shell__header{position:relative;z-index:2;border-bottom:1px solid rgb(var(--v-theme-borderColor));background:rgb(var(--v-theme-surface)/92%);backdrop-filter:blur(14px)}.ui-chat-shell__conversation{position:relative;z-index:1;min-height:0;overflow:hidden}.ui-chat-shell__viewport{width:100%;height:100%;overflow-y:auto;scroll-behavior:smooth}.ui-chat-shell__jump{position:absolute;z-index:4;left:50%;bottom:.9rem;transform:translateX(-50%);border:2px solid rgb(var(--v-theme-surface));box-shadow:0 8px 22px rgb(var(--v-theme-on-surface)/20%)}.ui-chat-shell__composer{position:relative;z-index:2}
</style>
