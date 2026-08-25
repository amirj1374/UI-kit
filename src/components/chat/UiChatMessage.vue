<script setup lang="ts">
import { ref } from 'vue';
import { IconCheck, IconCopy, IconPencil, IconUser } from '@tabler/icons-vue';
import UiChatMarkdown from './UiChatMarkdown.vue';
import type { UiChatMessageModel } from './types';

const props = withDefaults(defineProps<{ message: UiChatMessageModel; editingDisabled?: boolean; labels?: Partial<{ edit:string; copy:string; copied:string; cancel:string; save:string; typing:string; copyCode:string; codeCopied:string }> }>(), {
  editingDisabled: false,
  labels: () => ({})
});
const emit = defineEmits<{ edit: [message: UiChatMessageModel, content: string]; copy: [message: UiChatMessageModel] }>();
const copied = ref(false); const editing = ref(false); const draft = ref('');
const label = (key: string, fallback: string) => props.labels[key as keyof typeof props.labels] || fallback;
function beginEditing(){if(props.editingDisabled)return;draft.value=props.message.content;editing.value=true}
function cancelEditing(){editing.value=false;draft.value=''}
function saveEditing(){const content=draft.value.trim();if(!content||content===props.message.content)return cancelEditing();emit('edit',props.message,content);editing.value=false}
async function copyMessage(){if(!navigator.clipboard||!props.message.content)return;await navigator.clipboard.writeText(props.message.content);emit('copy',props.message);copied.value=true;window.setTimeout(()=>copied.value=false,1500)}
</script>

<template>
  <article :class="['ui-chat-message', `ui-chat-message--${message.role}`]">
    <slot name="avatar" :message="message"><div class="ui-chat-message__avatar"><IconUser v-if="message.role==='user'" :size="18"/><strong v-else aria-hidden="true">AI</strong></div></slot>
    <div class="ui-chat-message__content">
      <div v-if="message.role==='user'&&editing" class="ui-chat-message__editor">
        <v-textarea v-model="draft" rows="2" max-rows="6" auto-grow hide-details autofocus variant="outlined" density="compact" @keydown.ctrl.enter="saveEditing" />
        <div><v-btn size="small" variant="text" @click="cancelEditing">{{ label('cancel','Cancel') }}</v-btn><v-btn size="small" color="primary" variant="flat" :disabled="!draft.trim()" @click="saveEditing">{{ label('save','Save') }}</v-btn></div>
      </div>
      <div v-else-if="message.role==='user'" class="ui-chat-message__user-text">{{ message.content }}</div>
      <UiChatMarkdown v-else-if="message.content" :content="message.content" :copy-label="label('copyCode','Copy code')" :copied-label="label('codeCopied','Copied')" />
      <div v-else class="ui-chat-message__typing" :aria-label="label('typing','Receiving response')"><span/><span/><span/></div>
      <v-btn v-if="message.role==='user'&&!editing" class="ui-chat-message__action" size="x-small" variant="text" :icon="IconPencil" :aria-label="label('edit','Edit message')" :disabled="editingDisabled" @click="beginEditing" />
      <v-btn v-if="message.role==='assistant'&&message.content" class="ui-chat-message__action" size="x-small" variant="text" :icon="copied?IconCheck:IconCopy" :aria-label="copied?label('copied','Copied'):label('copy','Copy response')" @click="copyMessage" />
    </div>
  </article>
</template>

<style scoped>
.ui-chat-message{direction:ltr;display:flex;gap:.75rem;width:fit-content;max-width:min(100%,900px)}.ui-chat-message--assistant{align-self:flex-start;margin-inline-end:auto}.ui-chat-message--user{flex-direction:row-reverse;align-self:flex-end;margin-inline-start:auto}.ui-chat-message__avatar{flex:0 0 38px;width:38px;height:38px;display:grid;place-items:center;border-radius:10px;color:rgb(var(--v-theme-on-primary));background:rgb(var(--v-theme-primary))}.ui-chat-message__content{direction:var(--ui-chat-content-direction,rtl);min-width:0;max-width:min(760px,calc(100vw - 120px));padding:.8rem 1rem;border:1px solid rgb(var(--v-theme-borderColor));border-radius:12px;background:rgb(var(--v-theme-surface));text-align:start}.ui-chat-message--user .ui-chat-message__content{background:color-mix(in srgb,rgb(var(--v-theme-primary)) 16%,rgb(var(--v-theme-surface)));border-color:rgb(var(--v-theme-primary)/38%);border-inline-end-width:3px;box-shadow:0 7px 20px rgb(var(--v-theme-primary)/12%)}.ui-chat-message__user-text{white-space:pre-wrap;line-height:1.8}.ui-chat-message__editor{width:min(560px,calc(100vw - 150px))}.ui-chat-message__editor>div{margin-top:.55rem;display:flex;justify-content:flex-end;gap:.35rem}.ui-chat-message__action{display:block;margin-inline-start:auto;opacity:.65}.ui-chat-message__typing{display:flex;gap:5px;padding:.35rem .15rem}.ui-chat-message__typing span{width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.35;animation:ui-chat-bounce 1.2s infinite}.ui-chat-message__typing span:nth-child(2){animation-delay:.15s}.ui-chat-message__typing span:nth-child(3){animation-delay:.3s}@keyframes ui-chat-bounce{30%{transform:translateY(-5px);opacity:.8}}@media(max-width:700px){.ui-chat-message{max-width:100%}.ui-chat-message__content{max-width:calc(100vw - 82px)}.ui-chat-message__editor{width:calc(100vw - 122px)}}
</style>
