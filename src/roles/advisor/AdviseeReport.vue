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
            <th>Student ID</th>
            <th>Program</th>
            <th>Assignment</th>
            <th>Quiz</th>
            <th>Midterm</th>
            <th>Final</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.studentId">
            <td>{{ student.name }}</td>
            <td>{{ student.studentId }}</td>
            <td>{{ student.program }}</td>
            <td>{{ student.assignment }}</td>
            <td>{{ student.quiz }}</td>
            <td>{{ student.midterm }}</td>
            <td>{{ student.final }}</td>
            <td>{{ student.total }}</td>
            <td>
              <span class="badge" :class="getStatusBadge(student.total)">
                {{ getStatusLabel(student.total) }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-outline-dark" @click="printReport(student)">
                🖨️ Print
              </button>
            </td>
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

    <!-- Hidden printable area -->
    <div id="printArea" ref="printArea" style="display: none;"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const markBreakdown = ref(null)
const classAverage = ref(null)
const printArea = ref(null)

const scrollToMarkBreakdown = () => {
  markBreakdown.value?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToClassAverage = () => {
  classAverage.value?.scrollIntoView({ behavior: 'smooth' })
}

// Dummy student data
const students = ref([
  {
    name: 'Ali Rahman',
    studentId: '20221001',
    program: 'Software Engineering',
    assignment: 18,
    quiz: 7,
    midterm: 22,
    final: 38,
    total: 85
  },
  {
    name: 'Nur Aisyah',
    studentId: '20221002',
    program: 'Data Science',
    assignment: 20,
    quiz: 8,
    midterm: 25,
    final: 40,
    total: 93
  },
  {
    name: 'John Lee',
    studentId: '20221003',
    program: 'Cybersecurity',
    assignment: 15,
    quiz: 6,
    midterm: 20,
    final: 35,
    total: 76
  },
  {
    name: 'Danish Aiman',
    studentId: '20221004',
    program: 'AI & Robotics',
    assignment: 10,
    quiz: 4,
    midterm: 15,
    final: 25,
    total: 54
  }
])

const averages = ref([
  { component: 'Assignment', average: 15.7 },
  { component: 'Quiz', average: 6.2 },
  { component: 'Midterm', average: 20.5 },
  { component: 'Final', average: 34.5 },
  { component: 'Total', average: 76.2 }
])

const getStatusLabel = (total) => {
  if (total >= 80) return 'Good Standing'
  if (total >= 60) return 'Warning'
  return 'Probation'
}

const getStatusBadge = (total) => {
  if (total >= 80) return 'bg-success'
  if (total >= 60) return 'bg-warning'
  return 'bg-danger'
}

const printReport = (student) => {
  const printableHTML = `
    <html>
      <head>
        <title>Student Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 2rem; }
          h2 { margin-bottom: 0.5rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f5f5f5; }
        </style>
      </head>
      <body>
        <h2>Student Report</h2>
        <p><strong>Name:</strong> ${student.name}</p>
        <p><strong>Student ID:</strong> ${student.studentId}</p>
        <p><strong>Program:</strong> ${student.program}</p>
        <table>
          <tr><th>Component</th><th>Mark</th></tr>
          <tr><td>Assignment</td><td>${student.assignment}</td></tr>
          <tr><td>Quiz</td><td>${student.quiz}</td></tr>
          <tr><td>Midterm</td><td>${student.midterm}</td></tr>
          <tr><td>Final</td><td>${student.final}</td></tr>
          <tr><td><strong>Total</strong></td><td><strong>${student.total}</strong></td></tr>
        </table>
        <p><strong>Status:</strong> ${getStatusLabel(student.total)}</p>
      </body>
    </html>
  `
  const printWindow = window.open('', '', 'width=800,height=600')
  printWindow.document.write(printableHTML)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
  printWindow.close()
}
</script>

<style scoped>
.badge {
  padding: 6px 10px;
  font-size: 0.8rem;
  border-radius: 8px;
}
</style>
