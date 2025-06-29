<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Assign Students to Assessments</h2>

    <div class="mb-4">
      <label class="font-semibold">Select Course:</label>
      <select v-model="selectedCourse" @change="fetchAssignments" class="border p-2 rounded ml-2">
        <option value="">-- Select Course --</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.course_code }} - {{ course.course_name }}
        </option>
      </select>
    </div>

    <div v-if="students.length > 0">
      <table class="table-auto w-full border">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 border">Student</th>
            <th class="p-2 border">Matric</th>
            <template v-if="assessments.length > 0">
              <th v-for="assessment in assessments"
                  :key="assessment.id"
                  class="p-2 border">
                {{ assessment.title }}<br /><small>({{ assessment.type }})</small>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.student_id">
            <td class="p-2 border">{{ student.name }}</td>
            <td class="p-2 border">{{ student.matric_number }}</td>
            <template v-if="assessments.length > 0">
              <td v-for="ass in student.assessments"
                  :key="ass.assessment_id"
                  class="p-2 border text-center">
                <input type="checkbox" :checked="ass.assigned"
                       @change="toggleAssignment(student.student_id, ass)" />
              </td>
            </template>
          </tr>
        </tbody>
      </table>

      <div v-if="assessments.length === 0" class="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded">
        ⚠ This course currently has no assessments.
        <router-link to="/lecturer/assessments" class="ml-2 text-blue-600 underline">
          ➕ Create Assessments
        </router-link>
      </div>
    </div>

    <div v-else-if="selectedCourse">
      <p>No students enrolled in this course yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const selectedCourse = ref('')
const courses = ref([])
const students = ref([])
const assessments = ref([])

async function fetchCourses() {
  try {
    const res = await fetch('/api/lecturer/courses')
    if (!res.ok) throw new Error('Failed to fetch courses')
    courses.value = await res.json()
  } catch (err) {
    console.error(err)
    courses.value = []
  }
}

async function fetchAssignments() {
  if (!selectedCourse.value) return
  try {
    const res = await fetch(`/api/lecturer/course-assignment/${selectedCourse.value}`)
    if (!res.ok) throw new Error('Failed to fetch assignments')
    const data = await res.json()
    students.value = data

    if (data.length > 0 && data[0].assessments) {
      assessments.value = data[0].assessments.map(a => ({
        id: a.assessment_id,
        title: a.title,
        type: a.type
      }))
    } else {
      assessments.value = []
    }
  } catch (err) {
    console.error(err)
    students.value = []
    assessments.value = []
  }
}

async function toggleAssignment(studentId, ass) {
  try {
    if (ass.assigned) {
      await fetch(`/api/lecturer/assign-mark/${ass.assessment_id}/${studentId}`, {
        method: 'DELETE'
      })
      ass.assigned = false
    } else {
      await fetch('/api/lecturer/assign-mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessment_id: ass.assessment_id,
          student_id: studentId
        })
      })
      ass.assigned = true
    }
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
input[type="checkbox"] {
  width: 20px;
  height: 20px;
}
</style>
