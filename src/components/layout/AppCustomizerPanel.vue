<script setup lang="ts">
import { computed, ref } from 'vue';
import { IconMoon, IconSun } from '@tabler/icons-vue';
import AppCustomizerControls, { type TextFieldHeight, type TextFieldVariant } from './AppCustomizerControls.vue';
import AppCustomizerSubmit from './AppCustomizerSubmit.vue';
import { serializeCustomizerPreferences } from '../../utils/customizerPreferences';

export interface CustomizerThemeOption { themeName: string; primary: string; secondary: string }
export type MenuOrientation = 'vertical' | 'horizontal';
export type SurfaceStyle = 'elevated' | 'rounded' | 'tonal' | 'premium-executive';
export type ContentWidth = 'wide' | 'compact';

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
  surfaceStyle?: SurfaceStyle;
  contentWidth?: ContentWidth;
  inputBg?: boolean;
  layoutType?: string;
  width?: number;
  fontLabel?: (font: string) => string;
}>(), { width: 400, fontLabel: (font: string) => font, surfaceStyle: 'elevated', contentWidth: 'wide', inputBg: false, layoutType: 'SideBar' });

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
  'update:surfaceStyle': [value: SurfaceStyle];
  'update:contentWidth': [value: ContentWidth];
  reset: [];
  apply: [payload: string];
}>();

const activeBaseTheme = computed(() => props.activeTheme.replace(/^Dark/, ''));
const activeTab = ref('style');
const surfaceOptions: Array<{ value: SurfaceStyle; title: string; description: string }> = [
  { value: 'elevated', title: 'برجسته', description: 'کارت با سایه و تفکیک واضح' },
  { value: 'rounded', title: 'گرد', description: 'لبه‌های نرم و کارت‌های گرد' },
  { value: 'tonal', title: 'تونال', description: 'سطوح تخت با مرزبندی ملایم' },
  { value: 'premium-executive', title: 'مدیریتی ممتاز', description: 'پوستهٔ حرفه‌ای با ناوبری تیره' }
];
function chooseTheme(themeName: string) {
  emit('update:activeTheme', props.themeMode === 'dark' ? `Dark${themeName}` : themeName);
}
function updateFontTheme(value: unknown) {
  if (typeof value === 'string') emit('update:fontTheme', value);
}

