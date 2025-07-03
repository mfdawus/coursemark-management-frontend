<template>
  <div class="p-4 max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Add / Edit Remark</h2>

    <div v-if="loaded">
      <div class="mb-4">
        <label class="block font-semibold mb-1">Message</label>
        <textarea v-model="message" rows="4" class="w-full border p-2 rounded"></textarea>
      </div>

      <div class="mb-4">
        <label class="block font-semibold mb-1">Status</label>
        <select v-model="status" class="w-full border p-2 rounded">
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="rejected">Rejected</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      <button @click="saveRemark" class="bg-green-600 text-white px-4 py-2 rounded">
        💾 Save Remark
      </button>
    </div>
    <div v-else class="text-center text-gray-500 mt-10">Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const studentId = route.params.student_id
const assessmentId = route.params.assessment_id

const message = ref('')
const status = ref('pending')
const loaded = ref(false)

onMounted(async () => {
  const res = await fetch(`/api/remarks/${studentId}/${assessmentId}`)
  const data = await res.json()
  if (data) {
    message.value = data.message || ''
    status.value = data.status || 'pending'
  }
  loaded.value = true
})

async function saveRemark() {
  await fetch('/api/remark', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      student_id: studentId,
      assessment_id: assessmentId,
      message: message.value,
      status: status.value
    })
  })
  alert('Saved!')
  router.push(`/lecturer/remarks/${route.query.course_id || 1}`) // or replace with your nav back
}
</script>
