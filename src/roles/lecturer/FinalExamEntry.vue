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
        <label class="font-semibold">Final Mark :</label>
        <input type="number" v-model.number="finalMark" max="30" min="0" class="border p-2 rounded w-full mt-1" />
      </div>

      <!-- Final Weight Input -->
      <div class="mb-4">
        <label class="font-semibold">Final Exam Weight (%, optional):</label>
        <input type="number" v-model.number="finalWeight" min="0" max="100"
               class="border p-2 rounded w-full mt-1" />
      </div>

      <!-- Show total assessment weight -->
      <div class="mt-4">
        <p><strong>Total assessment weight:</strong> {{ totalAssessmentWeight }}%</p>
        <p><strong>Remaining for final exam:</strong> {{ 100 - totalAssessmentWeight }}%</p>
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
        <button
          @click="saveFinalMark"
          class="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          :disabled="totalCombinedWeight > 100"
        >
          💾 Save
        </button>
        <button v-if="finalMark" @click="deleteFinalMark" class="bg-red-600 text-white px-4 py-2 rounded">
          🗑 Delete
        </button>
        <button @click="downloadExcel" class="bg-blue-600 text-white px-4 py-2 rounded">
  📥 Download Excel
</button>
      </div>

      <!-- Warning -->
      <div v-if="totalCombinedWeight > 100" class="mt-4 text-red-600">
        ⚠ Total weight exceeds 100%! Adjust assessments or final weight.
      </div>
    </div>

    <div v-else class="text-center text-gray-500 mt-10">
      Loading...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as XLSX from 'xlsx'  // ✅ <-- add this

const route = useRoute()
const router = useRouter()

const finalMark = ref(0)
const finalWeight = ref(0)
const studentName = ref('')
const matricNumber = ref('')
const courseName = ref('')
const assessments = ref([])
const loaded = ref(false)

const totalAssessmentWeight = computed(() =>
  assessments.value.reduce((sum, a) => sum + (Number(a.weight) || 0), 0)
)

const totalCombinedWeight = computed(() =>
  totalAssessmentWeight.value + (finalWeight.value || 0)
)

onMounted(async () => {
  try {
    const { course_id, student_id } = route.params
    const res = await fetch(`/api/lecturer/final-exams/${course_id}/${student_id}`)
    const data = await res.json()

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
  if (totalCombinedWeight.value > 100) {
    alert('Total weight exceeds 100%. Cannot save.')
    return
  }

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

// ✅ Export to Excel
function downloadExcel() {
  // prepare data
  const data = [
    { Label: 'Course', Value: courseName.value },
    { Label: 'Student', Value: `${studentName.value} (${matricNumber.value})` },
    { Label: 'Final Mark', Value: finalMark.value },
    { Label: 'Final Weight', Value: `${finalWeight.value}%` },
    { Label: 'Total Assessments Weight', Value: `${totalAssessmentWeight.value}%` },
    { Label: 'Total Combined Weight', Value: `${totalCombinedWeight.value}%` }
  ]

  // flatten assessments
  const assessmentData = assessments.value.map(a => ({
    Title: a.title,
    Type: a.type,
    MaxMark: a.max_mark,
    Weight: `${a.weight}%`
  }))

  // create sheet
  const ws1 = XLSX.utils.json_to_sheet(data)
  const ws2 = XLSX.utils.json_to_sheet(assessmentData)

  // create workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws1, "Summary")
  XLSX.utils.book_append_sheet(wb, ws2, "Assessments")

  // download
  XLSX.writeFile(wb, `Final_Exam_${studentName.value || 'Student'}.xlsx`)
}
</script>
