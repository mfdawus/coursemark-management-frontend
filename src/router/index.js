// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

const StudentLogin = () => import("../roles/StudentLogin.vue");
const StaffLogin = () => import("../roles/StaffLogin.vue");

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: StudentLogin },
  { path: "/login/staff", component: StaffLogin },
  {
    path: "/student",
    children: [
      {
        path: "dashboard",
        component: () => import("../roles/student/StudentDashboard.vue"),
      },
      {
        path: "mymarks",
        component: () => import("../roles/student/MyMarks.vue"),
      },
      {
        path: "performancetrend",
        component: () => import("../roles/student/PerformanceTrend.vue"),
      },
      {
        path: "whatif",
        component: () => import("../roles/student/WhatIf.vue"),
      },
      {
        path: "rankings",
        component: () => import("../roles/student/Rankings.vue"),
      },
      {
        path: "notifications",
        component: () => import("../roles/student/Notifications.vue"),
      },
      {
        path: "recheckrequests",
        component: () => import("../roles/student/RecheckRequest.vue"),
      },
      {
        path: "profile",
        component: () => import("../roles/student/Profile.vue"),
      },
    ],
  },
  {
    path: "/lecturer",
    children: [
      {
        path: "courses",
        component: () => import("../roles/lecturer/CourseStudentManager.vue"),
      },
      {
        path: "marks",
        component: () => import("../roles/lecturer/MarksAndFeedback.vue"),
      },
      {
        path: "marks/:course_id/:student_id",
        name: "marks-entry",
        component: () => import("../roles/lecturer/MarksEntryPage.vue"),
        props: true,
      },
      {
        path: "progress",
        component: () => import("../roles/lecturer/ProgressOverview.vue"),
      },
      {
        path: "analytics",
        component: () => import("../roles/lecturer/LecturerProgress.vue"),
      },
      {
        path: "enrollments",
        component: () => import("../roles/lecturer/StudentEnrollments.vue"),
      },
      {
        path: "assessments",
        component: () => import("../roles/lecturer/AssessmentManager.vue"),
      },
      {
        path: "assignments",
        component: () => import("../roles/lecturer/AssignAssessments.vue"),
      },
      {
        path: "final-exams",
        component: () => import("../roles/lecturer/FinalExamList.vue"),
      },
      {
        path: "final-exams/:course_id/:student_id",
        component: () => import("../roles/lecturer/FinalExamEntry.vue"),
        props: true,
      },
      {
        path: "remarks",
        component: () => import("../roles/lecturer/RemarksList.vue"),
      },
      {
        path: "remarks/:course_id/:student_id",
        component: () => import("../roles/lecturer/RemarkEntry.vue"),
        props: true,
      },
      {
        path: "analyticss",
        component: () => import("../roles/lecturer/LecturerAnalytics.vue"),
        props: true,
      },
    ],
  },
  {
    path: "/advisor",
    children: [
      {
        path: "dashboard",
        component: () => import("../roles/advisor/AdvisorDashboard.vue"),
      },
      {
        path: "adviseelist",
        component: () => import("../roles/advisor/AdviseeList.vue"),
      },
      {
        path: "adviseereport",
        component: () => import("../roles/advisor/AdviseeReport.vue"),
      },
      {
        path: "rankings",
        component: () => import("../roles/advisor/AdvisorRankings.vue"),
      },
    ],
  },
  {
    path: "/admin",
    children: [
      { path: "users", component: () => import("../roles/admin/UserList.vue") },
      {
        path: "courses",
        component: () => import("../roles/lecturer/CourseStudentManager.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Add Auth Guard here
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (to.path.startsWith("/student") && user?.role !== "student") {
    return next("/login");
  }
  if (to.path.startsWith("/lecturer") && user?.role !== "lecturer") {
    return next("/login/staff");
  }
  if (to.path.startsWith("/advisor") && user?.role !== "advisor") {
    return next("/login/staff");
  }
  if (to.path.startsWith("/admin") && user?.role !== "admin") {
    return next("/login/staff");
  }

  next();
});

export default router;
