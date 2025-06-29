<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Marks Entry</h2>

    <div v-if="loading">Loading data...</div>

    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <div class="mb-4">
        <p><strong>Student:</strong> {{ data.student.name }} ({{ data.student.matric_number }})</p>
        <p><strong>Course:</strong> {{ data.course.code }} - {{ data.course.name }}</p>
      </div>

      <table class="w-full table-auto border">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 border">Assessment</th>
            <th class="p-2 border">Type</th>
            <th class="p-2 border">Max Mark</th>
            <th class="p-2 border">Obtained</th>
            <th class="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mark in data.marks" :key="mark.assessment_id">
            <td class="p-2 border">{{ mark.title }}</td>
            <td class="p-2 border">{{ mark.type }}</td>
            <td class="p-2 border">{{ mark.max_mark }}</td>
            <td class="p-2 border">
              <input type="number" v-model.number="mark.mark_obtained"
                     :max="mark.max_mark" class="input w-20"/>
            </td>
            <td class="p-2 border">
              <button class="bg-blue-600 text-white px-3 py-1 rounded"
                      @click="saveMark(mark)">
                Save
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const courseId = route.params.course_id
const studentId = route.params.student_id

const data = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(`/api/lecturer/marks?course_id=${courseId}&student_id=${studentId}`)
    if (!res.ok) throw new Error('Failed to load data')
    data.value = await res.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

async function saveMark(mark) {
  try {
    const res = await fetch('/api/lecturer/marks', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        assessment_id: mark.assessment_id,
        student_id: studentId,
        mark_obtained: mark.mark_obtained
      })
    })
    if (!res.ok) throw new Error('Failed to save mark')
    alert('Mark saved!')
  } catch (err) {
    alert(err.message)
  }
}
</script>

<style scoped>
.input {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 4px 8px;
}
</style>
