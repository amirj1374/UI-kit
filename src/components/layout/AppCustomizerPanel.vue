<script setup lang="ts">
import { computed, ref } from 'vue';
import { IconMoon, IconSun } from '@tabler/icons-vue';
import AppCustomizerControls, { type TextFieldHeight, type TextFieldVariant } from './AppCustomizerControls.vue';
import AppCustomizerSubmit from './AppCustomizerSubmit.vue';

export interface CustomizerThemeOption { themeName: string; primary: string; secondary: string }
export type MenuOrientation = 'vertical' | 'horizontal';

const props = withDefaults(defineProps<{
  modelValue: boolean;
  themeMode: 'light' | 'dark';
  activeTheme: string;
  colors: CustomizerThemeOption[];
  fontTheme: string;
  fonts: string[];
  textFieldBorderRadius: number;
  textFieldVariant: TextFieldVariant;
  textFieldHeight: TextFieldHeight;
  textScale: number;
  menuOrientation: MenuOrientation;
  width?: number;
  fontLabel?: (font: string) => string;
}>(), { width: 400, fontLabel: (font: string) => font });

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:themeMode': [value: 'light' | 'dark'];
  'update:activeTheme': [value: string];
  'update:fontTheme': [value: string];
  'update:textFieldBorderRadius': [value: number];
  'update:textFieldVariant': [value: TextFieldVariant];
  'update:textFieldHeight': [value: TextFieldHeight];
  'update:textScale': [value: number];
  'update:menuOrientation': [value: MenuOrientation];
  reset: [];
  apply: [];
}>();

const activeBaseTheme = computed(() => props.activeTheme.replace(/^Dark/, ''));
const activeTab = ref('style');
function chooseTheme(themeName: string) {
  emit('update:activeTheme', props.themeMode === 'dark' ? `Dark${themeName}` : themeName);
}
function updateFontTheme(value: unknown) {
  if (typeof value === 'string') emit('update:fontTheme', value);
}
</script>

<template>
  <v-navigation-drawer
    :model-value="modelValue"
    app temporary elevation="10" location="left" :width="width"
    class="app-customizer-panel"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="app-customizer-panel__scroll">
      <header class="app-customizer-panel__header">
        <div class="text-h6 font-weight-medium">شخصی سازی</div>
        <div>
          <v-btn color="error" variant="outlined" size="small" class="ml-2" @click="emit('reset')">بارنشانی</v-btn>
          <v-btn variant="text" color="lightText" icon="$close" density="compact" @click="emit('update:modelValue', false)" />
        </div>
      </header>

      <v-tabs v-model="activeTab" class="app-customizer-panel__tabs" bg-color="lightprimary" align-tabs="center" fixed-tabs color="primary">
        <v-tab value="style">ظاهر</v-tab><v-tab value="font">فونت</v-tab>
      </v-tabs>
      <v-tabs-window v-model="activeTab">
        <v-tabs-window-item value="style">
          <div class="app-customizer-panel__content">
            <section><h6>حالت روز / شب</h6><v-btn icon variant="tonal" color="primary" @click="emit('update:themeMode', themeMode === 'light' ? 'dark' : 'light')"><IconSun v-if="themeMode === 'light'" /><IconMoon v-else /></v-btn></section>
            <section><h6>رنگ بندی</h6><div class="app-customizer-panel__colors"><button v-for="color in colors" :key="color.themeName" :class="{ active: activeBaseTheme === color.themeName }" :style="{ background: `conic-gradient(${color.primary} 50%, ${color.secondary} 50%)` }" :aria-label="color.themeName" @click="chooseTheme(color.themeName)" /></div></section>
            <AppCustomizerControls :text-field-border-radius="textFieldBorderRadius" :text-field-variant="textFieldVariant" :text-field-height="textFieldHeight" :text-scale="textScale" :apply-preview="false" :show-actions="false" @update:text-field-border-radius="emit('update:textFieldBorderRadius', $event)" @update:text-field-variant="emit('update:textFieldVariant', $event)" @update:text-field-height="emit('update:textFieldHeight', $event)" @update:text-scale="emit('update:textScale', $event)" />
            <section><h6>انواع منو</h6><div class="app-customizer-panel__menu"><v-btn :variant="menuOrientation === 'vertical' ? 'flat' : 'outlined'" color="primary" @click="emit('update:menuOrientation', 'vertical')"><span class="vertical-preview" /></v-btn><v-btn :variant="menuOrientation === 'horizontal' ? 'flat' : 'outlined'" color="primary" @click="emit('update:menuOrientation', 'horizontal')"><span class="horizontal-preview" /></v-btn></div></section>
          </div>
        </v-tabs-window-item>
        <v-tabs-window-item value="font"><div class="app-customizer-panel__content"><h6>انتخاب فونت</h6><v-radio-group :model-value="fontTheme" hide-details @update:model-value="updateFontTheme"><v-radio v-for="font in fonts" :key="font" :label="fontLabel(font)" :value="font" color="primary" :style="{ fontFamily: font }" /></v-radio-group></div></v-tabs-window-item>
      </v-tabs-window>
    </div>
    <div class="app-customizer-panel__actions"><AppCustomizerSubmit @apply="emit('apply')" /></div>
  </v-navigation-drawer>
</template>

<style scoped>
.app-customizer-panel :deep(.v-navigation-drawer__content) { display:flex; flex-direction:column; overflow:hidden; }
.app-customizer-panel__scroll { flex:1; min-height:0; overflow:auto; }
.app-customizer-panel__header { padding:20px; display:flex; align-items:center; justify-content:space-between; }
.app-customizer-panel__content { display:grid; gap:24px; padding:20px; }
.app-customizer-panel__content section { display:grid; gap:12px; }
.app-customizer-panel__content h6 { margin:0; font-size:1rem; font-weight:700; }
.app-customizer-panel__colors,.app-customizer-panel__menu { display:flex; flex-wrap:wrap; gap:12px; }
.app-customizer-panel__colors button { width:48px; height:48px; border-radius:50%; border:3px solid transparent; cursor:pointer; }
.app-customizer-panel__colors button.active { border-color:rgb(var(--v-theme-primary)); box-shadow:0 0 0 2px rgb(var(--v-theme-surface)); }
.app-customizer-panel__menu .v-btn { width:64px; height:44px; }
.vertical-preview,.horizontal-preview { display:block; width:36px; height:22px; border:2px solid currentColor; border-radius:3px; }
.vertical-preview { border-inline-end-width:10px; }.horizontal-preview { border-top-width:8px; }
.app-customizer-panel__actions { padding:16px 20px; border-top:1px solid rgba(var(--v-theme-borderLight),.5); box-shadow:0 -8px 18px rgba(0,0,0,.06); }
</style>
