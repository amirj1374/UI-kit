import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const DarkSilverTheme: ThemeTypes = {
  name: 'DarkSilverTheme',
  dark: true,
  variables: {
    'border-color': '#94a3b8',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#94a3b8', // Slate 400 - bright silver
    secondary: '#cbd5e1', // Slate 300 - light silver
    info: '#38bdf8', // Sky 400 - bright blue
    success: '#34d399', // Emerald 400 - bright green
    accent: '#fbbf24', // Amber 400 - bright amber
    warning: '#fbbf24', // Amber 400
    error: '#f87171', // Red 400 - bright red
    lightprimary: '#1e293b', // Slate 800 - dark silver background
    lightsecondary: '#334155', // Slate 700 - darker silver
    lightsuccess: '#064e3b', // Green 900 - dark green
    lighterror: '#7f1d1d', // Red 900 - dark red
    lightwarning: '#78350f', // Amber 900 - dark amber
    darkText: '#f1f5f9', // Slate 100 - light text
    lightText: '#cbd5e1', // Slate 300 - medium text
    darkprimary: '#64748b', // Slate 500 - medium silver
    darksecondary: '#475569', // Slate 600 - darker silver
    borderLight: '#475569', // Slate 600 - dark border
    inputBorder: '#64748b', // Slate 500 - input border
    containerBg: '#0f172a', // Slate 900 - very dark background
    surface: '#1e293b', // Slate 800 - surface background
    'on-surface-variant': '#334155', // Slate 700 - surface variant
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#0f172a', // Slate 900
    primary200: '#334155', // Slate 700
    secondary200: '#475569', // Slate 600
    white: '#1e293b', // Slate 800
    // Additional color variations
    primary300: '#c5d5e8',
    primary400: '#98bbea',
    primary500: '#7493bc',
    primary600: '#577cb3',
    primary700: '#385883',
    primary800: '#1d2839',
    primary900: '#080b10',
    secondary400: '#64748b', // Slate 500
    secondary600: '#94a3b8', // Slate 400
    secondary800: '#64748b' // Slate 500
  }
};

export { DarkSilverTheme };
