import '@/polyfills';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from "vue-i18n";
import '@/assets/style.sass';
//@ts-ignore
import App from '@/App.vue';
import router from '@/router';
import 'bootstrap-icons/font/bootstrap-icons.css';
import messages from "@/i18n";

const i18n = createI18n({
  legacy: false,
  locale: "fr",
  messages,
});

const app = createApp(App);
app.use(i18n);
app.use(createPinia());
app.use(router);
app.mount('#app');

