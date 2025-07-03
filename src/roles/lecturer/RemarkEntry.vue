<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Remark Entry</h2>

    <!-- 🔥 Summary box -->
    <div v-if="hasExistingRemark" class="border border-green-400 bg-green-50 p-4 rounded mb-6">
      <h3 class="font-semibold text-green-700 mb-2">Existing Remark Summary</h3>
      <p><strong>Assessment ID:</strong> {{ remark.assessment_id }}</p>
      <p><strong>Message:</strong> {{ remark.message }}</p>
      <p><strong>Status:</strong> {{ remark.status }}</p>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block font-semibold mb-1">Assessment</label>
        <select v-model="remark.assessment_id" class="border rounded w-full p-2">
          <option value="" disabled>Select assessment</option>
          <option v-for="a in assessments" :key="a.id" :value="a.id">
            {{ a.title }} ({{ a.type }})
          </option>
        </select>
      </div>

      <div>
        <label class="block font-semibold mb-1">Message</label>
        <textarea
          v-model="remark.message"
          class="border rounded w-full p-2"
          rows="4"
          placeholder="Enter remark message"
        ></textarea>
      </div>

      <div>
        <label class="block font-semibold mb-1">Status</label>
        <select v-model="remark.status" class="border rounded w-full p-2">
          <option disabled value="">Select status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div>
        <button
          @click="saveRemark"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : 'Save Remark' }}
        </button>
      </div>

      <div v-if="message" class="mt-4 text-green-600 font-medium">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const courseId = route.params.course_id
const studentId = route.params.student_id

const remark = ref({
  assessment_id: '',
  message: '',
  status: ''
})
const assessments = ref([])
const loading = ref(false)
const message = ref('')

const hasExistingRemark = computed(() =>
  remark.value.assessment_id || remark.value.message || remark.value.status
)

onMounted(async () => {
  await loadAssessments()
  await loadExistingRemark()
})

async function loadAssessments() {
  try {
    const res = await fetch(`/api/lecturer/assessments/${courseId}`)
    if (res.ok) {
      assessments.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to load assessments', err)
  }
}

async function loadExistingRemark() {
  try {
    const res = await fetch(`/api/lecturer/remark-requests/${courseId}/${studentId}`)
    if (res.ok) {
      const data = await res.json()
      if (data && Object.keys(data).length) {
        remark.value = data
      }
    }
  } catch (err) {
    console.error('Failed to load remark', err)
  }
}

async function saveRemark() {
  message.value = ''
  loading.value = true
  try {
    const res = await fetch(`/api/lecturer/remark-requests/${courseId}/${studentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(remark.value)
    })
    const data = await res.json()
    if (data.success) {
      message.value = 'Remark saved successfully!'
    } else {
      message.value = 'Failed to save remark.'
    }
  } catch (err) {
    console.error('Error saving remark:', err)
    message.value = 'Error occurred while saving.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
select, input, textarea {
  transition: border-color 0.2s;
}
select:focus, input:focus, textarea:focus {
  border-color: #2563eb;
  outline: none;
}
</style>
