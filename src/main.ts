import { createApp } from 'vue'
import App from './App.vue'
import VueContextMenu from 'vue-contextmenu'
var app = createApp(App)
app.use(VueContextMenu)
app.mount('#app')
