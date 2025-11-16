import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const PurpleTheme: ThemeTypes = {
  name: 'PurpleTheme',
  dark: false,
  variables: {
    'border-color': '#1e88e5',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#1e88e5',
    secondary: '#5e35b1',
    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',
    lightprimary: '#eef2f6',
    lightsecondary: '#ede7f6',
    lightsuccess: '#b9f6ca',
    lighterror: '#f9d8d8',
    lightwarning: '#fff8e1',
    darkText: '#212121',
    lightText: '#616161',
    darkprimary: '#1565c0',
    darksecondary: '#4527a0',
    borderLight: '#d0d0d0',
    inputBorder: '#787878',
    containerBg: '#eef6ff',
    surface: '#fff',
    'on-surface-variant': '#fff',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#fafafa',
    primary200: '#A1D2FA',
    secondary200: '#A1D2FA',
    white: '#FFFFFF',
    // Additional color variations
    primary300: '#9fd0f3',
    primary400: '#87bbef',
    primary500: '#5c9fed',
    primary600: '#2567af',
    primary700: '#144a8f',
    primary800: '#093260',
    primary900: '#051832',

    secondary400: '#9575CD',
    secondary600: '#512DA8',
    secondary800: '#4527A0'
  }
};

export { PurpleTheme };
