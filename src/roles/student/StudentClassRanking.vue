<template>
  <div class="container">
    <h3 class="mb-4">🏅 Class Ranking</h3>
    <ol class="list-group list-group-numbered">
      <li v-for="(s, i) in rankings" :key="i"
          class="list-group-item d-flex justify-content-between align-items-center"
          :class="{ 'list-group-item-primary': s.name === 'You' }">
        {{ s.name }}
        <span class="badge bg-secondary rounded-pill">{{ s.total }} pts</span>
      </li>
    </ol>

    <div class="alert alert-info mt-4">
      📊 You are currently ranked <strong>{{ studentRank }}</strong> in this course.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const rankings = ref([
  { name: 'Aisyah', total: 92 },
  { name: 'You', total: 85 },
  { name: 'Hakim', total: 78 }
])
const studentRank = ref('2nd')
</script>
