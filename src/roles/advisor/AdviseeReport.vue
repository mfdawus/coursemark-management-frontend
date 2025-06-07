<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Progress Overview</h2>
      <div>
        <button class="btn btn-primary me-2" @click="scrollToMarkBreakdown">
          View Full Mark Breakdown
        </button>
        <button class="btn btn-secondary" @click="scrollToClassAverage">
          View Class Average per Component
        </button>
      </div>
    </div>

    <!-- Full Mark Breakdown Section -->
    <div ref="markBreakdown" class="mt-5">
      <h4>Full Mark Breakdown</h4>
      <table class="table table-bordered table-striped mt-3">
        <thead class="table-dark">
          <tr>
            <th>Student Name</th>
            <th>Assignment</th>
            <th>Quiz</th>
            <th>Midterm</th>
            <th>Final</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.name">
            <td>{{ student.name }}</td>
            <td>{{ student.assignment }}</td>
            <td>{{ student.quiz }}</td>
            <td>{{ student.midterm }}</td>
            <td>{{ student.final }}</td>
            <td>{{ student.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Class Average Section -->
    <div ref="classAverage" class="mt-5">
      <h4>Class Average per Component</h4>
      <table class="table table-bordered table-hover mt-3">
        <thead class="table-secondary">
          <tr>
            <th>Component</th>
            <th>Average Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="avg in averages" :key="avg.component">
            <td>{{ avg.component }}</td>
            <td>{{ avg.average }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const markBreakdown = ref(null)
const classAverage = ref(null)

const scrollToMarkBreakdown = () => {
  markBreakdown.value?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToClassAverage = () => {
  classAverage.value?.scrollIntoView({ behavior: 'smooth' })
}

// Dummy student data
const students = ref([
  { name: 'Ali Rahman', assignment: 18, quiz: 7, midterm: 22, final: 38, total: 85 },
  { name: 'Nur Aisyah', assignment: 20, quiz: 8, midterm: 25, final: 40, total: 93 },
  { name: 'John Lee', assignment: 15, quiz: 6, midterm: 20, final: 35, total: 76 }
])

// Dummy averages
const averages = ref([
  { component: 'Assignment', average: 17.7 },
  { component: 'Quiz', average: 7.0 },
  { component: 'Midterm', average: 22.3 },
  { component: 'Final', average: 37.7 },
  { component: 'Total', average: 84.3 }
])
</script>