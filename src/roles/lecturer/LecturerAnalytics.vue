<template>
  <div class="p-6">
    <!-- SUMMARY CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded-2xl shadow">
        <h3 class="text-xl font-semibold mb-2">Total Students</h3>
        <p class="text-3xl font-bold">{{ summary.total_students }}</p>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow">
        <h3 class="text-xl font-semibold mb-2">Avg Completion</h3>
        <p class="text-3xl font-bold">{{ summary.avg_completion }}%</p>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow">
        <h3 class="text-xl font-semibold mb-2">Avg Final Mark</h3>
        <p class="text-3xl font-bold">{{ summary.avg_final_mark }}</p>
      </div>
    </div>

    <!-- CHARTS -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="bg-white p-4 rounded-2xl shadow">
        <h4 class="font-semibold mb-2">Students by Course</h4>
        <PieChart :chartData="pieChartData" />
      </div>
      <div class="bg-white p-4 rounded-2xl shadow">
        <h4 class="font-semibold mb-2">Avg Completion by Course</h4>
        <BarChart :chartData="barChartData" />
      </div>
      <div class="bg-white p-4 rounded-2xl shadow">
        <h4 class="font-semibold mb-2">Avg Final Marks by Course</h4>
        <LineChart :chartData="lineChartData" />
      </div>
      <div class="bg-white p-4 rounded-2xl shadow">
        <h4 class="font-semibold mb-2">Completion Brackets</h4>
        <DoughnutChart :chartData="doughnutChartData" />
      </div>
    </div>

    <!-- TOP STUDENTS TABLE -->
    <div class="bg-white p-6 rounded-2xl shadow">
      <h4 class="text-xl font-semibold mb-4">Top Students by Completion</h4>
      <table class="min-w-full divide-y divide-gray-300 rounded-2xl overflow-hidden shadow">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left font-semibold text-gray-600">Student</th>
            <th class="px-4 py-2 text-left font-semibold text-gray-600">Matric</th>
            <th class="px-4 py-2 text-left font-semibold text-gray-600">Assessment</th>
            <th class="px-4 py-2 text-left font-semibold text-gray-600">Final</th>
            <th class="px-4 py-2 text-left font-semibold text-gray-600">Total</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="student in topStudents" :key="student.matric_number"
              class="hover:bg-gray-50 transition transform hover:scale-[1.01] duration-200">
            <td class="px-4 py-2">{{ student.student_name }}</td>
            <td class="px-4 py-2">{{ student.matric_number }}</td>
            <td class="px-4 py-2">{{ student.assessment_weight.toFixed(1) }}%</td>
            <td class="px-4 py-2">{{ student.final_weight.toFixed(1) }}%</td>
            <td class="px-4 py-2 font-bold">{{ student.total_completion.toFixed(1) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import LineChart from '@/components/charts/LineChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'

// Summary stats
const summary = ref({
  total_students: 0,
  total_assessments: 0,
  total_remarks: 0,
  avg_completion: 0,
  avg_final_mark: 0
})

// Chart data initialized safely
const pieChartData = ref({
  labels: [],
  datasets: [{
    label: 'Students',
    data: [],
    backgroundColor: []
  }]
})

const barChartData = ref({
  labels: [],
  datasets: [{
    label: 'Avg Completion %',
    data: [],
    backgroundColor: ''
  }]
})

const lineChartData = ref({
  labels: [],
  datasets: [{
    label: 'Avg Final Marks',
    data: [],
    borderColor: '',
    backgroundColor: '',
    fill: true
  }]
})

const doughnutChartData = ref({
  labels: [],
  datasets: [{
    label: 'Completion',
    data: [],
    backgroundColor: []
  }]
})

// Top students table
const topStudents = ref([])

onMounted(async () => {
  const res = await fetch('/api/lecturer/analyticss')
  const data = await res.json()

  summary.value = data.summary
topStudents.value = data.topStudents ?? []


  pieChartData.value = {
  labels: (data.pieData ?? []).map(d => d.course_name),
  datasets: [{
    label: 'Students',
    data: (data.pieData ?? []).map(d => d.student_count),
    backgroundColor: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']
  }]
}

  barChartData.value = {
  labels: (data.barData ?? []).map(d => d.course_name),
  datasets: [{
    label: 'Avg Completion %',
    data: (data.barData ?? []).map(d => parseFloat(d.avg_completion).toFixed(1)),
    backgroundColor: '#3b82f6'
  }]
}

  lineChartData.value = {
  labels: (data.lineData ?? []).map(d => d.course_name),
  datasets: [{
    label: 'Avg Final Marks',
    data: (data.lineData ?? []).map(d => parseFloat(d.avg_final_mark).toFixed(1)),
    borderColor: '#3b82f6',
    backgroundColor: '#93c5fd',
    fill: true
  }]
}

  doughnutChartData.value = {
  labels: Object.keys(data.doughnutData ?? {}),
  datasets: [{
    label: 'Completion',
    data: Object.values(data.doughnutData ?? {}),
    backgroundColor: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa']
  }]
}
})
</script>

