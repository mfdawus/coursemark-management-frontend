<template>
  <div>
    <!-- Student Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Student Dashboard</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#studentNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="studentNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/student/compare">Class Ranking</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/student/simulator">What‑If</router-link>
            </li>
          </ul>
          <button class="btn btn-outline-danger" @click="logout">Logout</button>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <div class="container py-5">
      <router-view /> <!-- 👈 This is the missing piece to show child pages -->
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