function applyCustomizer() {
  emit('apply', serializeCustomizerPreferences({
    version: 1, actTheme: props.activeTheme, themeMode: props.themeMode, fontTheme: props.fontTheme,
    inputBg: props.inputBg, layoutType: props.layoutType, menuOrientation: props.menuOrientation,
    textFieldBorderRadius: props.textFieldBorderRadius, textFieldVariant: props.textFieldVariant,
    uiDensity: props.textFieldHeight, textScale: props.textScale, surfaceStyle: props.surfaceStyle,
    contentWidth: props.contentWidth
  }));
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

      <v-card class="app-customizer-panel__card">
        <v-tabs v-model="activeTab" bg-color="lightprimary" align-tabs="center" fixed-tabs color="primary">
          <v-tab value="style">ظاهر</v-tab><v-tab value="surfaces">سطح‌ها</v-tab><v-tab value="font">فونت</v-tab>
        </v-tabs>
        <v-card-text>
          <v-tabs-window v-model="activeTab">
        <v-tabs-window-item value="style">
          <div class="app-customizer-panel__content pa-4">
            <section><h6 class="text-subtitle-1 font-weight-medium">حالت روز / شب</h6><div class="theme-toggle-container"><div class="theme-toggle" :class="{ 'dark-mode': themeMode === 'dark' }" @click="emit('update:themeMode', themeMode === 'light' ? 'dark' : 'light')"><div class="toggle-slider"><div class="toggle-icon"><IconSun v-if="themeMode === 'light'" size="24" stroke-width="2" /><IconMoon v-else size="24" stroke-width="2" color="white" /></div></div></div></div></section>
            <section><h6 class="text-subtitle-1 font-weight-medium">رنگ بندی</h6><div class="custom-theme-colors"><button v-for="color in colors" :key="color.themeName" :class="['color-option', { selected: activeBaseTheme === color.themeName }]" :style="{ background: `conic-gradient(${color.primary} 50%, ${color.secondary} 50%)` }" :aria-label="color.themeName" @click="chooseTheme(color.themeName)" /></div></section>
            <AppCustomizerControls :text-field-border-radius="textFieldBorderRadius" :text-field-variant="textFieldVariant" :text-field-height="textFieldHeight" :text-scale="textScale" :apply-preview="false" :show-actions="false" @update:text-field-border-radius="emit('update:textFieldBorderRadius', $event)" @update:text-field-variant="emit('update:textFieldVariant', $event)" @update:text-field-height="emit('update:textFieldHeight', $event)" @update:text-scale="emit('update:textScale', $event)" />
            <section class="app-customizer-panel__content-width">
              <div><h6 class="text-subtitle-1 font-weight-medium">عرض محتوای صفحه</h6></div>
              <div class="app-customizer-panel__width-options">
                <v-btn :color="contentWidth === 'compact' ? 'primary' : undefined" :variant="contentWidth === 'compact' ? 'flat' : 'outlined'" icon aria-label="محتوای کم‌عرض" title="محتوای کم‌عرض" @click="emit('update:contentWidth', 'compact')"><span class="content-width-preview content-width-preview--compact" aria-hidden="true" /></v-btn>
                <v-btn :color="contentWidth === 'wide' ? 'primary' : undefined" :variant="contentWidth === 'wide' ? 'flat' : 'outlined'" icon aria-label="محتوای عریض" title="محتوای عریض" @click="emit('update:contentWidth', 'wide')"><span class="content-width-preview content-width-preview--wide" aria-hidden="true" /></v-btn>
              </div>
            </section>
          </div>
        </v-tabs-window-item>
        <v-tabs-window-item value="surfaces">
          <div class="app-customizer-panel__content pa-4">
            <section>
              <h6>سبک کلی پروژه</h6>
              <p class="app-customizer-panel__hint">رنگ‌بندی ثابت می‌ماند؛ فقط جنس سطوح، کارت‌ها، منوها و پنل‌ها تغییر می‌کند.</p>
              <div class="app-customizer-panel__surfaces">
                <button v-for="style in surfaceOptions" :key="style.value" :class="['surface-preview', `surface-preview--${style.value}`, { active: surfaceStyle === style.value }]" @click="emit('update:surfaceStyle', style.value)">
                  <span class="surface-preview__sample" aria-hidden="true"><i /><b /><em /></span>
                  <span class="surface-preview__copy"><strong>{{ style.title }}</strong><small>{{ style.description }}</small></span>
                </button>
              </div>
              <div class="app-customizer-panel__menu-orientation">
                <h6>چیدمان منو</h6>
                <p class="app-customizer-panel__hint">نمایش ناوبری را در سایدبار یا نوار بالایی انتخاب کنید.</p>
                <div class="d-flex gap-2"><v-btn :class="['menu-orientation-option', { active: menuOrientation === 'vertical' }]" variant="outlined" :color="menuOrientation === 'vertical' ? 'primary' : 'grey'" aria-label="منوی کناری" @click="emit('update:menuOrientation', 'vertical')" class="flex-1"><span class="sidebar-preview closed" /></v-btn><v-btn :class="['menu-orientation-option', { active: menuOrientation === 'horizontal' }]" variant="outlined" :color="menuOrientation === 'horizontal' ? 'primary' : 'grey'" aria-label="منوی بالایی" @click="emit('update:menuOrientation', 'horizontal')" class="flex-1"><span class="sidebar-preview open" /></v-btn></div>
              </div>
            </section>
          </div>
        </v-tabs-window-item>
        <!-- This tab is mounted only after the user explicitly opens it. Showing
             each row in its own font makes selection meaningful without adding
             font requests to the application's initial render. -->
        <v-tabs-window-item value="font"><div class="app-customizer-panel__content pa-4"><h6 class="text-subtitle-1 font-weight-medium mb-4">انتخاب فونت</h6><v-radio-group :model-value="fontTheme" hide-details class="custom-font" @update:model-value="updateFontTheme"><v-radio v-for="font in fonts" :key="font" :label="fontLabel(font)" :value="font" color="primary" class="mb-4 font-option" :style="{ fontFamily: font }" /></v-radio-group></div></v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </div>
    <div class="app-customizer-panel__actions"><AppCustomizerSubmit @apply="applyCustomizer" /></div>
  </v-navigation-drawer>
</template>

<style scoped>
.app-customizer-panel :deep(.v-navigation-drawer__content) { display:flex; flex-direction:column; overflow:hidden; background:rgb(var(--v-theme-surface)); }
.app-customizer-panel__scroll { flex:1 1 auto; min-height:0; overflow:auto; }
.app-customizer-panel__header { padding:18px 20px 14px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(var(--v-theme-borderLight),.45); }
.app-customizer-panel__content { display:grid; gap:24px; }
.app-customizer-panel__content section { display:grid; gap:12px; }
.app-customizer-panel__card{border-radius:0}.app-customizer-panel__content h6 { margin:0; }
.app-customizer-panel__hint{margin:0;color:rgb(var(--v-theme-lightText));font-size:.82rem;line-height:1.7}
.theme-toggle{width:74px;height:36px;padding:3px;border-radius:999px;background:rgb(var(--v-theme-lightprimary));cursor:pointer;transition:.25s}.theme-toggle.dark-mode{background:rgb(var(--v-theme-primary))}.toggle-slider{height:30px;width:30px;border-radius:50%;background:rgb(var(--v-theme-surface));display:grid;place-items:center;transition:transform .25s;box-shadow:0 2px 5px rgba(0,0,0,.18)}.theme-toggle.dark-mode .toggle-slider{transform:translateX(-38px)}.toggle-icon{display:grid;place-items:center;color:rgb(var(--v-theme-primary))}.theme-toggle.dark-mode .toggle-icon{color:#fff}.custom-theme-colors{display:flex;flex-wrap:wrap;gap:10px;justify-content:start}.color-option{width:44px;height:44px;border-radius:50%;cursor:pointer;position:relative;transition:all .2s ease;transform:rotate(45deg);border:2px solid rgba(255,255,255,.7)}.color-option:hover{box-shadow:0 4px 12px rgba(0,0,0,.2);transform:scale(1.08) rotate(45deg)}.color-option.selected{border:3px solid rgb(var(--v-theme-primary));box-shadow:0 0 0 3px rgba(var(--v-theme-primary),.3)}.color-option.selected::after{content:'✔';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-45deg);color:#fff;font-size:16px;font-weight:bold;text-shadow:0 1px 3px rgba(0,0,0,.7)}
.sidebar-preview{display:block;width:45px;height:30px;border:2px dashed #ccc;border-radius:3px;margin:0 auto;position:relative}.sidebar-preview::before{content:'';position:absolute;top:2px;right:2px;background:#027efb;border-radius:1px}.sidebar-preview.closed::before{width:6px;height:23px}.sidebar-preview.open::before{width:36px;height:6px}.flex-1{flex:1}.gap-2{gap:8px}:deep(.menu-orientation-option.active){border-width:3px!important;background:rgba(var(--v-theme-primary),.10)!important;box-shadow:0 0 0 1px rgba(var(--v-theme-primary),.10)}.font-option :deep(.v-selection-control__wrapper){padding:10px 12px;border-radius:8px;transition:background-color .2s ease}.font-option:hover :deep(.v-selection-control__wrapper){background-color:rgba(var(--v-theme-primary),.1)}
.app-customizer-panel__menu-orientation{display:grid;gap:10px;margin-top:22px;padding-top:20px;border-top:1px solid rgba(var(--v-theme-borderLight),.5)}.app-customizer-panel__menu-orientation h6{margin:0}
.app-customizer-panel__content-width{display:flex!important;align-items:center;justify-content:space-between;gap:12px}.app-customizer-panel__width-options{display:flex;flex:0 0 auto;gap:4px}.app-customizer-panel__width-options :deep(.v-btn){height:44px;width:44px;min-width:44px;padding:0;border-radius:6px}.content-width-preview{display:block;height:20px;border:2px solid currentColor;border-radius:3px;opacity:.9;position:relative}.content-width-preview::after{content:'';position:absolute;inset:4px;border-block:1px solid currentColor;opacity:.55}.content-width-preview--compact{width:18px}.content-width-preview--wide{width:30px}

.app-customizer-panel__surfaces{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.surface-preview{display:grid;gap:9px;padding:10px;border:2px solid transparent;border-radius:12px;color:rgb(var(--v-theme-on-surface));background:rgb(var(--v-theme-surface));cursor:pointer;text-align:right;transition:border-color .2s ease,background-color .2s ease,transform .2s ease}.surface-preview:hover{transform:translateY(-1px);border-color:rgba(var(--v-theme-primary),.5)}.surface-preview.active{border-color:rgb(var(--v-theme-primary));background:rgb(var(--v-theme-lightprimary))}.surface-preview__sample{height:54px!important;display:grid!important;grid-template-columns:18px 1fr!important;grid-template-rows:10px 1fr!important;gap:5px!important;padding:6px!important;border:1px solid rgba(var(--v-theme-borderLight),.7)!important;border-radius:8px!important;background:rgb(var(--v-theme-background))!important;box-shadow:none!important}.surface-preview__sample i{grid-row:1/-1;border-radius:3px;background:rgb(var(--v-theme-primary));opacity:.82}.surface-preview__sample b{border-radius:2px;background:rgba(var(--v-theme-primary),.26)}.surface-preview__sample em{border-radius:4px;background:rgb(var(--v-theme-surface));box-shadow:0 4px 7px rgba(0,0,0,.1)}.surface-preview--elevated .surface-preview__sample em{box-shadow:0 7px 10px rgba(18,30,49,.2)}.surface-preview--rounded .surface-preview__sample,.surface-preview--rounded .surface-preview__sample em{border-radius:22px!important}.surface-preview--rounded .surface-preview__sample i{border-radius:16px}.surface-preview--tonal .surface-preview__sample{background:linear-gradient(135deg,rgb(var(--v-theme-lightprimary)),rgb(var(--v-theme-lightsecondary)))!important}.surface-preview--tonal .surface-preview__sample em{box-shadow:none;border:1px solid rgba(var(--v-theme-primary),.16)}.surface-preview--premium-executive .surface-preview__sample{background:#142137!important;border-color:#263754!important}.surface-preview--premium-executive .surface-preview__sample i{background:#263954}.surface-preview--premium-executive .surface-preview__sample b{background:rgba(255,255,255,.18)}.surface-preview--premium-executive .surface-preview__sample em{background:#f7f9fc;box-shadow:0 4px 8px rgba(0,0,0,.22)}.surface-preview__copy{display:grid;gap:2px}.surface-preview strong{font-size:.78rem}.surface-preview small{color:rgb(var(--v-theme-lightText));font-size:.68rem;line-height:1.45}.surface-preview.active small{color:rgb(var(--v-theme-on-surface))}
.vertical-preview,.horizontal-preview { display:block; width:36px; height:22px; border:2px solid currentColor; border-radius:3px; }
.vertical-preview { border-inline-end-width:10px; }.horizontal-preview { border-top-width:8px; }
.app-customizer-panel__actions { flex:0 0 auto; min-height:92px; padding:14px 20px 16px; background:rgb(var(--v-theme-surface)); border-top:1px solid rgba(var(--v-theme-borderLight),.5); box-shadow:0 -8px 18px rgba(0,0,0,.06); }

/* Customizer contrast must follow the selected surface as well. */
:global(.surface-premium-executive) .app-customizer-panel :deep(.v-navigation-drawer__content) { background:#fff; }
:global(.surface-premium-executive[class*='v-theme--Dark']) .app-customizer-panel :deep(.v-navigation-drawer__content) { background:#182333; }
:global(.surface-premium-executive[class*='v-theme--Dark']) .app-customizer-panel__header,
:global(.surface-premium-executive[class*='v-theme--Dark']) .app-customizer-panel__actions { background:#182333; border-color:#2b3b4f; }
:global(.surface-premium-executive[class*='v-theme--Dark']) .app-customizer-panel__hint { color:#b5c2d2; }
</style>
