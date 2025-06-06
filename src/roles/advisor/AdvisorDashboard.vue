<template>
  <div class="d-flex" style="min-height: 100vh;">
    <!-- Sidebar -->
    <div class="bg-primary text-white p-3" style="width: 250px;">
      <h4 class="mb-4">Advisor Dashboard</h4>
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/advisor/adviseelist">Advisee List</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/advisor/adviseereport">Advisee Report</router-link>
        </li>
        <button class="btn btn-outline-light w-100" @click="logout">Logout</button>
      </ul>
    </div>


      <!-- Main Content -->
      <div class="flex-grow-1 p-4">
        <router-view />
      </div>
    </div>
</template>

<script>
// import { ref } from 'vue'
// import { useRouter } from 'vue-router'

// const currentView = ref('dashboard')
// const totalStudents = 30
// const atRiskStudents = 5

export default {
  name: "AdvisorDashboard",
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
/* .advisor-dashboard {
  display: flex;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.sidebar {
  width: 240px;
  background-color: #fff;
  border-right: 1px solid #eee;
  padding: 1.5rem;
  height: 100vh;
}
.sidebar h2 {
  margin-bottom: 2rem;
  color: #6c63ff;
}
.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.sidebar nav a {
  text-decoration: none;
  color: #333;
  cursor: pointer;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f9f9f9;
  overflow-y: auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.dashboard-header input {
  padding: 0.5rem;
  width: 300px;
}

.overview-cards {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.card {
  background: #fff;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.quick-links button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  background: #6c63ff;
  color: white;
  border: none;
  border-radius: 4px;
} */
</style>
