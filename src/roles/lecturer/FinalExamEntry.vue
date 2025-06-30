<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Enter Final Mark</h2>

    <div v-if="loaded">
      <!-- Course & Student Info -->
      <div class="mb-4">
        <p><strong>Course:</strong> {{ courseName || 'N/A' }}</p>
        <p><strong>Student:</strong> {{ studentName || 'N/A' }} ({{ matricNumber || '-' }})</p>
      </div>

      <!-- Final Mark Input -->
      <div class="mb-4">
        <label class="font-semibold">Final Mark (max 30):</label>
        <input type="number" v-model.number="finalMark" max="30" min="0" class="border p-2 rounded w-full mt-1" />
      </div>

      <!-- Assessment Marks Table -->
      <div class="mt-6">
        <h3 class="text-lg font-bold mb-2">Assessment Marks</h3>
        <table class="table-auto w-full border">
          <thead>
            <tr>
              <th class="p-2 border">Title</th>
              <th class="p-2 border">Type</th>
              <th class="p-2 border">Max Mark</th>
              <th class="p-2 border">Weight (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="assessments.length === 0">
              <td colspan="4" class="p-2 border text-center">No assessments found.</td>
            </tr>
            <tr v-for="assess in assessments" :key="assess.assessment_id">
              <td class="p-2 border">{{ assess.title }}</td>
              <td class="p-2 border">{{ assess.type }}</td>
              <td class="p-2 border">{{ assess.max_mark }}</td>
              <td class="p-2 border">{{ assess.weight }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 mt-6">
        <button @click="saveFinalMark" class="bg-green-600 text-white px-4 py-2 rounded">
          💾 Save
        </button>
        <button v-if="finalMark" @click="deleteFinalMark" class="bg-red-600 text-white px-4 py-2 rounded">
          🗑 Delete
        </button>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 mt-10">
      Loading...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// State
const finalMark = ref(0)
const studentName = ref('')
const matricNumber = ref('')
const courseName = ref('')
const assessments = ref([])
const loaded = ref(false)

onMounted(async () => {
  try {
    const { course_id, student_id } = route.params
    const res = await fetch(`/api/lecturer/final-exams/${course_id}/${student_id}`)
    const data = await res.json()

    // Make sure your API returns all these keys correctly
    finalMark.value = data.final_mark ?? 0
    studentName.value = data.name || ''
    matricNumber.value = data.matric_number || ''
    courseName.value = data.course_name || ''
    assessments.value = data.assessments ?? []
  } catch (err) {
    alert('Failed to load data. Check console.')
    console.error(err)
  } finally {
    loaded.value = true
  }
})

async function saveFinalMark() {
  const { course_id, student_id } = route.params
  await fetch('/api/lecturer/final-exams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      course_id,
      student_id,
      final_mark: finalMark.value
    })
  })
  alert('Saved!')
  router.push('/lecturer/final-exams')
}

async function deleteFinalMark() {
  const { course_id, student_id } = route.params
  await fetch(`/api/lecturer/final-exams/${course_id}/${student_id}`, {
    method: 'DELETE'
  })
  alert('Deleted!')
  router.push('/lecturer/final-exams')
}
</script>
