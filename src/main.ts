import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {Vue3Mq} from 'vue3-mq';

import App from './App.vue';
import router from './router';
import i18n from './i18n';

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import {aliases, mdi} from 'vuetify/iconsets/mdi';
import {createVuetify} from 'vuetify';
import {VExpansionPanels} from 'vuetify/components';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(Vue3Mq, {preset: 'vuetify'});
app.use(
  createVuetify({
    components: {VExpansionPanels},
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
  })
);

app.mount('#app');
