<script setup lang="ts">
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import css from 'highlight.js/lib/languages/css';
import csharp from 'highlight.js/lib/languages/csharp';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import php from 'highlight.js/lib/languages/php';
import powershell from 'highlight.js/lib/languages/powershell';
import python from 'highlight.js/lib/languages/python';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import 'highlight.js/styles/github-dark.css';

const props = withDefaults(defineProps<{ content: string; copyLabel?: string; copiedLabel?: string }>(), {
  copyLabel: 'Copy code', copiedLabel: 'Copied'
});

const languages = { bash, c, cpp, css, csharp, dockerfile, go, java, javascript, json, kotlin, php, powershell, python, rust, sql, typescript, xml, yaml };
Object.entries(languages).forEach(([name, language]) => { if (!hljs.getLanguage(name)) hljs.registerLanguage(name, language); });
hljs.registerAliases(['js'], { languageName: 'javascript' });
hljs.registerAliases(['ts'], { languageName: 'typescript' });

const aliases: Record<string, string> = { 'c++':'cpp','c#':'csharp',cs:'csharp',docker:'dockerfile',golang:'go',html:'xml',kt:'kotlin',ps1:'powershell',py:'python',sh:'bash',shell:'bash',tsx:'typescript',vue:'xml',yml:'yaml' };
const normalize = (value: string) => aliases[value.trim().toLowerCase()] || value.trim().toLowerCase();
const highlight = (code: string, language: string) => {
  const normalized = normalize(language);
  return normalized && hljs.getLanguage(normalized) ? hljs.highlight(code, { language: normalized, ignoreIllegals: true }).value : hljs.highlightAuto(code).value;
};

const markdown = new MarkdownIt({ html: false, linkify: true, breaks: true, highlight });
const escapeHtml = markdown.utils.escapeHtml;
markdown.renderer.rules.fence = (tokens, index) => {
  const token = tokens[index];
  const language = token.info.trim().split(/\s+/g)[0];
  const label = language ? escapeHtml(language.toUpperCase()) : 'CODE';
  return `<div class="ui-chat-code"><div class="ui-chat-code__toolbar"><span>${label}</span><button type="button" data-copy-code>${escapeHtml(props.copyLabel)}</button></div><pre><code class="language-${escapeHtml(language || 'text')}">${highlight(token.content, language)}</code></pre></div>`;
};
const renderedContent = computed(() => markdown.render(props.content || ''));

async function handleClick(event: MouseEvent) {
  const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('[data-copy-code]') : null;
  const code = target?.closest('.ui-chat-code')?.querySelector('code')?.textContent;
  if (!target || !code || !navigator.clipboard) return;
  await navigator.clipboard.writeText(code);
  target.textContent = props.copiedLabel;
  target.classList.add('copied');
  window.setTimeout(() => { target.textContent = props.copyLabel; target.classList.remove('copied'); }, 1500);
}
</script>

<template><div class="ui-chat-markdown" @click="handleClick" v-html="renderedContent" /></template>

<style scoped>
.ui-chat-markdown{min-width:0;overflow-wrap:anywhere;word-break:break-word}.ui-chat-markdown :deep(p){margin:0 0 .75rem;line-height:1.9}.ui-chat-markdown :deep(p:last-child){margin-bottom:0}.ui-chat-markdown :deep(ul),.ui-chat-markdown :deep(ol){padding-inline-start:1.5rem;margin:.5rem 0}.ui-chat-markdown :deep(a){color:rgb(var(--v-theme-primary));overflow-wrap:anywhere}.ui-chat-markdown :deep(.ui-chat-code){direction:ltr;overflow:hidden;margin:.75rem 0;border:1px solid rgb(255 255 255/10%);border-radius:12px;background:#0d1117}.ui-chat-markdown :deep(.ui-chat-code__toolbar){min-height:34px;padding:.35rem .55rem .35rem .8rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgb(255 255 255/10%);color:#9ca3af;background:#161b22;font: .68rem Consolas,Monaco,monospace}.ui-chat-markdown :deep(.ui-chat-code__toolbar button){padding:.25rem .55rem;border:0;border-radius:6px;color:#c9d1d9;background:transparent;cursor:pointer}.ui-chat-markdown :deep(.ui-chat-code__toolbar button.copied){color:#7ee787}.ui-chat-markdown :deep(pre){direction:ltr;text-align:left;overflow-x:auto;padding:1rem;margin:0;color:#e6edf3}.ui-chat-markdown :deep(code){direction:ltr;font-family:Consolas,Monaco,monospace;font-size:.875em}.ui-chat-markdown :deep(:not(pre)>code){display:inline-block;padding:.12rem .4rem;border:1px solid rgb(var(--v-theme-primary)/20%);border-radius:6px;color:rgb(var(--v-theme-primary));background:rgb(var(--v-theme-primary)/8%);font-weight:700}.ui-chat-markdown :deep(table){width:100%;display:block;overflow-x:auto;border-collapse:collapse;margin:.75rem 0}.ui-chat-markdown :deep(th),.ui-chat-markdown :deep(td){padding:.55rem .75rem;border:1px solid rgb(var(--v-theme-borderColor));white-space:nowrap}
</style>
