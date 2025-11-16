import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const ModernTheme: ThemeTypes = {
  name: 'ModernTheme',
  dark: false,
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
    lightprimary: '#eef2ff', // Indigo 50
    lightsecondary: '#f3f4f6', // Gray 100
    lightsuccess: '#ecfdf5', // Green 50
    lighterror: '#fef2f2', // Red 50
    lightwarning: '#fffbeb', // Amber 50
    darkText: '#1f2937', // Gray 800
    lightText: '#6b7280', // Gray 500
    darkprimary: '#4f46e5', // Indigo 600
    darksecondary: '#7c3aed', // Purple 600
    borderLight: '#e5e7eb', // Gray 200
    inputBorder: '#d1d5db', // Gray 300
    containerBg: '#e9f2ff', // Gray 50
    surface: '#ffffff', // White
    'on-surface-variant': '#ffffff', // White
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#f9fafb', // Gray 50
    primary200: '#e0e7ff', // Indigo 100
    secondary200: '#f3e8ff', // Purple 100
    white: '#FFFFFF',
    // Additional color variations
    primary300: '#c7d2fe',
    primary400: '#7590f1',
    primary500: '#5a4fe4',
    primary600: '#483bc5',
    primary700: '#22215e',
    primary800: '#0b0b5a',
    primary900: '#03031b',


    secondary400: '#e9d5ff', // Purple 200
    secondary600: '#7c3aed', // Purple 600
    secondary800: '#5b21b6' // Purple 800
  }
};

export { ModernTheme };
