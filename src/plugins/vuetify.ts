import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { icons } from './mdi-icon'; // Import icons from separate file
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Light Themes
import { ModernTheme } from '@/theme/lightThemes/ModernTheme';
import { PurpleTheme } from '@/theme/lightThemes/PurpleTheme';
import { RedTheme } from '@/theme/lightThemes/RedTheme';
import { OrangeTheme } from '@/theme/lightThemes/OrangeTheme';
import { SteelTealGreen } from '@/theme/lightThemes/SteelTealGreen';
import { TealTheme } from '@/theme/lightThemes/TealTheme';
import { SilverTheme } from '@/theme/lightThemes/SilverTheme';

// Dark Themes
import { DarkModernTheme } from '@/theme/darkThemes/DarkModernTheme';
import { DarkOrangeTheme } from '@/theme/darkThemes/DarkOrangeTheme';
import { DarkPurpleTheme } from '@/theme/darkThemes/DarkPurpleTheme';
import { DarkSteelTealGreen } from '@/theme/darkThemes/DarkSteelTealGreen';
import { DarkTealTheme } from '@/theme/darkThemes/DarkTealTheme';
import { DarkSilverTheme } from '@/theme/darkThemes/DarkSilverTheme';
import { DarkRedTheme } from '@/theme/darkThemes/DarkRedTheme';



export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      ...icons
    },
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'ModernTheme',
    themes: {
      // Light Themes
      ModernTheme,
      PurpleTheme,
      RedTheme,
      OrangeTheme,
      SteelTealGreen,
      TealTheme,
      SilverTheme,
      // Dark Themes
      DarkModernTheme,
      DarkOrangeTheme,
      DarkPurpleTheme,
      DarkSteelTealGreen,
      DarkTealTheme,
      DarkSilverTheme,
      DarkRedTheme
    }
  },
  defaults: {
    VBtn: {},
    VCard: {
      rounded: 'md'
    },
    VTextField: {
      rounded: 'lg'
    },
    VTooltip: {
      // set v-tooltip default location to top
      location: 'top'
    }
  }
});
