import { createRouter, createWebHistory } from 'vue-router'

const Login            = () => import('../views/LoginPanel.vue')
const StudentDashboard = () => import('../views/StudentDashboard.vue')
const LecturerPanel    = () => import('../views/LecturerPanel.vue')
const AdvisorWorkspace = () => import('../views/AdvisorWorkspace.vue')
const AdminPanel       = () => import('../views/AdminPanel.vue')

const routes = [
  { path: '/',         redirect: '/login' },
  { path: '/login',    component: Login },
  { path: '/student',  component: StudentDashboard },
  { path: '/lecturer', component: LecturerPanel },
  { path: '/advisor',  component: AdvisorWorkspace },
  { path: '/admin',    component: AdminPanel },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
// in src/router/index.js, after creating the router:
// router.beforeEach((to, from, next) => {
//   if (to.path !== '/login' && !localStorage.getItem('role')) {
//     return next('/login')
//   }
//   next()
// })
