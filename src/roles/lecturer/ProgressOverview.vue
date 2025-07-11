<template>
  <div class="p-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded-2xl shadow">
        <h3 class="text-xl font-semibold mb-2">Total Students</h3>
        <p class="text-3xl font-bold">{{ totalStudents }}</p>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow">
        <h3 class="text-xl font-semibold mb-2">Avg Weight Completed</h3>
        <p class="text-3xl font-bold">{{ avgWeight.toFixed(1) }}%</p>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow">
        <h3 class="text-xl font-semibold mb-2">Total Remarks</h3>
        <p class="text-3xl font-bold">{{ totalRemarks }}</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-6">
  <div class="overflow-x-auto rounded-2xl shadow">
   <table class="progress-table">
  <thead>
    <tr>
      <th>Student</th>
      <th>Matric</th>
      <th>Course</th>
      <th># Assessments</th>
      <th># Marks</th>
      <th>Total Marks</th>
      <th>Final Exam</th>
      <th>GPA</th>
      <th># Remarks</th>
      <th>Progress</th>
    </tr>
  </thead>
  <tbody>
        <tr v-for="row in progressData" :key="row.student_id + '-' + row.course_id">
      <td>{{ row.student_name }}</td>
      <td>{{ row.matric_number }}</td>
      <td>{{ row.course_name }}</td>
      <td>{{ row.assessment_count }}</td>
      <td>{{ row.marks_count }}</td>
      <td>{{ row.total_marks }}</td>
      <td>{{ row.final_mark ?? '-' }}</td>
      <td>
        <span v-if="row.gpa !== null && row.gpa !== undefined">{{ Number(row.gpa).toFixed(2) }}</span>
        <span v-else class="text-gray-400 italic">-</span>
      </td>
      <td>{{ row.remark_count }}</td>
      <td>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: (row.total_weight_completed)+'%' }"></div>
        </div>
        <small>{{ row.total_weight_completed }}%</small>
      </td>
    </tr>
  </tbody>
</table>



  </div>
</div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const progressData = ref([])

const totalStudents = computed(() => progressData.value.length)
const avgWeight = computed(() => {
  if (progressData.value.length === 0) return 0
  const total = progressData.value.reduce((sum, r) => sum + (parseFloat(r.total_weight_completed) || 0), 0)
  return total / progressData.value.length
})
const totalRemarks = computed(() => {
  return progressData.value.reduce((sum, r) => sum + (parseInt(r.remark_count) || 0), 0)
})

onMounted(async () => {
  const res = await axios.get('/api/lecturer/progress')
  progressData.value = res.data
})
</script>
<style>
.progress-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
  border-radius: 12px;
  overflow: hidden;
}

.progress-table th,
.progress-table td {
  border: 1px solid #ddd;
  padding: 10px 12px;
  text-align: left;
}

.progress-table th {
  background-color: #f8f8f8;
  font-weight: 600;
  color: #444;
}

.progress-table tr {
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.progress-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.progress-table tr:hover {
  background-color: #e2e8f0;
  transform: scale(1.02);
}

.progress-bar-container {
  background-color: #e2e8f0;
  border-radius: 8px;
  height: 8px;
  width: 100%;
}

.progress-bar {
  background-color: #4299e1; /* blue bar */
  height: 8px;
  border-radius: 8px;
  transition: width 0.4s ease;
}
</style>

