import { defineStore } from 'pinia';

export const useCustomizerStore = defineStore({
  id: 'customizer',
  state: () => ({
    Sidebar_drawer: false,
    Customizer_drawer: false,
    mini_sidebar: false,
    fontTheme: 'inter',
    inputBg: 'default',
    layoutType: 'full-width',
    actTheme: 'modern',
    loading: false,
    themeMode: 'light', // 'light' or 'dark'
    menuOrientation: 'vertical' // 'vertical' or 'horizontal'
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
      this.menuOrientation = payload;
    }
  }

});
