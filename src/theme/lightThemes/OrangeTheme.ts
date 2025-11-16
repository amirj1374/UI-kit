import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const OrangeTheme: ThemeTypes = {
  name: 'OrangeTheme',
  dark: false,
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
    lightprimary: '#F8F0E5',
    lightsecondary: '#E3EBEB',
    lightsuccess: '#b9f6ca',
    lighterror: '#f9d8d8',
    lightwarning: '#fff8e1',
    darkText: '#212121',
    lightText: '#616161',
    darkprimary: '#C1761F',
    darksecondary: '#135152',
    borderLight: '#d0d0d0',
    inputBorder: '#787878',
    containerBg: '#fdf3ec',
    surface: '#fff',
    'on-surface-variant': '#fff',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#fafafa',
    primary200: '#F8F0E5',
    secondary200: '#F8F0E5',
    white: '#FFFFFF',
    // Additional color variations
    primary300: '#F4E6D3',
    primary400: '#edb27e',
    primary500: '#efa168',
    primary600: '#dc823a',
    primary700: '#884a17',
    primary800: '#603210',
    primary900: '#351b09',

    secondary400: '#D6E8E8',
    secondary600: '#0F4748',
    secondary800: '#0A3637'
  }
};

export { OrangeTheme };
