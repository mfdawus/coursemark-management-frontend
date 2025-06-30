<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Assessment Manager</h2>

    <!-- Filter by Course -->
    <div class="mb-4">
      <label class="font-semibold">Filter by Course:</label>
      <select v-model="selectedCourse" class="ml-2 p-2 border rounded" @change="fetchAssessments">
        <option value="">All Courses</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.course_code }} - {{ course.course_name }}
        </option>
      </select>
    </div>

    <!-- Table -->
    <table class="w-full table-auto border mb-6">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">Course</th>
          <th class="p-2 border">Title</th>
          <th class="p-2 border">Type</th>
          <th class="p-2 border">Max Mark</th>
          <th class="p-2 border">Weight</th>
          <th class="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="assess in assessments" :key="assess.id">
          <td class="p-2 border">{{ assess.course_name }}</td>
          <td class="p-2 border">{{ assess.title }}</td>
          <td class="p-2 border">{{ assess.type }}</td>
          <td class="p-2 border">{{ assess.max_mark }}</td>
          <td class="p-2 border">{{ assess.weight }}%</td>
          <td class="p-2 border">
            <button class="bg-green-500 text-white px-2 py-1 rounded mr-2"
              @click="editAssessment(assess)">✏️ Edit</button>
            <button class="bg-red-500 text-white px-2 py-1 rounded"
              @click="deleteAssessment(assess.id)">🗑️ Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form -->
    <div class="border p-4 rounded shadow">
      <h3 class="text-lg font-bold mb-2">{{ editingId ? 'Edit' : 'Add' }} Assessment</h3>
      <div class="mb-2">
        <label>Course:</label>
        <select v-model="form.course_id" class="ml-2 p-2 border rounded">
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.course_code }} - {{ course.course_name }}
          </option>
        </select>
      </div>
      <div class="mb-2">
        <label>Title:</label>
        <input type="text" v-model="form.title" class="p-2 border rounded w-full"/>
      </div>
      <div class="mb-2">
        <label>Type:</label>
        <select v-model="form.type" class="ml-2 p-2 border rounded">
          <option>quiz</option>
          <option>assignment</option>
          <option>lab</option>
          <option>test</option>
          <option>exercise</option>
        </select>
      </div>
      <div class="mb-2">
        <label>Max Mark:</label>
        <input type="number" v-model.number="form.max_mark" class="p-2 border rounded w-full"/>
      </div>
      <div class="mb-2">
        <label>Weight (%):</label>
        <input type="number" v-model.number="form.weight" class="p-2 border rounded w-full"/>
      </div>
      <button class="bg-blue-600 text-white px-4 py-2 rounded" @click="saveAssessment">
        💾 Save
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courses = ref([])
const assessments = ref([])
const selectedCourse = ref('')
const form = ref({
  course_id: '',
  title: '',
  type: 'quiz',
  max_mark: 100,
  weight: 0
})
const editingId = ref(null)

onMounted(async () => {
  await fetchCourses()
  await fetchAssessments()
})

async function fetchCourses() {
  const res = await fetch('/api/lecturer/courses')
  courses.value = await res.json()
}

async function fetchAssessments() {
  const url = selectedCourse.value ? `/api/lecturer/assessments/${selectedCourse.value}` : '/api/lecturer/assessments'
  const res = await fetch(url)
  assessments.value = await res.json()
}

async function saveAssessment() {
  // Calculate total weight for the selected course
  const totalWeight = assessments.value
    .filter(a => a.course_id === form.value.course_id && a.id !== editingId.value)
    .reduce((sum, a) => sum + Number(a.weight), 0)

  // Check if adding this assessment exceeds 70%
  if (totalWeight + Number(form.value.weight) > 70) {
    alert(`Total weight for this course exceeds 70%. Currently: ${totalWeight}%, adding: ${form.value.weight}%`)
    return
  }

  try {
    const method = editingId.value ? 'PUT' : 'POST'
    const url = editingId.value ? `/api/lecturer/assessments/${editingId.value}` : '/api/lecturer/assessments'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form.value, created_by: 1 })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed')
    await fetchAssessments()
    resetForm()
  } catch (err) {
    alert(err.message)
  }
}


function editAssessment(assess) {
  editingId.value = assess.id
  form.value = { ...assess }
}

async function deleteAssessment(id) {
  if (!confirm('Are you sure?')) return
  await fetch(`/api/lecturer/assessments/${id}`, { method: 'DELETE' })
  await fetchAssessments()
}

function resetForm() {
  editingId.value = null
  form.value = { course_id: '', title: '', type: 'quiz', max_mark: 100, weight: 0 }
}
</script>

<style scoped>
/* Keep your preferred style or tailwind here */
</style>
