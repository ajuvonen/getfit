import {createApp} from 'vue';
import {createPinia} from 'pinia';

import App from '@/App.vue';
import router from '@/router';
import i18n from '@/i18n';

import '@vuepic/vue-datepicker/dist/main.css';

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import {aliases, mdi} from 'vuetify/iconsets/mdi';
import {createVuetify} from 'vuetify';
import {COLORS} from '@/constants';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(
  createVuetify({
    icons: {
      defaultSet: 'mdi',
      aliases,
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
  }),
);

app.mount('#app');
