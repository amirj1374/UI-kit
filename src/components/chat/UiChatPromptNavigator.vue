<script setup lang="ts">
import type { UiChatPrompt } from './types';

withDefaults(defineProps<{
  prompts: UiChatPrompt[];
  activeIndex: number;
  ariaLabel?: string;
  previewLength?: number;
  expandDelay?: number;
}>(), {
  ariaLabel: 'Prompt navigation',
  previewLength: 78,
  expandDelay: 280
});

const emit = defineEmits<{ select: [index: number] }>();

function preview(content: string, length: number): string {
  const normalized = content.replace(/\s+/g, ' ').trim();
  return normalized.length > length ? `${normalized.slice(0, length)}…` : normalized;
}
</script>

<template>
  <nav class="ui-chat-prompt-nav" :aria-label="ariaLabel" :style="{ '--ui-chat-nav-delay': `${expandDelay}ms` }">
    <button
      v-for="(prompt, index) in prompts"
      :key="prompt.id"
      type="button"
      :class="['ui-chat-prompt-nav__item', { active: activeIndex === index }]"
      :aria-label="preview(prompt.content, previewLength)"
      @click="emit('select', index)"
    >
      <v-tooltip location="start" :open-delay="250" :close-delay="80" max-width="380">
        <template #activator="{ props: tooltipProps }">
          <span v-bind="tooltipProps" class="ui-chat-prompt-nav__label">{{ preview(prompt.content, previewLength) }}</span>
        </template>
        <span class="ui-chat-prompt-nav__full">{{ prompt.content }}</span>
      </v-tooltip>
      <span class="ui-chat-prompt-nav__marker" aria-hidden="true" />
    </button>
  </nav>
</template>

<style scoped>
.ui-chat-prompt-nav { position:absolute;z-index:5;inset-inline-end:.8rem;top:50%;width:36px;max-height:min(58%,260px);overflow:auto hidden;display:flex;flex-direction:column;gap:.15rem;padding:.4rem;border:1px solid rgb(var(--v-theme-borderColor));border-radius:999px;color:rgb(var(--v-theme-on-surface));background:color-mix(in srgb,rgb(var(--v-theme-surface)) 96%,rgb(var(--v-theme-background)));box-shadow:0 10px 28px rgb(var(--v-theme-on-surface)/14%);backdrop-filter:blur(14px);transform:translateY(-50%);scrollbar-width:none;transition:width 180ms ease,border-radius 180ms ease,box-shadow 180ms ease;}
.ui-chat-prompt-nav:hover,.ui-chat-prompt-nav:has(.ui-chat-prompt-nav__item:focus-visible){width:min(238px,31vw);border-radius:14px;box-shadow:0 14px 38px rgb(var(--v-theme-on-surface)/20%);transition-delay:var(--ui-chat-nav-delay);}
.ui-chat-prompt-nav::-webkit-scrollbar{display:none}.ui-chat-prompt-nav__item{position:relative;width:100%;min-height:30px;flex:0 0 30px;padding:0;border:0;border-radius:8px;color:rgb(var(--v-theme-on-surface)/62%);background:transparent;text-align:start;cursor:pointer}.ui-chat-prompt-nav__item:hover{background:rgb(var(--v-theme-primary)/7%)}.ui-chat-prompt-nav__item.active{color:rgb(var(--v-theme-primary));background:rgb(var(--v-theme-primary)/9%)}
.ui-chat-prompt-nav__label{position:absolute;inset-block-start:50%;inset-inline:1.9rem .5rem;overflow:hidden;font-size:.72rem;font-weight:600;text-overflow:ellipsis;white-space:nowrap;opacity:0;visibility:hidden;transform:translateY(-50%);transition:opacity 120ms ease;}.ui-chat-prompt-nav:hover .ui-chat-prompt-nav__label,.ui-chat-prompt-nav:has(.ui-chat-prompt-nav__item:focus-visible) .ui-chat-prompt-nav__label{opacity:1;visibility:visible;transition-delay:var(--ui-chat-nav-delay)}
.ui-chat-prompt-nav__full{display:block;max-width:360px;line-height:1.7;text-align:start;white-space:pre-wrap;overflow-wrap:anywhere}.ui-chat-prompt-nav__marker{position:absolute;top:50%;inset-inline-end:50%;width:6px;height:6px;border-radius:999px;background:rgb(var(--v-theme-on-surface)/34%);transform:translate(50%,-50%);transition:all 180ms ease}.ui-chat-prompt-nav__item.active .ui-chat-prompt-nav__marker{width:8px;height:8px;background:rgb(var(--v-theme-primary));box-shadow:0 0 0 4px rgb(var(--v-theme-primary)/11%)}
.ui-chat-prompt-nav:hover .ui-chat-prompt-nav__marker,.ui-chat-prompt-nav:has(.ui-chat-prompt-nav__item:focus-visible) .ui-chat-prompt-nav__marker{inset-inline-end:.55rem;width:9px;height:2px;transform:translateY(-50%);transition-delay:var(--ui-chat-nav-delay)}
@media(max-width:700px){.ui-chat-prompt-nav{inset-inline-end:.3rem;transform:translateY(-50%) scale(.92);transform-origin:right center}.ui-chat-prompt-nav:hover{width:min(190px,46vw)}}
</style>
