import type { Component } from 'vue';

export type UiChatRole = 'user' | 'assistant' | 'system';
export type UiChatMessageStatus = 'streaming' | 'completed' | 'failed';

export interface UiChatMessageModel {
  id: string;
  role: UiChatRole;
  content: string;
  status?: UiChatMessageStatus;
  createdAt?: string;
}

export interface UiChatPrompt {
  id: string;
  content: string;
}

export interface UiChatMentionCategory {
  id: string;
  title: string;
  icon?: Component;
}

export interface UiChatMentionOption {
  value: string;
  title: string;
}

export interface UiChatMention {
  id: string;
  label: string;
  category: string;
}
