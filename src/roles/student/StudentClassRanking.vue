<template>
  <div class="container py-4">
    <h3 class="mb-4">🏅 Class Ranking</h3>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <select v-model="selectedSubject" class="form-select w-auto">
        <option disabled value="">Select Subject</option>
        <option v-for="subject in subjects" :key="subject">{{ subject }}</option>
      </select>

      <input type="text" class="form-control w-25" v-model="searchQuery" placeholder="Search student..." />
    </div>

    <ol class="list-group list-group-numbered">
      <li
        v-for="(s, i) in filteredRankings"
        :key="i"
        class="list-group-item d-flex justify-content-between align-items-center"
        :class="{
          'list-group-item-warning': i === 0,
          'list-group-item-secondary': i === 1,
          'list-group-item-info': i === 2,
          'list-group-item-primary': s.name === 'You'
        }"
      >
        <div>
          <strong>{{ getMedal(i) }}</strong>
          {{ s.name }}
        </div>
        <span class="badge bg-dark rounded-pill">
          {{ s.total }} pts {{ s.trend }}
        </span>
      </li>
    </ol>

    <div class="alert alert-info mt-4">
      📊 You are currently ranked <strong>{{ getStudentRank }}</strong> in
      <strong>{{ selectedSubject || 'your course' }}</strong>.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const subjects = ['Web Development', 'Mathematics', 'Database Systems']
const selectedSubject = ref('Web Development')
const searchQuery = ref('')

const dummyData = {
  'Web Development': [
    { name: 'Alia', total: 98, trend: '⬆️' },
    { name: 'Dawus', total: 92, trend: '⬆️' },
    { name: 'You', total: 85, trend: '⬇️' },
    { name: 'Hakim', total: 78, trend: '⬆️' },
    { name: 'Nadia', total: 75, trend: '⬇️' },
    { name: 'Farah', total: 74, trend: '⬇️' },
    { name: 'Aiman', total: 70, trend: '⬆️' },
    { name: 'Zara', total: 68, trend: '⬆️' },
    { name: 'Firdaus', total: 66, trend: '⬇️' },
    { name: 'Imran', total: 64, trend: '⬆️' }
  ],
  'Mathematics': [
    { name: 'Dawus', total: 95, trend: '⬆️' },
    { name: 'You', total: 90, trend: '⬆️' },
    { name: 'Hakim', total: 88, trend: '⬇️' },
    { name: 'Zara', total: 85, trend: '⬆️' }
  ],
  'Database Systems': [
    { name: 'Farah', total: 99, trend: '⬆️' },
    { name: 'You', total: 90, trend: '⬇️' },
    { name: 'Alia', total: 89, trend: '⬆️' },
    { name: 'Imran', total: 88, trend: '⬇️' }
  ]
}

const rankings = computed(() => {
  return dummyData[selectedSubject.value] || []
})

const filteredRankings = computed(() => {
  return rankings.value.filter(s =>
    s.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const getStudentRank = computed(() => {
  const index = rankings.value.findIndex(s => s.name === 'You')
  if (index === -1) return 'N/A'
  const suffix = (n) => ['st', 'nd', 'rd'][((n + 90) % 100 - 10) % 10 - 1] || 'th'
  return `${index + 1}${suffix(index + 1)}`
})

const getMedal = (index) => {
  if (index === 0) return '🥇'
  if (index === 1) return '🥈'
  if (index === 2) return '🥉'
  return ''
}
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
