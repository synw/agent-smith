import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Material from '@primevue/themes/material';
import router from './router';
import './assets/index.css';
import "@docdundee/vue/style.css";
import 'primeicons/primeicons.css';

const app = createApp(App);

app.use(router).use(PrimeVue, {
    theme: {
        preset: Material,
        options: {
            cssLayer: {
                name: 'primevue',
                order: 'tailwind-base, primevue, tailwind-utilities'
            }
        }
    }
}).use(ToastService).use(ConfirmationService).mount('#app');
