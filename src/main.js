

createApp(App).mount('#app')
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Bootstrap & Popper
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

createApp(App).use(router).mount('#app')


router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user')) // or use Pinia/Vuex

    if (to.path.startsWith('/student') && user?.role !== 'student') {
        return next('/login')
    }
    if (to.path.startsWith('/lecturer') && user?.role !== 'lecturer') {
        return next('/login/staff')
    }
    if (to.path.startsWith('/advisor') && user?.role !== 'advisor') {
        return next('/login/staff')
    }
    if (to.path.startsWith('/admin') && user?.role !== 'admin') {
        return next('/login/staff')
    }

    next()
})

