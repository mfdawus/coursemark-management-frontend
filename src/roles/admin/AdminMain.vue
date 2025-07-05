<template>
  <div>
    <!-- Admin Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Admin</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="adminNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/users">Users</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/courses">Courses & Enrollments</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/logs">Logs</router-link>
            </li>
          </ul>
          <button class="btn btn-outline-light" @click="logout">Logout</button>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <div class="container py-5">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
async function logout() {
  localStorage.clear();
  await fetch('/api/logout', { method: 'POST' }); // optional: clears PHP session
  router.push('/login');
}
</script>
