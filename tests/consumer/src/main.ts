import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@amirjalili1374/ui-kit/dist/style.css';
import UiKit, { UiKitPlugin, createUiKitThemes } from '@amirjalili1374/ui-kit';
import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.use(createRouter({ history: createWebHistory(), routes: [] }));
app.use(createVuetify({ theme: { defaultTheme: 'modern', themes: createUiKitThemes() } }));
void UiKit;
app.use(UiKitPlugin, { locale: 'en-US', direction: 'auto', permissions: { evaluator: permission => permission === 'read' } });
app.mount('#app');
