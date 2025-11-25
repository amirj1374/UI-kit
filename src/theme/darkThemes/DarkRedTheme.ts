import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const DarkRedTheme: ThemeTypes = {
  name: 'DarkRedTheme',
  dark: true,
  variables: {
    'border-color': '#EC407A',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#EC407A', // Bright pink/red for dark mode
    secondary: '#FF6B9D', // Lighter pink/red
    info: '#03c9d7', // Cyan
    success: '#00c853', // Green
    accent: '#FFAB91', // Orange accent
    warning: '#ffc107', // Amber
    error: '#f44336', // Red
    lightprimary: '#1a1a1a', // Dark background
    lightsecondary: '#2d2d2d', // Darker secondary background
    lightsuccess: '#064e3b', // Dark green
    lighterror: '#7f1d1d', // Dark red
    lightwarning: '#78350f', // Dark amber
    darkText: '#ffffff', // White text
    lightText: '#d1d5db', // Light gray text
    darkprimary: '#E42A5D', // Darker pink/red
    darksecondary: '#FF6B9D', // Lighter pink/red
    borderLight: '#404040', // Dark border
    inputBorder: '#525252', // Dark input border
    containerBg: '#0E1226', // Very dark background
    surface: '#020510', // Dark surface
    'on-surface-variant': '#2d2d2d', // Dark surface variant
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#0f0f0f', // Very dark gray
    primary200: '#c7d9f6',
    secondary200: '#525252', // Medium gray
    white: '#1a1a1a', // Dark surface
    // Additional color variations
    primary300: '#90caf9',
    primary400: '#7ea6ec',
    primary500: '#407dd3',
    primary600: '#1b5295',
    primary700: '#083260',
    primary800: '#071c3c',
    primary900: '#01050b',

    secondary400: '#FFB3D1', // Light pink
    secondary600: '#FF6B9D', // Medium pink
    secondary800: '#F06292' // Darker pink
  }
};

export { DarkRedTheme };
