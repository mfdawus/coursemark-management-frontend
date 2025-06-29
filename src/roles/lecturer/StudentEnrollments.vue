<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Students Enrolled in Courses</h2>
    <table class="table-auto w-full border">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">Student</th>
          <th class="p-2 border">Matric Number</th>
          <th class="p-2 border">Course</th>
          <th class="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="enroll in enrollments" :key="enroll.enrollment_id">
          <td class="p-2 border">{{ enroll.student_name }}</td>
          <td class="p-2 border">{{ enroll.matric_number }}</td>
          <td class="p-2 border">{{ enroll.course_code }} - {{ enroll.course_name }}</td>
          <td class="p-2 border">
            <button
              class="bg-blue-500 text-white px-3 py-1 rounded"
              @click="goToMarks(enroll)"
            >
              ➡️ Enter Marks
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup name="StudentEnrollments">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const enrollments = ref([])
const router = useRouter()

onMounted(async () => {
  try {
    const res = await fetch('/api/lecturer/enrolled-students')
    if (!res.ok) throw new Error('Failed to fetch enrollments')
    enrollments.value = await res.json()
  } catch (err) {
    console.error(err)
    enrollments.value = []
  }
})

function goToMarks(enroll) {
  router.push({
  name: 'marks-entry',
  params: {
    course_id: enroll.course_id,
    student_id: enroll.student_id
  }
})

}
</script>


<style scoped>
/* Optional styling */
</style>
