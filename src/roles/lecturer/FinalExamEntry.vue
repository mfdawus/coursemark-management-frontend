<template>
  <div class="p-4 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Enter Final Mark</h2>
    <div class="mb-4">
      <p><strong>Course:</strong> {{ courseName }}</p>
      <p><strong>Student:</strong> {{ studentName }} ({{ matricNumber }})</p>
    </div>
    <div class="mb-4">
      <label class="font-semibold">Final Mark (max 30):</label>
      <input type="number" v-model.number="finalMark"
             max="30" min="0"
             class="border p-2 rounded w-full mt-1" />
    </div>
    <div class="flex gap-2">
      <button @click="saveFinalMark" class="bg-green-600 text-white px-4 py-2 rounded">
        💾 Save
      </button>
      <button v-if="finalMark" @click="deleteFinalMark" class="bg-red-600 text-white px-4 py-2 rounded">
        🗑 Delete
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const finalMark = ref(0)
const studentName = ref('')
const matricNumber = ref('')
const courseName = ref('')

onMounted(async () => {
  const { course_id, student_id } = route.params
  const res = await fetch(`/api/lecturer/final-exams/${course_id}/${student_id}`)
  const data = await res.json()
  finalMark.value = data.final_mark ?? 0
  studentName.value = data.name
  matricNumber.value = data.matric_number
  courseName.value = data.course_name
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
