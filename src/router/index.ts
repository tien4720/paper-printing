import { createRouter, createWebHistory } from 'vue-router'
import PrintingView from '../views/PrintingView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: PrintingView,
        },
    ],
})

export default router
