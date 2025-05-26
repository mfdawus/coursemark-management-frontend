<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Lecturer Dashboard</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/lecturer/courses">Course & Students</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/lecturer/marks">Marks & Feedback</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/lecturer/progress">Progress Overview</router-link>
            </li>
          </ul>
          <button class="btn btn-outline-danger" @click="logout">Logout</button>
        </div>
      </div>
    </nav>

    <!-- Where pages are loaded -->
    <router-view />
  </div>
</template>

<script>

export default {
  name: "LecturerDashboard",
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};

</script>
