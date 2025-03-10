import {createApp} from 'vue';
import {createPinia} from 'pinia';

import App from '@/App.vue';
import router from '@/router';
import i18n from '@/i18n';
import vuetifyPlugin from '@/vuetify';

import '@vuepic/vue-datepicker/dist/main.css';
import '@/styles/app.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(vuetifyPlugin);

app.mount('#app');
