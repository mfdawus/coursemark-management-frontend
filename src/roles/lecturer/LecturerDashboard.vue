<template>
  <div class="d-flex" style="min-height: 100vh;">
    <!-- Sidebar -->
    <div class="bg-primary text-white p-3" style="width: 250px;">
      <h4 class="mb-4">Lecturer Dashboard</h4>
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/lecturer/courses">📘 Course & Students</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/lecturer/assessments">📚 Assessments</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/lecturer/assignments">✅ Assign Assessments</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/lecturer/enrollments">
            👥 Student Enrollments
          </router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/lecturer/final-exams">🎯 Final Exam Marks</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/lecturer/progress">📊 Progress Overview</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/lecturer/analytics">📈 Visual Analytics</router-link>
        </li>
        <button class="btn btn-outline-light w-100" @click="logout">Logout</button>
      </ul>
    </div>

    <!-- Page Content -->
    <div class="flex-grow-1 p-4">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "LecturerDashboard",
  methods: {
    async logout() {
      localStorage.clear();
      await fetch('/api/logout', { method: 'POST' }); // optional but good for session cleanup
      this.$router.push('/login');
    }

  }
};
</script>

<style scoped>
.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
