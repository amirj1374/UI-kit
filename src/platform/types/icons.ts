import type { Component } from 'vue';
export type UiIconSource = string | Component;
export interface UiSemanticIcons {
  close: UiIconSource; confirm: UiIconSource; cancel: UiIconSource; loading: UiIconSource; empty: UiIconSource; error: UiIconSource; permissionDenied: UiIconSource; retry: UiIconSource; menu: UiIconSource; theme: UiIconSource; notifications: UiIconSource; profile: UiIconSource; chevronDown: UiIconSource; search: UiIconSource; clear: UiIconSource; delete: UiIconSource; edit: UiIconSource; create: UiIconSource; download: UiIconSource; upload: UiIconSource; print: UiIconSource; previous: UiIconSource; next: UiIconSource; warning: UiIconSource; success: UiIconSource; expand: UiIconSource; collapse: UiIconSource;
}
export type UiSemanticIconName = keyof UiSemanticIcons;
