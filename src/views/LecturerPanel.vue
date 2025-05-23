<template>
  <div>
    <!-- Lecturer Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Lecturer Dashboard</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#lecturerNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="lecturerNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/lecturer">Manage Courses</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/lecturer/students">Manage Students</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/lecturer/components">Marks Edit</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/lecturer/analytics">Analytics</router-link>
            </li>
          </ul>
          <button class="btn btn-outline-light" @click="logout">Logout</button>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <div class="container py-5">
      <div><!-- Lecturer Panel stub --></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function logout() {
  localStorage.clear()
  router.push('/login')
}
</script>
