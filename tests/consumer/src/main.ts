import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@amirjalili1374/ui-kit/dist/style.css';
import UiKit from '@amirjalili1374/ui-kit';
import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.use(createRouter({ history: createWebHistory(), routes: [] }));
app.use(createVuetify());
app.use(UiKit, { locale: 'en-US', direction: 'auto', permissions: permission => permission === 'read' });
app.mount('#app');
