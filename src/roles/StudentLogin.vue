<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const matricNumber = ref('')
const password = ref('')
const pin = ref('')
const error = ref('')

async function submit() {
  error.value = ''

  if (!matricNumber.value || !password.value || !pin.value) {
    error.value = 'Please enter both matric number , password and pin.'
    return
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matric_number: matricNumber.value,
        password: password.value,
        pin: pin.value,

      }),
      credentials: 'include'

    })

    const result = await response.json()

    if (response.ok && result.success) {
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify({
        matric: result.matric, // if included in backend
        name: result.name,
        role: result.role
      }))
      // Redirect to correct dashboard
      router.push('/student')
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
        <label class="form-label">Matric Number</label>
        <input v-model="matricNumber" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input type="password" v-model="password" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">PIN</label>
        <input type="pin" v-model="pin" class="form-control" />
      </div>

      <button type="submit" class="btn btn-primary w-100">Login</button>
    </form>
  </div>
</template>