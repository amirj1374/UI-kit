import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const DarkOrangeTheme: ThemeTypes = {
  name: 'DarkOrangeTheme',
  dark: true,
  variables: {
    'border-color': '#C77E23',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#C77E23',
    secondary: '#16595A',
    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',
    lightprimary: '#2D1B0A',
    lightsecondary: '#1A2A2A',
    lightsuccess: '#1B3A1B',
    lighterror: '#3A1B1B',
    lightwarning: '#3A2F1B',
    darkText: '#FFFFFF',
    lightText: '#B0B0B0',
    darkprimary: '#E89B4A',
    darksecondary: '#1F7A7A',
    borderLight: '#404040',
    inputBorder: '#606060',
    containerBg: '#010505',
    surface: '#010C12',
    'on-surface-variant': '#E0E0E0',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#2A2A2A',
    primary200: '#2D1B0A',
    secondary200: '#1A2A2A',
    white: '#FFFFFF',
    // Additional color variations
    primary300: '#F4E6D3',
    primary400: '#edb27e',
    primary500: '#efa168',
    primary600: '#dc823a',
    primary700: '#884a17',
    primary800: '#603210',
    primary900: '#351b09',
    secondary400: '#2A4040',
    secondary600: '#1F7A7A',
    secondary800: '#0F4748'
  }
};

export { DarkOrangeTheme };
