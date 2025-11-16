import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const RedTheme: ThemeTypes = {
  name: 'RedTheme',
  dark: false,
  variables: {
    'border-color': '#1e88e5',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#203461',
    secondary: '#EC407A',
    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',
    lightprimary: '#eef2f6',
    lightsecondary: '#FDE8EF',
    lightsuccess: '#b9f6ca',
    lighterror: '#f9d8d8',
    lightwarning: '#fff8e1',
    darkText: '#212121',
    lightText: '#616161',
    darkprimary: '#132145',
    darksecondary: '#E42A5D',
    borderLight: '#d0d0d0',
    inputBorder: '#787878',
    containerBg: '#f1f6ff',
    surface: '#fff',
    'on-surface-variant': '#fff',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#fafafa',
    primary200: '#c7d9f6',
    secondary200: '#FDE8EF',
    white: '#FFFFFF',
    // Additional color variations

    primary300: '#90caf9',
    primary400: '#7ea6ec',
    primary500: '#407dd3',
    primary600: '#1b5295',
    primary700: '#083260',
    primary800: '#071c3c',
    primary900: '#01050b',

    secondary400: '#F8BBD9',
    secondary600: '#D81B60',
    secondary800: '#C2185B'
  }
};

export { RedTheme };
