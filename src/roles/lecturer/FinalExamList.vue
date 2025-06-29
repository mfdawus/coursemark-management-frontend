<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Final Exam Marks (30%)</h2>

    <table class="table-auto w-full border">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">Student</th>
          <th class="p-2 border">Matric</th>
          <th class="p-2 border">Course</th>
          <th class="p-2 border">Final Mark</th>
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

onMounted(() => {
  fetchStudents()
})
</script>
