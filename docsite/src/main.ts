import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import 'primevue/resources/themes/tailwind-light/theme.css';
import 'primevue/resources/primevue.min.css';

import './assets/index.css';
import "@docdundee/vue/style.css";
import router from './router';

createApp(App).use(router).use(PrimeVue).use(ToastService).use(ConfirmationService).mount('#app')
