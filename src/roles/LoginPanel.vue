<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router   = useRouter()
const username = ref('')
// const password = ref('')      // you can ignore password for now
const role     = ref('student')

function submit() {
  if (!username.value) {
    return alert('Enter a username')
  }
  // Save to localStorage so other pages can read it
  localStorage.setItem('username', username.value)
  localStorage.setItem('role', role.value)
  // Navigate to the chosen panel
  router.push(`/${role.value}`)
}
</script>

<template>
  <div class="container py-5">
    <h1 class="text-center mb-4">Course Mark App – Login</h1>
    <form @submit.prevent="submit" style="max-width:400px;margin:auto">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model="username" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Role</label>
        <select v-model="role" class="form-select">
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
          <option value="advisor">Academic Advisor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary w-100">Enter</button>
    </form>
  </div>
</template>
