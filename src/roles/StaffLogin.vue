<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

async function submit() {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Please enter both matric number and password.'
    return
  }

  try {
    const response = await fetch('/api/login/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
      credentials: 'include'
    })

    const result = await response.json()

    if (response.ok && result.success) {
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify({
        name: result.name,
        role: result.role
      }))

      // Redirect to correct dashboard
      router.push(`/${result.role}`)
    } else {
      // Show backend error message (like 'Invalid credentials')
      error.value = result.message || 'Login failed.'
    }
  } catch (err) {
    error.value = 'Server error. Please try again later.'
  }
}
</script>

<template>
  <div class="container py-5">
    <h1 class="text-center mb-4">Course Mark App – Login</h1>
    <form @submit.prevent="submit" style="max-width:400px;margin:auto">
      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" v-model="email" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input type="password" v-model="password" class="form-control" />
      </div>

      <button type="submit" class="btn btn-primary w-100">Login</button>
    </form>
  </div>
</template>