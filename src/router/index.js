import { createRouter, createWebHistory } from 'vue-router'

const StudentLogin = () => import('../roles/StudentLogin.vue')
const StaffLogin = () => import('../roles/StaffLogin.vue')
const StudentDashboard = () => import('../roles/student/StudentMainPage.vue')
const LecturerDashboard = () => import('../roles/lecturer/LecturerDashboard.vue')
const AdvisorDashboard = () => import('../roles/advisor/AdvisorMainPage.vue')
const AdminPanel = () => import('../roles/admin/AdminMain.vue')

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: StudentLogin },
  { path: '/login/staff', component: StaffLogin },
  {
    path: '/student',
    component: StudentDashboard,
    children: [
      { path: 'dashboard', component: () => import('../roles/student/StudentDashboard.vue') },
      { path: 'mymarks', component: () => import('../roles/student/MyMarks.vue') },
      { path: 'fullbreakdown', component: () => import('../roles/student/FullBreakdown.vue') },
      { path: 'performancetrend', component: () => import('../roles/student/PerformanceTrend.vue') },
      { path: 'whatif', component: () => import('../roles/student/WhatIf.vue') },
      { path: 'rankings', component: () => import('../roles/student/Rankings.vue') },
      { path: 'feedbackremarks', component: () => import('../roles/student/FeedbackRemarks.vue') },
      { path: 'notifications', component: () => import('../roles/student/Notifications.vue') },
      { path: 'recheckrequests', component: () => import('../roles/student/RecheckRequest.vue') },
      { path: 'profile', component: () => import('../roles/student/Profile.vue') },

    ]
  },
  {
    path: '/lecturer',
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
        path: 'marks/:course_id/:student_id',
        name: 'marks-entry',
        component: () => import('../roles/lecturer/MarksEntryPage.vue'),
        props: true
      },
      {
        path: 'progress',
        component: () => import('../roles/lecturer/ProgressOverview.vue'),
      },
      {
        path: 'analytics',
        component: () => import('../roles/lecturer/LecturerProgress.vue'),
      },
      {
        path: 'enrollments',
        component: () => import('../roles/lecturer/StudentEnrollments.vue'),
      },
      {
        path: '/lecturer/assessments',
        component: () => import('../roles/lecturer/AssessmentManager.vue')
      },
      {
        path: '/lecturer/assignments',
        component: () => import('../roles/lecturer/AssignAssessments.vue')
      },
      {
        path: 'final-exams',
        component: () => import('../roles/lecturer/FinalExamList.vue'),
      },
      {
        path: 'final-exams/:course_id/:student_id',
        component: () => import('../roles/lecturer/FinalExamEntry.vue'),
        props: true
      },
      {
        path: '/lecturer/remarks',
        component: () => import('../roles/lecturer/RemarksList.vue'),
        props: true
      },
      {
        path: '/lecturer/remarks/:course_id/:student_id',
        component: () => import('../roles/lecturer/RemarkEntry.vue'),
        props: true
      }
    ]
  },


  {
    path: '/advisor',
    component: AdvisorDashboard,
    children: [
      {
        path: 'dashboard',
        component: () => import('../roles/advisor/AdvisorDashboard.vue'),
      },
      {
        path: 'adviseelist',
        component: () => import('../roles/advisor/AdviseeList.vue'),
      },
      {
        path: 'adviseereport',
        component: () => import('../roles/advisor/AdviseeReport.vue'),
      }
    ]
  },
  {
    path: '/admin',
    component: AdminPanel,
    children: [
      {
        path: 'users',
        component: () => import('../roles/admin/UserList.vue'),
      },
      {
        path: 'courses',
        component: () => import('../roles/lecturer/CourseStudentManager.vue'),
      }
    ]
  },
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
