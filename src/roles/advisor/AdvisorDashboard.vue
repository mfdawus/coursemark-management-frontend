<template>
  <div>
    <!-- Advisor Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-secondary">
      <div class="container-fluid">
        <a class="navbar-brand text-white" href="#">Advisor</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#advisorNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="advisorNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/advisor">Advisees</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/advisor/notes">Notes</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/advisor/reports">Reports</router-link>
            </li>
          </ul>
          <button class="btn btn-outline-light" @click="logout">Logout</button>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <div class="container py-5">
      <div><!-- Advisor Workspace stub --></div>
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
