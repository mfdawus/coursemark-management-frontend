<template>
  <div class="p-4 max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Remarks List for Course {{ courseId }}</h2>

    <table v-if="loaded" class="table-auto w-full border">
      <thead>
        <tr>
          <th class="p-2 border">Student</th>
          <th class="p-2 border">Matric</th>
          <th class="p-2 border">Assessment</th>
          <th class="p-2 border">Status</th>
          <th class="p-2 border">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in remarks" :key="`${row.student_id}-${row.assessment_id}`">
          <td class="p-2 border">{{ row.student_name }}</td>
          <td class="p-2 border">{{ row.matric_number }}</td>
          <td class="p-2 border">{{ row.assessment_title }}</td>
          <td class="p-2 border">{{ row.status }}</td>
          <td class="p-2 border">
            <button @click="goToRemark(row.student_id, row.assessment_id)"
              class="bg-blue-600 text-white px-3 py-1 rounded">
              ✍️ Add/Edit Remark
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="text-center text-gray-500 mt-10">Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const courseId = route.params.course_id

const remarks = ref([])
const loaded = ref(false)

onMounted(async () => {
  const res = await fetch(`/api/remarks/${courseId}`)
  remarks.value = await res.json()
  loaded.value = true
})

function goToRemark(studentId, assessmentId) {
  router.push(`/lecturer/remarks/${studentId}/${assessmentId}`)
}
</script>
