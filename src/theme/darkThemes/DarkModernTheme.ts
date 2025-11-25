import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const DarkModernTheme: ThemeTypes = {
  name: 'DarkModernTheme',
  dark: true,
  variables: {
    'border-color': '#6366f1',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#6366f1', // Modern indigo
    secondary: '#8b5cf6', // Purple
    info: '#06b6d4', // Cyan
    success: '#10b981', // Emerald
    accent: '#f59e0b', // Amber
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    lightprimary: '#1e1b4b', // Indigo 900
    lightsecondary: '#1e1b4b', // Indigo 900
    lightsuccess: '#064e3b', // Green 900
    lighterror: '#7f1d1d', // Red 900
    lightwarning: '#78350f', // Amber 900
    darkText: '#f9fafb', // Gray 50
    lightText: '#d1d5db', // Gray 300
    darkprimary: '#818cf8', // Indigo 400
    darksecondary: '#a78bfa', // Purple 400
    borderLight: '#4f5c73', // Gray 700
    inputBorder: '#505c6a', // Gray 600
    containerBg: '#151B32',
    surface: '#0E142B', // Slate 900
    'on-surface-variant': '#e2e8f0', // Slate 200
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#1f2937', // Gray 800
    primary200: '#312e81', // Indigo 800
    secondary200: '#5b21b6', // Purple 800
    white: '#FFFFFF',
    // Additional color variations  
    primary300: '#c7d2fe',
    primary400: '#7590f1',
    primary500: '#5a4fe4',
    primary600: '#483bc5',
    primary700: '#22215e',
    primary800: '#0b0b5a',
    primary900: '#03031b',

    secondary400: '#581c87', // Purple 800
    secondary600: '#6b21a8', // Purple 700
    secondary800: '#4c1d95' // Purple 900
  }
};

export { DarkModernTheme };
