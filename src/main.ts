import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import bootstrap from  'bootstrap/dist/js/bootstrap.js'

createApp(App).use(bootstrap).mount('#app');
