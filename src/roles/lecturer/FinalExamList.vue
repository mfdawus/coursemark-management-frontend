<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Final Exam Marks (30%)</h2>
<div class="flex space-x-2 mb-4">
  <!-- <button @click="exportPDF" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
    Export PDF
  </button> -->
  <button @click="exportExcel" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
    Export Excel
  </button>
</div>
    <table class="table-auto w-full border">
  <thead class="bg-gray-100">
    <tr>
      <th class="p-2 border">Student</th>
      <th class="p-2 border">Matric</th>
      <th class="p-2 border">Course</th>
      <th class="p-2 border">Final Mark</th>
      <th class="p-2 border">GPA</th>
      <th class="p-2 border">Action</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="entry in students" :key="entry.student_id + '-' + entry.course_id">
      <td class="p-2 border">{{ entry.name }}</td>
      <td class="p-2 border">{{ entry.matric_number }}</td>
      <td class="p-2 border">{{ entry.course_code }} - {{ entry.course_name }}</td>
      <td class="p-2 border">{{ entry.final_mark ?? '-' }}</td>
      <td class="p-2 border">
    {{ (entry.gpa !== null && entry.gpa !== undefined) ? Number(entry.gpa).toFixed(2) : '-' }}
</td>

      <td class="p-2 border">
        <button
          class="bg-blue-500 text-white px-3 py-1 rounded"
          @click="goToEntry(entry.course_id, entry.student_id)">
          ➡ Enter Mark
        </button>
      </td>
    </tr>
  </tbody>
</table>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const students = ref([])
const router = useRouter()

async function fetchStudents() {
  const res = await fetch('/api/lecturer/final-exams')
  students.value = await res.json()
}

function goToEntry(courseId, studentId) {
  router.push({
    path: `/lecturer/final-exams/${courseId}/${studentId}`
  })
}



function exportExcel() {
  const ws_data = [
    ["#", "Student Name", "Matric Number", "Course", "Final Mark", "GPA"],
    ...students.value.map((item, index) => [
      index + 1,
      item.name,
      item.matric_number,
      item.course_name,
      item.final_mark ?? '-',
      (item.gpa !== null && item.gpa !== undefined) ? Number(item.gpa).toFixed(2) : '-'
    ])
  ]
  const ws = XLSX.utils.aoa_to_sheet(ws_data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Final Exams")
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), "final_exam_list.xlsx")
}



onMounted(() => {
  fetchStudents()
})
</script>
