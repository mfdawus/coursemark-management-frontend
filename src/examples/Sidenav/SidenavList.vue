<script setup>
import { useRouter, useRoute } from "vue-router";
import SidenavItem from "@/examples/Sidenav/SidenavItem.vue";
import ArgonButton from "@/components/ArgonButton.vue";

// Get reactive route (used for highlighting)
const route = useRoute();

// Get router instance (used for navigation)
const router = useRouter();

// Role from localStorage
const role = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")).role
  : "";

// Highlight active link
function isActive(path) {
  return route.path === path ? "active" : "";
}

// Logout function
function logout() {
  localStorage.clear();
  fetch("/api/logout", { method: "POST" }); // Optional
  router.push("/login");
}
</script>

<template>
  <ul class="navbar-nav">
    <!-- ADMIN -->
    <li class="nav-item" v-if="role === 'admin'">
      <sidenav-item to="/admin/users" :class="isActive('/admin/users')"  nav-text="Manage Users">
        <template #icon>
          <i class="ni ni-single-02 text-primary text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/admin/courses" :class="isActive('/admin/courses')" nav-text="Courses & Enrollments">
        <template #icon>
          <i class="ni ni-books text-primary text-sm opacity-10"></i>
        </template>
      </sidenav-item>
    </li>

    <!-- ADVISOR -->
    <li class="nav-item" v-if="role === 'advisor'">
      <sidenav-item to="/advisor/dashboard" :class="isActive('/advisor/dashboard')" nav-text="Advisor Dashboard">
        <template #icon>
          <i class="ni ni-tv-2 text-info text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/advisor/adviseelist" :class="isActive('/advisor/adviseelist')" nav-text="Advisee List">
        <template #icon>
          <i class="ni ni-hat-3 text-info text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/advisor/adviseereport"  :class="isActive('/advisor/adviseereport')" nav-text="Advisee Report">
        <template #icon>
          <i class="ni ni-collection text-info text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/advisor/rankings" :class="isActive('/advisor/rankings')"  nav-text="Rankings & Comparison">
        <template #icon>
          <i class="ni ni-chart-bar-32 text-info text-sm opacity-10"></i>
        </template>
      </sidenav-item>
    </li>

    <!-- LECTURER -->
    <li class="nav-item" v-if="role === 'lecturer'">
      <sidenav-item to="/lecturer/courses" :class="isActive('/lecturer/courses')"  nav-text="Courses & Students">
        <template #icon>
          <i class="ni ni-books text-warning text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/lecturer/assessments" :class="isActive('/lecturer/assessments')" nav-text="Assessments">
        <template #icon>
          <i class="ni ni-bullet-list-67 text-warning text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/lecturer/assignments" :class="isActive('/lecturer/assignments')" nav-text="Assign Assessments">
        <template #icon>
          <i class="ni ni-check-bold text-warning text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/lecturer/enrollments" :class="isActive('/lecturer/enrollments')" nav-text="Student Enrollments">
        <template #icon>
          <i class="ni ni-circle-08 text-warning text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/lecturer/final-exams" :class="isActive('/lecturer/final-exams')" nav-text="Final Exam Marks">
        <template #icon>
          <i class="ni ni-ruler-pencil text-warning text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/lecturer/remarks" :class="isActive('/lecturer/remarks')" nav-text="Remarks">
        <template #icon>
          <i class="ni ni-single-copy-04 text-warning text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/lecturer/progress" :class="isActive('/lecturer/progress')" nav-text="Progress Overview">
        <template #icon>
          <i class="ni ni-sound-wave text-warning text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/lecturer/analyticss" :class="isActive('/lecturer/analyticss')" nav-text="Visual Analytics">
        <template #icon>
          <i class="ni ni-chart-pie-35 text-warning text-sm opacity-10"></i>
        </template>
      </sidenav-item>
    </li>

    <!-- STUDENT -->
    <li class="nav-item" v-if="role === 'student'">
      <sidenav-item to="/student/dashboard" :class="isActive('/student/dashboard')" nav-text="Student Dashboard">
        <template #icon>
          <i class="ni ni-tv-2 text-success text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/student/mymarks" :class="isActive('/student/mymarks')"  nav-text="My Marks">
        <template #icon>
          <i class="ni ni-chart-bar-32 text-success text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/student/performancetrend" :class="isActive('/student/performancetrend')" nav-text="Performance Trend">
        <template #icon>
          <i class="ni ni-time-alarm text-success text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/student/whatif" :class="isActive('/student/whatif')" nav-text="What-If Simulator">
        <template #icon>
          <i class="ni ni-settings text-success text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/student/rankings" :class="isActive('/student/rankings')"  nav-text="Class Ranking">
        <template #icon>
          <i class="ni ni-trophy text-success text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/student/notifications" :class="isActive('/student/notifications')" nav-text="Notifications">
        <template #icon>
          <i class="ni ni-bell-55 text-success text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/student/recheckrequests" :class="isActive('/student/recheckrequests')" nav-text="Request Rechecking">
        <template #icon>
          <i class="ni ni-curved-next text-success text-sm opacity-10"></i>
        </template>
      </sidenav-item>

      <sidenav-item to="/student/profile"  :class="isActive('/student/profile')"  nav-text="Profile">
        <template #icon>
          <i class="ni ni-single-02 text-success text-sm opacity-10"></i>
        </template>
      </sidenav-item>
    </li>

    <!-- LOGOUT -->
    <li
      class="nav-item logout-btn position-absolute w-100 px-3"
      style="bottom: 1rem"
    >
      <argon-button
        variant="gradient"
        color="danger"
        size="md"
        full-width
        @click="logout"
      >
        <template #icon>
          <i class="ni ni-button-power text-white me-1"></i>
        </template>
        Logout
      </argon-button>
    </li>
  </ul>
</template>
