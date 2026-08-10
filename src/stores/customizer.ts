import { defineStore } from 'pinia';
import { parseCustomizerPreferences, type ContentWidth, type CustomizerPreferences, type MenuOrientation, type SurfaceStyle } from '../utils/customizerPreferences';

export const useCustomizerStore = defineStore({
  id: 'customizer',
  state: () => ({
    Sidebar_drawer: true,
    Customizer_drawer: false,
    mini_sidebar: false,
    fontTheme: 'vazir',
    inputBg: false,
    textFieldBorderRadius: 10,
    textFieldVariant: 'outlined' as const,
    uiDensity: 'default' as const,
    textScale: 100,
    surfaceStyle: 'elevated' as SurfaceStyle,
    contentWidth: 'wide' as ContentWidth,
    layoutType: 'SideBar',
    actTheme: 'PurpleTheme',
    loading: false,
    themeMode: 'light', // 'light' or 'dark'
    menuOrientation: 'vertical' as MenuOrientation
  }),

  getters: {
    getActTheme: (state) => state.actTheme,
  },
  actions: {
    SET_SIDEBAR_DRAWER(payload?: boolean) {
      if (payload !== undefined) {
        this.Sidebar_drawer = payload;
      } else {
        this.Sidebar_drawer = !this.Sidebar_drawer;
      }
    },
    SET_MINI_SIDEBAR(payload: boolean) {
      this.mini_sidebar = payload;
    },
    SET_CUSTOMIZER_DRAWER(payload: boolean) {
      this.Customizer_drawer = payload;
    },
    SET_FONT(payload: string) {
      this.fontTheme = payload;
    },
    SET_TEXT_FIELD_BORDER_RADIUS(payload: number) { this.textFieldBorderRadius = Math.min(24, Math.max(0, Math.round(payload))); },
    SET_TEXT_FIELD_VARIANT(payload: string) { this.textFieldVariant = ['outlined', 'filled', 'solo', 'plain', 'underlined'].includes(payload) ? payload as typeof this.textFieldVariant : 'outlined'; },
    SET_UI_DENSITY(payload: string) { this.uiDensity = ['compact', 'default', 'comfortable'].includes(payload) ? payload as typeof this.uiDensity : 'default'; },
    SET_TEXT_SCALE(payload: number) { this.textScale = Math.min(115, Math.max(85, Math.round(payload))); },
    SET_SURFACE_STYLE(payload: string) { this.surfaceStyle = ['elevated', 'rounded', 'tonal', 'premium-executive'].includes(payload) ? payload as typeof this.surfaceStyle : 'elevated'; },
    SET_CONTENT_WIDTH(payload: string) { this.contentWidth = payload === 'compact' ? 'compact' : 'wide'; },
    LOAD_PREFERENCES(serialized: unknown) {
      const preferences = parseCustomizerPreferences(serialized);
      this.fontTheme = preferences.fontTheme; this.inputBg = preferences.inputBg; this.layoutType = preferences.layoutType;
      this.actTheme = preferences.actTheme; this.themeMode = preferences.themeMode; this.menuOrientation = preferences.menuOrientation;
      this.SET_TEXT_FIELD_BORDER_RADIUS(preferences.textFieldBorderRadius); this.SET_TEXT_FIELD_VARIANT(preferences.textFieldVariant);
      this.SET_UI_DENSITY(preferences.uiDensity); this.SET_TEXT_SCALE(preferences.textScale);
      this.SET_SURFACE_STYLE(preferences.surfaceStyle); this.SET_CONTENT_WIDTH(preferences.contentWidth);
    },
    APPLY_PREFERENCES(preferences: CustomizerPreferences) { this.LOAD_PREFERENCES(preferences); },
    SET_THEME(payload: string) {
      this.actTheme = payload;
    },
    SET_LOADING(payload: boolean) {
      this.loading = payload;
    },
    SET_LAYOUT_TYPE(payload: string) {
      this.layoutType = payload;
    },
    SET_THEME_MODE(payload: string) {
      this.themeMode = payload;
    },
    SET_MENU_ORIENTATION(payload: string) {
      this.menuOrientation = payload === 'horizontal' ? 'horizontal' : 'vertical';
    }
  }

});
