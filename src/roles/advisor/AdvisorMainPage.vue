<template>
  <div class="d-flex" style="min-height: 100vh;">
    <!-- Sidebar -->
    <div class="bg-primary text-white p-3" style="width: 250px;">
      <h4 class="mb-4">
        <router-link class="nav-link text-white" to="/advisor/dashboard">
          <span>📊</span> Advisor Dashboard
        </router-link>
      </h4>
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/advisor/adviseelist">
            <span>👥</span> Advisee List
          </router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/advisor/adviseereport">
            <span>📄</span> Advisee Report
          </router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/advisor/rankings">
            <span>🏅</span> Student Rankings & Comparison
          </router-link>
        </li>
        <button class="btn btn-outline-light w-100" @click="logout">
          <span>🚪</span> Logout
        </button>
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
  name: "AdvisorMainPage",
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>
