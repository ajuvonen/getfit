import {createVuetify} from 'vuetify';
import {aliases, mdi} from 'vuetify/iconsets/mdi-svg';
import icons from '@/icons';
import {COLORS} from '@/constants';

import 'vuetify/styles';

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      ...icons,
    },
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'customLight',
    themes: {
      customLight: {
        dark: false,
        colors: {
          surface: COLORS.offWhite,
        },
      },
    },
  },
});
