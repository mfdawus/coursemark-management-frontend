<template>
  <div class="advisee-list">
    <h2>Advisees Grouped by Academic Year</h2>

    <div v-for="(students, year) in studentsByYear" :key="year" class="year-group">
      <h3>{{ year }}</h3>
      <ul>
        <li v-for="student in students" :key="student.id" class="student-item">
          <strong>{{ student.name }}</strong> ({{ student.matrix }}) — GPA:
          <span :class="{ 'at-risk': student.gpa < 2.0 }">{{ student.gpa.toFixed(2) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const studentsByYear = ref({
  'Year 1': [
    { id: 1, name: 'Aina Binti Ahmad', matrix: 'A123', gpa: 3.45 },
    { id: 2, name: 'Ravi Kumar', matrix: 'A124', gpa: 2.88 }
  ],
  'Year 2': [
    { id: 3, name: 'Lim Wei Jin', matrix: 'B223', gpa: 3.72 },
    { id: 4, name: 'Fatimah Zahra', matrix: 'B224', gpa: 1.95 }
  ],
  'Year 3': [
    { id: 5, name: 'Siti Noraini', matrix: 'C323', gpa: 3.10 }
  ]
})
</script>

<style scoped>
.advisee-list {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', sans-serif;
}

.year-group {
  margin-bottom: 2rem;
}

.year-group h3 {
  color: #6c63ff;
  margin-bottom: 0.5rem;
}

.student-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.at-risk {
  color: red;
  font-weight: bold;
}
</style>
