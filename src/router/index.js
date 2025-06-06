import { createRouter, createWebHistory } from 'vue-router'

const Login            = () => import('../roles/LoginPanel.vue')
const StudentDashboard = () => import('../roles/student/StudentDashboard.vue')
const LecturerDashboard    = () => import('../roles/lecturer/LecturerDashboard.vue')
const AdvisorWorkspace = () => import('../roles/advisor/AdvisorDashboard.vue')
const AdminPanel       = () => import('../roles/admin/AdminDashboard.vue')

const routes = [
  { path: '/',         redirect: '/login' },
  { path: '/login',    component: Login },
  { path: '/student',  
    component: StudentDashboard,
    children: [
    { path: 'compare', component: () => import('../roles/student/StudentClassRanking.vue') },
    { path: 'simulator', component: () => import('../roles/student/StudentSimulator.vue') }
  ]
      },
  { path: '/lecturer', 
    component: LecturerDashboard,
    children: [
      {
        path: 'courses',
        component: () => import('../roles/lecturer/CourseStudentManager.vue'),
      },
      {
         path: 'marks',
         component: () => import('../roles/lecturer/MarksAndFeedback.vue'),
      },
      {
         path: 'progress',
          component: () => import('../roles/lecturer/ProgressOverview.vue'),
      },
      {
         path: 'analytics',
          component: () => import('../roles/lecturer/LecturerProgress.vue'),
      }
              ]
  },
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
