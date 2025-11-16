import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const SilverTheme: ThemeTypes = {
  name: 'SilverTheme',
  dark: false,
  variables: {
    'border-color': '#64748b',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#64748b', // Slate 500 - elegant silver
    secondary: '#94a3b8', // Slate 400 - lighter silver
    info: '#0ea5e9', // Sky 500 - cool blue
    success: '#10b981', // Emerald 500 - green
    accent: '#f59e0b', // Amber 500 - warm accent
    warning: '#f59e0b', // Amber 500
    error: '#ef4444', // Red 500
    lightprimary: '#f1f5f9', // Slate 100 - very light silver
    lightsecondary: '#f8fafc', // Slate 50 - almost white
    lightsuccess: '#ecfdf5', // Green 50
    lighterror: '#fef2f2', // Red 50
    lightwarning: '#fffbeb', // Amber 50
    darkText: '#1e293b', // Slate 800 - dark text
    lightText: '#64748b', // Slate 500 - medium text
    darkprimary: '#475569', // Slate 600 - darker silver
    darksecondary: '#64748b', // Slate 500
    borderLight: '#e2e8f0', // Slate 200 - light border
    inputBorder: '#cbd5e1', // Slate 300 - input border
    containerBg: '#e1ecfb', // Slate 50 - container background
    surface: '#ffffff', // White
    'on-surface-variant': '#ffffff', // White
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#f8fafc', // Slate 50
    primary200: '#e2e8f0', // Slate 200
    secondary200: '#f1f5f9', // Slate 100
    white: '#FFFFFF',
    // Additional color variations
    primary300: '#c5d5e8',
    primary400: '#98bbea',
    primary500: '#7493bc',
    primary600: '#577cb3',
    primary700: '#385883',
    primary800: '#1d2839',
    primary900: '#080b10',


    secondary400: '#cbd5e1', // Slate 300
    secondary600: '#64748b', // Slate 500
    secondary800: '#475569' // Slate 600
  }
};

export { SilverTheme };
