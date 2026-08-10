<script setup lang="ts">
import { computed, nextTick, watch } from 'vue';
import { useDisplay } from 'vuetify';
import AppCustomizerPanel from './AppCustomizerPanel.vue';
import { useCustomizerStore } from '../../stores/customizer';

const emit = defineEmits<{ save: [payload: string] }>();
const customizer = useCustomizerStore();
const { width } = useDisplay();
const drawerWidth = computed(() => Math.min(width.value, 400));
const colors = [
  { themeName: 'ModernTheme', primary: '#6366f1', secondary: '#8b5cf6' },
  { themeName: 'PurpleTheme', primary: '#1e88e5', secondary: '#5e35b1' },
  { themeName: 'SteelTealGreen', primary: '#607D8B', secondary: '#009688' },
  { themeName: 'OrangeTheme', primary: '#C77E23', secondary: '#16595A' },
  { themeName: 'TealTheme', primary: '#00695C', secondary: '#4DB6AC' },
  { themeName: 'SilverTheme', primary: '#64748b', secondary: '#94a3b8' },
  { themeName: 'RedTheme', primary: '#203461', secondary: '#EC407A' },
  { themeName: 'NavyGoldTheme', primary: '#d1a407', secondary: '#001F54' },
  { themeName: 'FutureBlueTheme', primary: '#00A6FF', secondary: '#64748B' },
  { themeName: 'ObsidianMintTheme', primary: '#14B8A6', secondary: '#334155' },
  { themeName: 'SaffronOliveTheme', primary: '#C2410C', secondary: '#4D7C0F' },
  { themeName: 'SandRoseTheme', primary: '#BE5C75', secondary: '#C2A878' },
  { themeName: 'TerracottaMossTheme', primary: '#B45309', secondary: '#4D5D3D' },
  { themeName: 'MulberryLimeTheme', primary: '#8E3A59', secondary: '#84A52B' },
  { themeName: 'CottonCandyMagentaTheme', primary: '#D946EF', secondary: '#06B6D4' },
  { themeName: 'GoldenLuxuryTheme', primary: '#D4AF37', secondary: '#C9A227' }
];
const fonts = ['vazir', 'iranSans', 'kalamehLight', 'vazirmatn', 'sahel', 'samim', 'IranNastaliq'];
const labels: Record<string, string> = { vazir: 'وزیر', iranSans: 'ایران‌سنس', kalamehLight: 'کلمه سبک', vazirmatn: 'وزیرمتن', sahel: 'ساحل', samim: 'صمیم', IranNastaliq: 'ایران نستعلیق' };
const mode = computed<'light' | 'dark'>(() => customizer.themeMode === 'dark' ? 'dark' : 'light');
watch(() => customizer.fontTheme, value => document.documentElement.style.setProperty('--font-theme', value), { immediate: true });
watch(() => customizer.textFieldBorderRadius, value => document.documentElement.style.setProperty('--app-text-field-radius', `${value}px`), { immediate: true });
watch(() => customizer.textFieldVariant, value => document.documentElement.dataset.textFieldVariant = value, { immediate: true });
watch(() => customizer.uiDensity, value => document.documentElement.dataset.uiDensity = value, { immediate: true });
watch(() => customizer.textScale, value => document.documentElement.style.setProperty('--app-text-scale', String(value / 100)), { immediate: true });
watch(() => customizer.surfaceStyle, value => document.documentElement.dataset.surfaceStyle = value, { immediate: true });
watch(() => customizer.contentWidth, value => document.documentElement.dataset.contentWidth = value, { immediate: true });
watch(() => customizer.actTheme, async () => {
  await nextTick();
  const primary = getComputedStyle(document.querySelector('.v-application') ?? document.documentElement)
    .getPropertyValue('--v-theme-primary').trim();
  if (primary) document.documentElement.style.setProperty('--app-scrollbar-primary', primary);
}, { immediate: true, flush: 'post' });
watch(() => customizer.themeMode, value => { const base = customizer.actTheme.replace(/^Dark/, ''); customizer.SET_THEME(value === 'dark' ? `Dark${base}` : base); }, { immediate: true });
watch(() => customizer.menuOrientation, value => { customizer.SET_LAYOUT_TYPE(value === 'horizontal' ? 'NavBar' : 'SideBar'); }, { immediate: true });
function reset() { customizer.LOAD_PREFERENCES(undefined); }
</script>
<template>
  <AppCustomizerPanel
    :model-value="customizer.Customizer_drawer" :width="drawerWidth" :theme-mode="mode" :active-theme="customizer.actTheme"
    :colors="colors" :font-theme="customizer.fontTheme" :fonts="fonts" :text-field-border-radius="customizer.textFieldBorderRadius"
    :text-field-variant="customizer.textFieldVariant" :text-field-height="customizer.uiDensity" :text-scale="customizer.textScale"
    :menu-orientation="customizer.menuOrientation" :surface-style="customizer.surfaceStyle" v-model:content-width="customizer.contentWidth"
    :input-bg="customizer.inputBg" :layout-type="customizer.layoutType" :font-label="font => labels[font] || font"
    @update:model-value="customizer.SET_CUSTOMIZER_DRAWER" @update:theme-mode="customizer.SET_THEME_MODE" @update:active-theme="customizer.SET_THEME"
    @update:font-theme="customizer.SET_FONT" @update:text-field-border-radius="customizer.SET_TEXT_FIELD_BORDER_RADIUS"
    @update:text-field-variant="customizer.SET_TEXT_FIELD_VARIANT" @update:text-field-height="customizer.SET_UI_DENSITY"
    @update:text-scale="customizer.SET_TEXT_SCALE" @update:menu-orientation="customizer.SET_MENU_ORIENTATION"
    @update:surface-style="customizer.SET_SURFACE_STYLE" @reset="reset" @apply="emit('save', $event)"
  />
</template>
