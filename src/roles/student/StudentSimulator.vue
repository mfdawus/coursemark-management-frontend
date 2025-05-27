<template>
  <div class="container">
    <h3 class="mb-4">📈 What‑If Grade Simulator</h3>
    <form class="card card-body shadow-sm">
      <div class="mb-3">
        <label class="form-label">Expected Midterm (%)</label>
        <input v-model.number="midterm" type="number" class="form-control" min="0" max="50" />
      </div>
      <div class="mb-3">
        <label class="form-label">Expected Final (%)</label>
        <input v-model.number="final" type="number" class="form-control" min="0" max="50" />
      </div>
    </form>
    <div class="alert alert-success mt-3" v-if="total >= 50">
      ✅ Projected Total: <strong>{{ total }}</strong> – You pass!
    </div>
    <div class="alert alert-danger mt-3" v-else>
      ❌ Projected Total: <strong>{{ total }}</strong> – You might fail. Reconsider your strategy!
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const midterm = ref(0)
const final = ref(0)
const total = computed(() => midterm.value + final.value)
</script>
