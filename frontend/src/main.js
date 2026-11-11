import './index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createDialog } from './utils/dialogs'
import { initSocket } from './socket'
import router from './router'
import translationPlugin from './translation'
import App from './App.vue'

import {
  FrappeUI,
  Button,
  TextInput,
  FormControl,
  ErrorMessage,
  Dialog,
  Alert,
  Badge,
  setConfig,
  frappeRequest,
} from 'frappe-ui'

// telemetry plugin optional
// injects the lucide SVG sprite into the DOM so the IconPicker and lucide Icons
// (used for view icons) can render from it
import { spritePlugin } from 'frappe-ui/experimental'

let globalComponents = {
  Button,
  TextInput,
  FormControl,
  ErrorMessage,
  Dialog,
  Alert,
  Badge,
}

// create a pinia instance
let pinia = createPinia()

let app = createApp(App)

setConfig('resourceFetcher', frappeRequest)
app.use(FrappeUI)
app.use(spritePlugin)
app.use(pinia)
app.use(router)
app.use(translationPlugin)
for (let key in globalComponents) {
  app.component(key, globalComponents[key])
}
// app.use(telemetryPlugin, { app_name: 'crm' })

app.config.globalProperties.$dialog = createDialog

let socket
if (import.meta.env.DEV) {
  frappeRequest({ url: '/api/method/crm.www.crm.get_context_for_dev' })
    .then((values) => {
      for (let key in values) {
        window[key] = values[key]
      }
      try {
        socket = initSocket()
        app.config.globalProperties.$socket = socket
      } catch (e) {}
      app.mount('#app')
    })
    .catch((err) => {
      console.warn('Dev context not loaded, mounting with fallback defaults', err)
      window.boot = window.boot || {
        sitename: 'Agora CRM',
        user: 'Administrator',
        user_info: {
          Administrator: {
            fullname: 'Akash Jadon',
            image: 'https://github.com/akashjadon04.png',
          },
        },
      }
      try {
        socket = initSocket()
        app.config.globalProperties.$socket = socket
      } catch (e) {}
      app.mount('#app')
    })
} else {
  socket = initSocket()
  app.config.globalProperties.$socket = socket
  app.mount('#app')
}

if (import.meta.env.DEV) {
  window.$dialog = createDialog
}
