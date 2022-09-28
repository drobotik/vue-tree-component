import { createApp } from "vue"
import { store } from '@/tree.state'
import Application from './Tree.vue'
let app = createApp(Application)
app.use(store)
app.mount('#app')
