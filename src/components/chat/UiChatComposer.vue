<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { IconSend, IconX } from '@tabler/icons-vue';
import type { UiChatMention, UiChatMentionCategory, UiChatMentionOption } from './types';

const props = withDefaults(defineProps<{
  modelValue: string; disabled?: boolean; streaming?: boolean; mentionOpen?: boolean; mentionLoading?: boolean;
  mentionCategory?: string; mentionQuery?: string; categories?: UiChatMentionCategory[]; options?: UiChatMentionOption[]; mentions?: UiChatMention[];
  placeholder?: string; sendLabel?: string; stopLabel?: string; emptyLabel?: string; referenceLabel?: string; status?: string; hint?: string;
}>(), { disabled:false, streaming:false, mentionOpen:false, mentionLoading:false, mentionCategory:'', mentionQuery:'', categories:()=>[], options:()=>[], mentions:()=>[], placeholder:'Type a message…', sendLabel:'Send', stopLabel:'Stop', emptyLabel:'No results', referenceLabel:'References', status:'', hint:'' });
const emit=defineEmits<{ 'update:modelValue':[value:string]; send:[value:string]; stop:[]; 'select-category':[category:UiChatMentionCategory]; 'select-option':[option:UiChatMentionOption]; 'remove-mention':[index:number] }>();
const selectedIndex=ref(0); const inputRef=ref<{focus:()=>void}|null>(null);
const items=computed(() => props.mentionCategory ? props.options : props.categories);
const canSend=computed(()=>Boolean(props.modelValue.trim())&&!props.disabled&&!props.streaming);
function selectCurrent(){const item=items.value[selectedIndex.value];if(!item)return;if(props.mentionCategory)emit('select-option',item as UiChatMentionOption);else emit('select-category',item as UiChatMentionCategory);void nextTick(()=>inputRef.value?.focus())}
function handleKeydown(event:KeyboardEvent){if(props.mentionOpen&&(event.key==='ArrowDown'||event.key==='ArrowUp')){event.preventDefault();if(!items.value.length)return;selectedIndex.value=(selectedIndex.value+(event.key==='ArrowDown'?1:-1)+items.value.length)%items.value.length;return}if(props.mentionOpen&&event.key==='Enter'&&!event.shiftKey){event.preventDefault();if(!props.mentionLoading)selectCurrent();return}if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();if(canSend.value)emit('send',props.modelValue.trim())}}
</script>

<template>
  <div class="ui-chat-composer-shell">
    <div v-if="mentions.length" class="ui-chat-composer__references"><span>{{ referenceLabel }}</span><v-chip v-for="(mention,index) in mentions" :key="`${mention.category}-${mention.id}-${index}`" size="small" color="primary" variant="tonal" closable @click:close="emit('remove-mention',index)">{{ mention.label }}</v-chip></div>
    <div class="ui-chat-composer">
      <div v-if="mentionOpen" class="ui-chat-composer__menu">
        <div v-if="mentionCategory" class="ui-chat-composer__menu-title">{{ mentionQuery }}</div><v-progress-linear :active="mentionLoading" indeterminate />
        <button v-for="(item,index) in items" :key="'id' in item?item.id:item.value" type="button" :class="{active:selectedIndex===index}" @mouseenter="selectedIndex=index" @mousedown.prevent @click="selectCurrent"><component :is="'icon' in item?item.icon:undefined" v-if="'icon' in item&&item.icon" :size="17"/>{{ item.title }}</button>
        <div v-if="mentionCategory&&!mentionLoading&&!items.length" class="ui-chat-composer__empty">{{ emptyLabel }}</div>
      </div>
      <span class="ui-chat-composer__leading"><slot name="leading"><strong aria-hidden="true">@</strong></slot></span>
      <v-textarea ref="inputRef" :model-value="modelValue" :placeholder="placeholder" rows="1" max-rows="7" auto-grow hide-details variant="plain" density="compact" :disabled="disabled" @update:model-value="emit('update:modelValue',$event)" @keydown="handleKeydown" />
      <v-btn v-if="streaming" :icon="IconX" color="error" :aria-label="stopLabel" @click="emit('stop')"/><v-btn v-else :icon="IconSend" color="primary" :disabled="!canSend" :aria-label="sendLabel" @click="emit('send',modelValue.trim())"/>
    </div>
    <div v-if="status||hint" class="ui-chat-composer__footer"><span>{{ status }}</span><span>{{ hint }}</span></div>
  </div>
</template>

<style scoped>
.ui-chat-composer-shell{position:relative;padding:.9rem 1.25rem .7rem}.ui-chat-composer__references,.ui-chat-composer__footer,.ui-chat-composer{width:min(100%,900px);margin-inline:auto}.ui-chat-composer__references{margin-bottom:.5rem;display:flex;align-items:center;flex-wrap:wrap;gap:.4rem}.ui-chat-composer__references>span{font-size:.7rem;opacity:.55}.ui-chat-composer{position:relative;display:flex;align-items:center;gap:.55rem;padding:.5rem .55rem;border:1px solid rgb(var(--v-theme-primary)/22%);border-radius:20px;background:rgb(var(--v-theme-surface)/96%);box-shadow:0 12px 32px rgb(var(--v-theme-on-surface)/16%)}.ui-chat-composer:focus-within{border-color:rgb(var(--v-theme-primary)/58%);box-shadow:0 0 0 3px rgb(var(--v-theme-primary)/10%),0 16px 38px rgb(var(--v-theme-on-surface)/18%)}.ui-chat-composer__leading{flex:0 0 34px;width:34px;height:34px;display:grid;place-items:center;border-radius:11px;color:rgb(var(--v-theme-primary));background:rgb(var(--v-theme-primary)/10%)}.ui-chat-composer__menu{position:absolute;inset-inline-start:0;bottom:calc(100% + 8px);z-index:20;width:min(430px,90vw);max-height:300px;overflow-y:auto;padding:.45rem;border:1px solid rgb(var(--v-theme-borderColor));border-radius:12px;background:rgb(var(--v-theme-surface));box-shadow:0 16px 40px rgb(0 0 0/20%)}.ui-chat-composer__menu button{width:100%;display:flex;align-items:center;gap:.5rem;padding:.65rem .75rem;border:0;border-radius:8px;color:inherit;background:transparent;text-align:start;cursor:pointer}.ui-chat-composer__menu button:hover,.ui-chat-composer__menu button.active{color:rgb(var(--v-theme-primary));background:rgb(var(--v-theme-primary)/12%)}.ui-chat-composer__menu-title,.ui-chat-composer__empty{padding:.6rem .75rem;font-size:.78rem;opacity:.7}.ui-chat-composer__footer{margin-top:.45rem;display:flex;justify-content:space-between;gap:1rem;font-size:.7rem;opacity:.72}@media(max-width:700px){.ui-chat-composer-shell{padding-inline:.75rem}.ui-chat-composer__leading,.ui-chat-composer__footer span:last-child{display:none}}
</style>
